"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTaskList } from "@/contexts/TaskListContext";
import { FiClipboard, FiX, FiTrash2, FiDownload } from "react-icons/fi";
import type { Questao } from "@/types/questao";

function capitalizeTitle(t: string) {
  return t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
}

async function exportToPdf(items: Questao[]) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const usable = pageWidth - margin * 2;
  let y = 20;

  const checkPage = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 15) {
      doc.addPage();
      y = 20;
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Lista de Questoes Selecionadas", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Total: ${items.length} questao(oes)  |  Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, margin, y);
  y += 10;

  items.forEach((q, idx) => {
    checkPage(40);

    // Linha separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Titulo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const title = `${idx + 1}. ${capitalizeTitle(q.titulo || `Questao ${q.id}`)}`;
    doc.text(title, margin, y);
    y += 6;

    // Metadados
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Ano: ${q.ano}  |  Nivel: ${q.nivel}  |  Fase: ${q.fase}  |  Classe: ${q.classe}`, margin, y);
    y += 6;
    doc.setTextColor(0, 0, 0);

    // Enunciado
    if (q.enunciado || q.textoCompleto) {
      const texto = q.textoCompleto || q.enunciado || "";
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(texto, usable);
      lines.forEach((line: string) => {
        checkPage(6);
        doc.text(line, margin, y);
        y += 5;
      });
    }

    // Pergunta
    const pergunta = (q as any)?.questao ?? (q as any)?.pergunta ?? "";
    if (pergunta) {
      checkPage(10);
      y += 2;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Pergunta:", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const pLines = doc.splitTextToSize(pergunta, usable);
      pLines.forEach((line: string) => {
        checkPage(6);
        doc.text(line, margin, y);
        y += 5;
      });
    }

    // Alternativas
    const rawAlts = (q as any)?.alternativas || "";
    if (rawAlts) {
      checkPage(10);
      y += 2;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Alternativas:", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const altLines = doc.splitTextToSize(rawAlts, usable);
      altLines.forEach((line: string) => {
        checkPage(6);
        doc.text(line, margin, y);
        y += 5;
      });
    }

    y += 6;
  });

  doc.save("questoes-selecionadas.pdf");
}

export default function TaskListPanel() {
  const { items, remove, clear, count } = useTaskList();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <>
      {/* Botao flutuante */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[200] flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
        aria-label="Abrir lista de tarefas"
      >
        <FiClipboard size={18} />
        <span className="hidden sm:inline">Minha Lista</span>
        {count > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-700">
            {count}
          </span>
        )}
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[300] bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Painel lateral */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 z-[400] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Lista de questoes selecionadas"
      >
        {/* Cabecalho */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Minha Lista</h2>
            <p className="text-xs text-gray-500">{count} questao(oes) selecionada(s)</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Fechar painel"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
              <FiClipboard size={40} className="mb-3 opacity-40" />
              <p className="text-sm font-medium">Nenhuma questao adicionada</p>
              <p className="mt-1 text-xs">Clique em &quot;Adicionar&quot; nos cards para selecionar questoes.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((q, idx) => (
                <li
                  key={q.id}
                  className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {capitalizeTitle(q.titulo || `Questao ${q.id}`)}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {q.ano} - {q.nivel} - {q.fase} - {q.classe}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(q.id)}
                    className="shrink-0 rounded-lg p-1 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                    aria-label={`Remover ${q.titulo || `Questao ${q.id}`}`}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rodape com acoes */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 space-y-2">
            <button
              onClick={() => exportToPdf(items)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              <FiDownload size={16} />
              Exportar para PDF
            </button>
            <button
              onClick={clear}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <FiTrash2 size={14} />
              Limpar lista
            </button>
          </div>
        )}
      </div>
    </>
  );
}
