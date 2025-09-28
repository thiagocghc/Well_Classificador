import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_MESSAGE = `
Você é um especialista em classificar questões da OBI em três categorias: ORDENAÇÃO, AGRUPAMENTO e OUTROS.

Regras rápidas:
1) Ordem/posição/arranjo → ordenação
2) Formação de grupos/subconjuntos sem ordem → agrupamento
3) Cálculo/contagem/estruturas (grafos, tabelas, figuras etc.) → outros
`;

const PROMPT_TEMPLATE = `
EXEMPLOS (resuma o raciocínio e devolva um JSON final):

[Ordenação]
Enunciado: Cinco alunos sentam em fila, A antes de B, C não ao lado de D.
Questão: Qual sequência atende às condições?
=> ordenação

[Agrupamento]
Enunciado: Escolha 4 sabores dentre 7 disponíveis.
Questão: Qual grupo atende às regras?
=> agrupamento

[Outros]
Enunciado: Torneio com 128 jogadores, elimina um por rodada.
Questão: Quantas rodadas até restar um vencedor?
=> outros

Agora, classifique a seguinte questão.
Enunciado: {ENUNCIADO}
Questão: {QUESTAO}

Responda **apenas** em JSON:
{"classe":"ordenacao|agrupamento|outros","confianca":0.0-1.0}
`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Faltou OPENAI_API_KEY" }), { status: 500 });
    }

    const { enunciado = "", questao = "" } = await req.json();

    const prompt = PROMPT_TEMPLATE
      .replace("{ENUNCIADO}", String(enunciado ?? ""))
      .replace("{QUESTAO}", String(questao ?? ""));

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    //   temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: prompt },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    let data: any = {};
    try { data = JSON.parse(content); } catch { data = {}; }

    // Normaliza classe
    let classeRaw = String(data.classe ?? data.classificacao ?? "outros").toLowerCase();
    // aceita com/sem acento
    if (classeRaw === "ordenacao" || classeRaw === "ordenação") classeRaw = "ordenação";
    else if (classeRaw === "agrupamento") classeRaw = "agrupamento";
    else classeRaw = "outros";

    let confianca = Number(data.confianca ?? data.confidence ?? 0.5);
    if (!Number.isFinite(confianca)) confianca = 0.5;
    confianca = Math.min(1, Math.max(0, confianca));

    return new Response(JSON.stringify({ classe: classeRaw, confianca }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro ao classificar" }), { status: 500 });
  }
}