"use client";
import React, { useState } from "react";
import { Badge, Button } from "@/components/ui";

export default function ClassificarPage() {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState<{ classe: string; confianca: number } | null>(null);

  const handleClassificar = () => {
    if (!texto.trim()) return;
    const t = texto.toLowerCase();
    let classe = "outros";
    if (/(ordem|primeiro|antes|depois|fila|posição)/.test(t)) classe = "ordenacao";
    else if (/(grupo|times|agrupar|distribuir|categorias)/.test(t)) classe = "agrupamento";
    setResultado({ classe, confianca: 0.73 });
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Classificar nova questão</h2>
        <p className="mt-1 text-sm text-gray-600">
          Cole o enunciado abaixo e clique em <b>Classificar</b>. Nesta demo, usamos uma heurística local.
          No projeto real, conectaremos com sua API/serviço de ML.
        </p>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={6}
          placeholder="Cole aqui o texto da questão..."
          className="mt-3 w-full resize-y rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        />
        <div className="mt-3 flex items-center gap-2">
          <Button onClick={handleClassificar}>Classificar</Button>
          <Button variant="outline" onClick={() => { setTexto(""); setResultado(null); }}>Limpar</Button>
        </div>
      </section>

      {resultado && (
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold">Resultado</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge>Classe: <b className="ml-1 capitalize">{resultado.classe}</b></Badge>
            <Badge>Confiança: {(resultado.confianca * 100).toFixed(0)}%</Badge>
          </div>
          <p className="mt-3 text-sm text-gray-700">Prévia do texto:</p>
          <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{texto}</p>
        </section>
      )}
    </div>
  );
}