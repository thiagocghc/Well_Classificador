"use client";
import React from "react";
import type { Questao } from "@/types/questao";
import { Badge, Button } from "@/components/ui";

export default function QuestionCard({ q, onOpen }: { q: Questao; onOpen: (q: Questao) => void }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge>{q.ano}</Badge>
        <Badge>{q.nivel}</Badge>
        <Badge>{q.fase}</Badge>
        <Badge>{q.classe}</Badge>
      </div>
      <h3 className="text-base font-semibold text-gray-900">{q.titulo || `Questão ${q.id}`}</h3>
      {q.enunciado && (
        <p className="mt-1 text-sm text-gray-700 line-clamp-3">{q.enunciado}</p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <Button onClick={() => onOpen(q)}>Ver mais</Button>
      </div>
    </article>
  );
}
