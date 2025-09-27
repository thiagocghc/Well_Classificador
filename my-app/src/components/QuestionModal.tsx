"use client";
import React from "react";
import type { Questao } from "@/types/questao";
import { Badge, Button } from "@/components/ui";
import { FaCalendarAlt, FaStar, FaFlagCheckered } from "react-icons/fa";

export default function QuestionModal({
  open,
  onClose,
  questao,
}: {
  open: boolean;
  onClose: () => void;
  questao?: Questao | null;
}) {
  if (!open || !questao) return null;

  const getClasseColor = (classe?: string) => {
    switch ((classe || "").toLowerCase()) {
      case "ordenação":
        return "bg-green-100 text-green-800 border-green-200";
      case "agrupamento":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const normalizeClasse = (c?: string) => {
    const v = (c || "Outros").toString().trim();
    return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
  };

  // Capitalizar título (tipo "Roland Garros")
  const capitalizeTitle = (t: string) =>
    t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());

  // Parser de alternativas a partir de UMA string (CSV), ex:
  // "(a) 64 - (b) 65 - (c) 127 - (d) 128 - (e) nenhuma das acima"
  const parseAlternativasFromSingleString = (raw: string): { label: string; text: string }[] => {
    if (!raw) return [];
    const re = /\(([a-eA-E])\)\s*([\s\S]*?)(?=\s*\([a-eA-E]\)|$)/g;
    const found: Record<string, string> = {};
    let m: RegExpExecArray | null;
    while ((m = re.exec(raw)) !== null) {
      const k = m[1].toUpperCase();
      const val = (m[2] || "")
        .replace(/^\s*[-–—]\s*/, "") // remove hífen após o rótulo, se houver
        .trim();
      found[k] = val;
    }
    return ["A", "B", "C", "D", "E"]
      .map((k) => (found[k] ? { label: k, text: found[k] } : null))
      .filter(Boolean) as { label: string; text: string }[];
  };

  // Extrai a string de alternativas (campo único) e parseia
  const rawAlternativas =
    (questao as any)?.alternativas ||
    (questao as any)?.options ||
    (questao as any)?.alts ||
    "";
  const alternativas = typeof rawAlternativas === "string"
    ? parseAlternativasFromSingleString(rawAlternativas)
    : Array.isArray(rawAlternativas)
      ? rawAlternativas.map((t: string, i: number) => ({ label: String.fromCharCode(65 + i), text: t }))
      : [];

  const texto = questao.textoCompleto || questao.enunciado || "(Sem texto completo)";

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40 p-2">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-4 sm:p-6 shadow-xl">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">
              {capitalizeTitle(questao.titulo || `Questão ${questao.id}`)}
            </h3>

            {/* Metadados com RÓTULOS antes dos ícones */}
            <div className="mt-2 grid grid-cols-1 sm:flex gap-2 text-xs text-gray-700">
              <div className="inline-flex items-center gap-2">
                <span className="font-semibold">Ano: </span>
                <span className="inline-flex items-center gap-1">
                  <FaCalendarAlt /> {questao.ano ?? "—"}
                </span>
              </div>

              <div className="inline-flex items-center gap-2">
                <span className="font-semibold">Fase: </span>
                <span className="inline-flex items-center gap-1">
                  <FaFlagCheckered /> {questao.fase ?? "—"}
                </span>
              </div>

              <div className="inline-flex items-center gap-2">
                <span className="font-semibold">Nível: </span>
                <span className="inline-flex items-center gap-1">
                  <FaStar /> {questao.nivel ?? "—"}
                </span>
              </div>

              <div className="inline-flex items-center gap-2">
                <span className="font-semibold">Classe: </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border ${getClasseColor(
                    questao.classe
                  )}`}
                >
                  {normalizeClasse(questao.classe)}
                </span>
              </div>
            </div>
          </div>

          <Button variant="ghost" onClick={onClose} aria-label="Fechar">
            ✕
          </Button>
        </div>

        {/* Conteúdo */}
        <div className="mt-4 max-h-[60vh] overflow-auto pr-1 text-sm text-gray-800 space-y-4">
          {/* Enunciado */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Enunciado</h4>
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="whitespace-pre-wrap leading-relaxed">{texto}</p>
            </div>
          </div>

          {/* Alternativas (derivadas da string única do CSV) */}
          {alternativas.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Alternativas</h4>
              <ul className="space-y-1 text-gray-800">
                {alternativas.map((opt) => (
                  <li key={opt.label} className="flex gap-2">
                    <span className="font-bold">({opt.label})</span>
                    <span>{opt.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}