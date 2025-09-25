"use client";
import React from "react";

export default function SobrePage() {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Sobre o Projeto</h2>
        <p className="mt-2 text-sm text-gray-700">
          Interface mobile-first em Next.js para explorar e classificar questões. A aba Explorar filtra por <b>ano</b>, <b>nível</b>, <b>fase</b> e <b>classe</b>,
          exibindo cards com acesso ao texto completo via modal. A aba Classificar recebe um texto e mostra um resultado – conecte com sua API de ML.
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
          <li>Arquitetura: Next.js (App Router) + Tailwind CSS.</li>
          <li>Dataset carregado do próprio projeto (public/).</li>
          <li>Componentes reutilizáveis, design limpo e responsivo.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Próximos passos sugeridos</h3>
        <ol className="mt-2 list-decimal pl-5 text-sm text-gray-700 space-y-1">
          <li>Substituir parser por PapaParse para CSVs complexos.</li>
          <li>Adicionar paginação ou infinite scroll para muitos registros.</li>
          <li>Extrair componentes para /components e criar store global (Zustand/Context).</li>
          <li>Integrar Classificar com API (POST /api/classificar).</li>
          <li>Adicionar testes (Vitest/RTL) e melhorias de acessibilidade.</li>
        </ol>
      </section>
    </div>
  );
}
