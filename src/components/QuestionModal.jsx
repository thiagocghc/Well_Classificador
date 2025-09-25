"use client";
import React from "react";
import type { Questao } from "@/types/questao";
import { Badge, Button } from "@/components/ui";

export default function QuestionModal({ open, onClose, questao }: { open: boolean; onClose: () => void; questao?: Questao | null; }) {
  if (!open || !questao) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40 p-2">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-4 sm:p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{questao.titulo || `Questão ${questao.id}`}</h3>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
              <Badge>{questao.ano}</Badge>
              <Badge>{questao.nivel}</Badge>
              <Badge>{questao.fase}</Badge>
              <Badge>{questao.classe}</Badge>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </div>
        <div className="mt-4 max-h-[60vh] overflow-auto pr-1 text-sm text-gray-800">
          <p>{questao.textoCompleto || questao.enunciado || "(Sem texto completo)"}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}
