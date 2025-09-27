"use client";
import React from "react";
import type { Questao } from "@/types/questao";
import { Badge, Button } from "@/components/ui";
import {
  FaCalendarAlt,
  FaFlagCheckered,
  FaStar,
} from "react-icons/fa";

export default function QuestionCard({
  q,
  onOpen,
}: {
  q: Questao;
  onOpen: (q: Questao) => void;
}) {
  // Definir cores para cada classe
  const getClasseColor = (classe?: string) => {
    switch ((classe || "").toLowerCase()) {
      case "ordenação":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "agrupamento":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  // Capitalizar título (tipo "Roland Garros")
  const capitalizeTitle = (t: string) =>
    t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());

  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1">
          <FaCalendarAlt /> {q.ano}
        </span>
        <span className="inline-flex items-center gap-1">
          <FaStar /> {q.nivel}
        </span>
        <span className="inline-flex items-center gap-1">
          <FaFlagCheckered /> {q.fase}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${getClasseColor(
            q.classe
          )}`}
        >
          {q.classe}
        </span>
      </div>

      {/* aplicar capitalizeTitle aqui */}
      <h3 className="text-base font-semibold text-gray-900">
        {q.titulo ? capitalizeTitle(q.titulo) : `Questão ${q.id}`}
      </h3>

      {q.enunciado && (
        <p className="mt-1 text-sm text-gray-700 line-clamp-3">{q.enunciado}</p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <Button onClick={() => onOpen(q)}>Ver mais</Button>
      </div>
    </article>
  );
}