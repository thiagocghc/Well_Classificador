"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";

export default function SobrePage() {
  return (
    <div className="space-y-8">
      {/* HERO / GRID */}
      <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Logo OBI - esquerda */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 flex items-center justify-center">
              <Image
                src="/lampada.svg" // troque para /obi-logo.png se tiver a logo oficial
                alt="Logo OBI"
                width={220}
                height={220}
                className="h-auto w-auto"
                priority
              />
            </div>
          </div>

          {/* Texto central */}
          <div className="lg:col-span-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Sobre a OBI e o Projeto
            </h1>

            <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
              Este projeto oferece uma interface <b>mobile-first</b> para explorar e
              classificar questões da Olimpíada Brasileira de Informática (OBI).
              Na aba <b>Explorar</b>, você filtra por <i>ano</i>, <i>fase</i> e <i>nível</i>, além
              de abrir o enunciado completo em um modal. Na aba <b>Classificar</b>,
              você envia um enunciado e recebe a classe sugerida por um modelo,
              integrando com a <b>API da OpenAI</b> no backend.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Stack: Next.js (App Router) + Tailwind CSS.</li>
              <li>• Dados: CSVs públicos no projeto, carregados sem cache.</li>
              <li>• Componentização: cards, filtros, modal e navbar responsivos.</li>
              <li>• Acessibilidade: foco visível, semântica e navegação pelo teclado.</li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/"
                className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Explorar questões
              </Link>
              <Link
                href="/classificar"
                className="rounded-full px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
              >
                Classificar nova questão
              </Link>
            </div>
          </div>

          {/* Card lateral “Saiba mais” */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Saiba mais</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href="https://olimpiada.ic.unicamp.br"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    Site oficial da OBI
                  </a>
                </li>
                <li>
                  <a
                    href="https://olimpiada.ic.unicamp.br/pratique"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    Pratique com questões antigas
                  </a>
                </li>
                <li>
                  <a
                    href="https://olimpiada.ic.unicamp.br/requisitos"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    Requisitos & Regulamento
                  </a>
                </li>
                <li>
                  <a
                    href="https://olimpiada.ic.unicamp.br/contato"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    Contato / Comissão Nacional
                  </a>
                </li>
              </ul>

              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[13px] leading-relaxed text-emerald-900">
                Dica: no nosso app, as páginas <b>Repositório</b> e <b>Explorar</b> usam
                datasets distintos. As questões do repositório ainda não têm classe —
                o modal lateral foi ajustado para isso.
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Próximos passos */}
      <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Próximos passos</h2>
        <ol className="mt-3 list-decimal pl-5 text-[15px] text-gray-700 space-y-1">
          <li>Melhorar avaliação de classe com fine-tuning ou RAG.</li>
          <li>Paginação/infinite-scroll para grandes datasets.</li>
          <li>Exportar resultados (CSV/JSON) e marcar favoritas.</li>
          <li>Testes e monitoramento de qualidade do modelo.</li>
        </ol>
      </section>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
