"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { Questao } from "@/types/questao";
import { useCsvData } from "@/hooks/useCsvData";
import FilterBar from "@/components/FilterBar";
import QuestionCard from "@/components/QuestionCard";
import QuestionModal from "@/components/QuestionModal";

export default function HomePage() {
  const { data: raw, loaded, error } = useCsvData();
  const [filters, setFilters] = useState({ ano: "", nivel: "", fase: "", classe: "" });
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Questao | null>(null);

  useEffect(() => {
    setFilters({ ano: "", nivel: "", fase: "", classe: "" });
    setSearch("");
  }, [raw.length]);

  const filtered = useMemo(() => {
    return raw
      .filter((q) => (filters.ano ? q.ano === filters.ano : true))
      .filter((q) => (filters.nivel ? q.nivel === filters.nivel : true))
      .filter((q) => (filters.fase ? q.fase === filters.fase : true))
      .filter((q) => (filters.classe ? q.classe === filters.classe : true))
      .filter((q) => {
        const hay = `${q.titulo || ""} ${q.enunciado || ""}`.toLowerCase();
        return hay.includes(search.toLowerCase());
      });
  }, [raw, filters, search]);

  return (
    <div className="space-y-4">
      {/* Layout: sidebar (20%) + cards (80%) em telas grandes */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <aside className="lg:col-span-1 lg:sticky lg:top-20 self-start">
          <FilterBar raw={raw} filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />
        </aside>

        <section className="lg:col-span-4">
          <div className="mb-2 flex items-center justify-between text-xs sm:text-sm text-gray-600">
            <span>
              <b>{filtered.length}</b> resultado(s)
              {!loaded ? " • carregando…" : ""}
              {error ? ` • erro ao carregar: ${error}` : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((q) => (
              <QuestionCard key={q.id} q={q} onOpen={(qq) => { setActive(qq); setOpen(true); }} />
            ))}
            {loaded && filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
                Nenhuma questão encontrada com os filtros atuais.
              </div>
            )}
          </div>
        </section>
      </div>

      <QuestionModal open={open} onClose={() => setOpen(false)} questao={active} />
    </div>
  );
}