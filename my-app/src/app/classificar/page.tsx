"use client";
import React, { useState } from "react";
import { Badge, Button } from "@/components/ui";

/** Tipagem do retorno da API */
type Resultado = {
  /** use acento se sua API normaliza assim; senão troque para "ordenacao" */
  classe: "ordenação" | "agrupamento" | "outros" | string;
  confianca: number; // 0..1
};

export default function ClassificarPage() {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleClassificar = async () => {
    setErro(null);
    setResultado(null);
    const enunciado = texto.trim();
    if (!enunciado) return;

    try {
      setLoading(true);
      const res = await fetch("/api/classificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enunciado, questao: "" }),
      });

      const data: Resultado | { error?: string } = await res.json();
      if (!res.ok) throw new Error((data as any)?.error || "Falha ao classificar");

      // sanity: garante número entre 0 e 1
      const conf = Math.min(1, Math.max(0, Number((data as Resultado).confianca ?? 0.5)));
      setResultado({ classe: (data as Resultado).classe, confianca: conf });
    } catch (e: any) {
      setErro(e.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Classificar nova questão</h2>
        <p className="mt-1 text-sm text-gray-600">
          Cole o enunciado abaixo e clique em <b>Classificar</b>. A chamada vai para a API da OpenAI.
        </p>

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={6}
          placeholder="Cole aqui o enunciado da questão..."
          className="mt-3 w-full resize-y rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        />

        <div className="mt-3 flex items-center gap-2">
          <Button onClick={handleClassificar} disabled={loading}>
            {loading ? "Classificando..." : "Classificar"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setTexto("");
              setResultado(null);
              setErro(null);
            }}
            className="border border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Limpar
          </Button>
        </div>

        {erro && <p className="mt-2 text-sm text-red-600">{erro}</p>}
      </section>

      {resultado && (
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold">Resultado</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge>
              Classe: <b className="ml-1 capitalize">{resultado.classe}</b>
            </Badge>
            <Badge>Confiança: {(resultado.confianca * 100).toFixed(0)}%</Badge>
          </div>

          <p className="mt-3 text-sm text-gray-700">Prévia do texto:</p>
          <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{texto}</p>
        </section>
      )}
    </div>
  );
}