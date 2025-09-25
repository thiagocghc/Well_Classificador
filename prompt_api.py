import openai
import pandas as pd
import time
import os

# --- Configuração da Chave da API ---
client = openai.OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")  #Chave da OpenAI
)

# --- Definições das Mensagens do Modelo (System e User Prompt) ---
# As definições e exemplos foram elaborados com base no livro "Jogos de Lógica"

SYSTEM_MESSAGE = (
    "Você é um especialista em classificar questões da OBI em três categorias específicas: ORDENAÇÃO, AGRUPAMENTO e OUTROS.\n\n"
    "Siga este raciocínio passo a passo antes de classificar:\n"

    "1. O objetivo principal da questão é definir ordem de objetos, posição ou arranjo ordenado? Isso inclui ordem explícita (1º, 2º, etc.) ou implícita (antes/depois, vizinhança, restrições de posição)? → Classifique como ORDENAÇÃO.\n"
    "2. A questão foca na atribuição de objetos a um grupo? formação de subconjuntos ou seleção de elementos, sem considerar a ordem entre eles? → Classifique como AGRUPAMENTO.\n"
    "3. A questão envolve principalmente o cálculos de valores, análise de imagens, estruturas como grafos, tabelas ou algoritmos? → Classifique como OUTROS.\n"
    "Árvore de decisão baseada em regras:"
    "1. Teste ORDEM/POSICIONAMENTO → Associa uma pessoa/objeto a uma lista de posições específicas ou envolver restrições de ordem ou vizinhança → ORDENAÇÃO."
    "2. Teste GRUPOS/SUBCONJUNTOS → Associa pessoa/objeto a grupos distintos ou indica relação do tipo junto-separado, sem qualquer relevância para a ordem → AGRUPAMENTO."
    "3. Teste NÚMEROS/CÁLCULO/ESTRUTURAS → Envolve uma explicação baseada em propriedades matemáticas ou interpreta grafos/mapas/tabelas/figuras → OUTROS."
    "Finalize sempre com: Classificação Final: [ordenação|agrupamento|outros]"
)

PROMPT_TEMPLATE = """
EXEMPLOS DE CLASSIFICAÇÃO COM RACIOCÍNIO:

### ORDENAÇÃO:
Enunciado: O DJ vai tocar 8 músicas em uma ordem específica.
Questão: Qual das listas abaixo representa uma sequência possível das músicas?
Análise: A sequência de execução é essencial. Indica sequencia/ordem das músicas.
Classificação Final: ordenação

Enunciado: Cinco alunos vão se sentar em uma fileira. A deve sentar antes de B, e C não pode ficar ao lado de D.
Questão: Qual sequência atende às condições?
Análise: Mesmo com regras, o objetivo é definir posições. Isso caracteriza uma ordenação.
Classificação Final: ordenação

### AGRUPAMENTO:
Enunciado: Para um combo de pizzas, o cliente escolhe 4 entre 7 sabores disponíveis.
Questão: Qual das alternativas representa um grupo completo de sabores?
Análise: O objetivo é formar um grupo. A ordem dos sabores não interfere na resposta.
Classificação Final: agrupamento

Enunciado: Nove pessoas receberam convites para uma festa, e algumas restrições definem quem pode ir junto.
Questão: Qual grupo de convidados atende às condições dadas?
Análise: A questão pede para selecionar quem pode compor o grupo, sem ordem.
Classificação Final: agrupamento

### OUTROS:
Enunciado: Um torneio com 128 jogadores elimina um por rodada.
Questão: Quantas rodadas são necessárias até restar um vencedor?
Análise: Requer aplicação de cálculos para obter o resultado. A questão envolve algum tipo de cálculo.
Classificação Final: outros

Enunciado: Em computação, um grafo é formado por vértices e arestas, e pode ser usado para representar, por exemplo, as divisas entre estados de um país: cada vértice representa um estado e uma aresta indica que dois estados possuem divisa geográfica.
Questão: Analise a figura apresentada e explique como identificar, entre os mapas disponíveis, qual deles corresponde às divisas entre estados representadas pelo grafo à esquerda.
Análise: Interpretação de estruturas gráficas. Não envolve ordem ou grupos.
Classificação Final: outros

---

Agora, classifique a seguinte questão:

Enunciado: {enunciado}
Questão: {questao}

**Siga o raciocínio passo a passo e analise o objetivo principal da questão.**
Finalize com:
Classificação Final: [ordenação|agrupamento|outros]
"""

