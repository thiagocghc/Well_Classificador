import OpenAI from "openai";

export const dynamic = "force-dynamic";   // nunca gerar estático
export const revalidate = 0;              // sem ISR
export const fetchCache = "force-no-store"; // não cachear fetches internos

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_MESSAGE = `
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
`;

const PROMPT_TEMPLATE = `
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

Agora, classifique a seguinte questão, responda **apenas** em JSON:
{"classe":"ordenacao|agrupamento|outros"}
`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Faltou OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const { enunciado = "", questao = "" } = await req.json();

    // LOG de entrada (servidor)
    console.log("[classificar] ENUNCIADO length:", enunciado.length);
    console.log("[classificar] QUESTAO length:", questao.length);

    const messages = [
      { role: "system", content: SYSTEM_MESSAGE },
      // NÃO alteramos o conteúdo do prompt; apenas mandamos como uma mensagem separada
      { role: "user", content: PROMPT_TEMPLATE },
      // Enviamos os textos reais em outra mensagem para garantir que o modelo receba TUDO
      {
        role: "user",
        content: `Enunciado:\n${enunciado}\n\nQuestão:\n${questao || "(sem pergunta)"}`,
      },
    ] as const;

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages,
    });

    const content = completion.choices[0]?.message?.content ?? "{}";

    // LOG da resposta da API (servidor)
    console.log("[classificar] RAW content:", content);

    let data: any = {};
    try {
      data = JSON.parse(content);
    } catch {
      data = {};
    }

    // Normaliza classe
    let classeRaw = String(data.classe ?? data.classificacao ?? "outros").toLowerCase();
    if (classeRaw === "ordenacao" || classeRaw === "ordenação") classeRaw = "ordenação";
    else if (classeRaw === "agrupamento") classeRaw = "agrupamento";
    else classeRaw = "outros";

    // LOG pós-normalização
    console.log("[classificar] classe normalizada:", classeRaw);

    return new Response(JSON.stringify({ classe: classeRaw }), {
      status: 200,
      headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
      },
    });
  } catch (err) {
    console.error("[classificar] erro:", err);
    return new Response(JSON.stringify({ error: "Erro ao classificar" }), {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}