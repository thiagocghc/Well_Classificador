"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui";
import { FaSortAmountDown, FaObjectGroup, FaQuestionCircle } from "react-icons/fa";

type Resultado = { classe: "ordenação" | "agrupamento" | "outros" | string };

const normalizaClasse = (c: string) => {
  const v = (c || "").toLowerCase();
  if (v === "ordenacao" || v === "ordenação") return "ordenação";
  if (v === "agrupamento") return "agrupamento";
  return "outros";
};

const estiloDaClasse = (c: string) => {
  const classe = normalizaClasse(c);
  if (classe === "ordenação")
    return {
      wrap: "p-10 bg-purple-100 text-purple-800 border-purple-200",
      icon: <FaSortAmountDown />,
      label: "Ordenação",
      desc: "Problemas envolvendo a ordem de objetos.",
    };
  if (classe === "agrupamento")
    return {
      wrap: "p-10 bg-blue-100 text-blue-800 border-blue-200",
      icon: <FaObjectGroup />,
      label: "Agrupamento",
      desc: "Problemas envolvendo a pertinência de objetos a grupos.",
    };
  return {
    wrap: "p-10 bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: <FaQuestionCircle />,
    label: "Outros",
    desc: "Problemas que envolvem cálculos, definições, etc.",
  };
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
      const res = await fetch(`/api/classificar?t=${Date.now()}`, {
        method: "POST",
        cache: "no-store", // Next/React: não usar cache
        headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store", // Browser
         },
        body: JSON.stringify({ enunciado, questao: "" }),
      });

      const data: any = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao classificar");
      setResultado({ classe: normalizaClasse(data.classe) });
    } catch (e: any) {
      setErro(e.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  const ResultadoPill = () => {
    if (!resultado) return null;
    const s = estiloDaClasse(resultado.classe);
    return (
      <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${s.wrap}`}>
        <span className="text-base">{s.icon}</span>
        <span className="font-semibold">{s.label}</span>
      </div>
    );
  };

  return (
    <div className="w-4/5 pt-10 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna ESQUERDA: Formulário */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Classificar uma Nova Questão</h2>
          <p className="mt-1 text-sm text-gray-600">
            Cole o enunciado abaixo e clique em <b>Classificar</b>.
          </p>

          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={8}
            placeholder="Cole aqui o enunciado da questão..."
            className="mt-3 w-full resize-y rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          />

          <div className="mt-3 flex items-center gap-2">
            <Button onClick={handleClassificar} disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Classificando...
                </span>
              ) : (
                "Classificar"
              )}
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

        {/* Coluna DIREITA: Resultado */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Resposta</h3>

          {loading && (
            <div className="flex items-center gap-3 text-gray-700">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
              <span>Classificando…</span>
            </div>
          )}

          {!loading && resultado && (
            <div className="space-y-3">
              <ResultadoPill />
              <p className="text-sm text-gray-700">
                {(() => {
                  const s = estiloDaClasse(resultado.classe);
                  return (
                    <>
                      <span className="font-semibold uppercase">{s.label}:</span> {s.desc}
                    </>
                  );
                })()}
              </p>
            </div>
          )}

          {!loading && !resultado && !erro && (
            <p className="text-sm text-gray-500">
              Aguardando classificação… cole o enunciado e clique em <b>Classificar</b>.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}