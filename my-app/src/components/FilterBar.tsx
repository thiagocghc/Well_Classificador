"use client";
import React, { useMemo } from "react";
import type { Questao } from "@/types/questao";
import { Input, Select } from "@/components/ui";
import { FaFilter, FaSearch } from "react-icons/fa";
import { FiX } from "react-icons/fi";

type Filters = { ano: string; nivel: string; fase: string; classe: string };

export default function FilterBar({
  raw,
  filters,
  setFilters,
  search,
  setSearch,
}: {
  raw: Questao[];
  filters: Filters;
  setFilters: (p: any) => void;
  search: string;
  setSearch: (v: string) => void;
}) {
  // arrays únicos (como string[])
  const anos = useMemo(
    () => Array.from(new Set(raw.map((q) => String(q.ano || "")))).filter(Boolean).sort(),
    [raw]
  );
  const niveis = useMemo(
    () => Array.from(new Set(raw.map((q) => String(q.nivel || "")))).filter(Boolean).sort(),
    [raw]
  );
  const fases = useMemo(
    () => Array.from(new Set(raw.map((q) => String(q.fase || "")))).filter(Boolean).sort(),
    [raw]
  );
  const classes = useMemo(
    () => Array.from(new Set(raw.map((q) => String(q.classe || "")))).filter(Boolean).sort(),
    [raw]
  );

  const hasActive = !!(filters.ano || filters.nivel || filters.fase || filters.classe);

  const labelMap: Record<keyof Filters, string> = {
    ano: "Ano",
    fase: "Fase",
    nivel: "Nível",
    classe: "Classe",
  };

  const clearAll = () => setFilters({ ano: "", nivel: "", fase: "", classe: "" });
  const clearOne = (k: keyof Filters) => setFilters((s: Filters) => ({ ...s, [k]: "" }));

  const fieldWrap = "space-y-1";
  const selectBase =
    "rounded-xl border bg-white text-sm outline-none transition focus:ring-2 focus:ring-blue-200";
  const selectedRing = "border-blue-500 ring-2 ring-blue-200";

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
      {/* header + limpar tudo (só quando há filtros) */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Filtros</h3>
        {hasActive && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
            title="Limpar todos os filtros"
          >
            <FaFilter className="text-blue-600" />
            Limpar tudo
            <FiX className="text-blue-600" />
          </button>
        )}
      </div>

      {/* pills individuais */}
      {hasActive && (
        <div className="mb-3 flex flex-wrap gap-2">
          {(Object.keys(filters) as (keyof Filters)[])
            .filter((k) => filters[k])
            .map((k) => (
              <span
                key={k}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs"
              >
                <FaFilter className="text-gray-500" />
                <span className="font-medium">{labelMap[k]}:</span>
                <span className="text-gray-700">{String(filters[k])}</span>
                <button
                  onClick={() => clearOne(k)}
                  className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                  aria-label={`Remover filtro ${labelMap[k]}`}
                  title={`Remover filtro ${labelMap[k]}`}
                >
                  <FiX />
                </button>
              </span>
            ))}
        </div>
      )}

      {/* LABEL + SELECT + INPUT (options como string[]) */}
     <div className="flex flex-col gap-4">
  <div className={fieldWrap}>
    <label htmlFor="f-ano" className="text-xs font-medium text-gray-700">Ano</label>
    <Select
      id="f-ano"
      value={filters.ano}
      onChange={(v) => setFilters((s: Filters) => ({ ...s, ano: v }))}
      options={anos}
      placeholder="Todos"
      className={`${selectBase} w-4/5 ${filters.ano ? selectedRing : "border-gray-200"}`}
    />
  </div>

  <div className={fieldWrap}>
    <label htmlFor="f-fase" className="text-xs font-medium text-gray-700">Fase</label>
    <Select
      id="f-fase"
      value={filters.fase}
      onChange={(v) => setFilters((s: Filters) => ({ ...s, fase: v }))}
      options={fases}
      placeholder="Todos"
      className={`${selectBase} w-4/5 ${filters.fase ? selectedRing : "border-gray-200"}`}
    />
  </div>

  <div className={fieldWrap}>
    <label htmlFor="f-nivel" className="text-xs font-medium text-gray-700">Nível</label>
    <Select
      id="f-nivel"
      value={filters.nivel}
      onChange={(v) => setFilters((s: Filters) => ({ ...s, nivel: v }))}
      options={niveis}
      placeholder="Todos"
      className={`${selectBase} w-4/5 ${filters.nivel ? selectedRing : "border-gray-200"}`}
    />
  </div>

  <div className={fieldWrap}>
    <label htmlFor="f-classe" className="text-xs font-medium text-gray-700">Classe</label>
    <Select
      id="f-classe"
      value={filters.classe}
      onChange={(v) => setFilters((s: Filters) => ({ ...s, classe: v }))}
      options={classes}
      placeholder="Todos"
      className={`${selectBase} w-4/5 ${filters.classe ? selectedRing : "border-gray-200"}`}
    />
  </div>

  <div className={fieldWrap}>
    <label htmlFor="f-busca" className="text-xs font-medium text-gray-700">Buscar por título</label>
    <Input
      id="f-busca"
      value={search}
      onChange={setSearch}
      placeholder="Ex.: biblioteca"
      className="w-4/5 rounded-xl border border-gray-200 bg-white text-sm"
    />
  </div>
</div>

    </section>
  );
}