def classificar_questao_com_cot(enunciado: str, questao: str) -> str:
    """
    Args:
        enunciado (str): Texto do enunciado da questão.
        questao (str): Texto da pergunta da questão.
    Returns:
        str: Classificação final.
    """
    formatted_prompt = PROMPT_TEMPLATE.format(enunciado=enunciado, questao=questao)

    # Definimos os rótulos VÁLIDOS que esperamos do modelo
    VALID_LABELS = ["ordenação", "agrupamento", "outros"]

    try:
        response = client.chat.completions.create(
            model="gpt-5-mini", ###### TESTES NO GPT 5-mini
            messages=[
                {"role": "system", "content": SYSTEM_MESSAGE},
                {"role": "user", "content": formatted_prompt}
            ]
        )
        full_response_text = response.choices[0].message.content.strip()

        classification_label = "outros" # Valor padrão de fallback, só se o modelo falhar se nenhuma correspondência for encontrada

        # Tenta extrair a classificação final usando o delimitador explícito
        if "Classificação Final:" in full_response_text:
            parts = full_response_text.split("Classificação Final:")
            label_raw = parts[1].strip().lower()

            for r in VALID_LABELS:
                if r in label_raw:
                    classification_label = r
                    break
        else:
            # Fallback: Se o modelo não seguir o formato exato, tenta inferir da última linha
            last_line = full_response_text.split('\n')[-1].lower()
            for r in VALID_LABELS:
                if r in last_line:
                    classification_label = r
                    break
            # Último recurso: se a resposta for muito curta e contiver apenas um dos rótulos válidos
            if len(full_response_text.split()) < 10 and classification_label == "outros":
                 for r in VALID_LABELS:
                    if r == full_response_text.lower():
                        classification_label = r
                        break

        # Se mesmo com os fallbacks, a classificação ainda for "outros",
        # pode indicar que o modelo não conseguiu escolher uma das três categorias principais.
        # Isso pode ser registrado para análise posterior.
        return classification_label

    except openai.APIError as e:
        print(f"Erro na API da OpenAI: {e}")
        return "erro_api"
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")
        return "erro_geral"

# --- Fluxo Principal de Processamento ---

INPUT_FILE = "./sample_data/questoes_rotuladas_drwell_sem_imagem_v6.xlsx"
OUTPUT_FILE = "./sample_data/questoes_rotuladas_CoT_GPT50_arvoreTest2.csv"

try:
    df = pd.read_excel(INPUT_FILE)
except FileNotFoundError:
    print(f"Erro: O arquivo {INPUT_FILE} não foi encontrado. Certifique-se de que está no caminho correto.")
    exit()

if 'rotulo' not in df.columns:
    df['rotulo'] = ''

print(f"Iniciando classificação de {len(df)} questões (com base na metodologia do livro)...")
for idx, row in df.iterrows():
    if pd.isna(row['rotulo']) or str(row['rotulo']).strip() == '':
        print(f"\n--- Processando Questão {idx + 1} ---")
        print(f"Enunciado: {row['enunciado'][:100]}...")

        classificacao = classificar_questao_com_cot(str(row['enunciado']), str(row['questao']))

        df.at[idx, 'rotulo'] = classificacao
        print(f"Classificada como: {classificacao}")

        time.sleep(1.4)
    else:
        print(f"Questão {idx + 1} já possui rótulo '{row['rotulo']}'. Pulando.")


df.to_csv(OUTPUT_FILE, index=False)
print(f"\nProcessamento concluído. Arquivo salvo como '{OUTPUT_FILE}'")