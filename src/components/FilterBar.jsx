"use client";
import React, { useMemo } from "react";
import type { Questao } from "@/types/questao";
import { Button, Input, Select } from "@/components/ui";
import { PATH_CSV } from "@/lib/csv";

export default function FilterBar({ raw, filters, setFilters, search, setSearch }: { raw: Questao[]; filters: { ano: string; nivel: string; fase: string; classe: string }; setFilters: (p: any) => void; search: string; setSearch: (v: string) => void; }) {
  const anos = useMemo(() => Array.from(new Set(raw.map((q) => q.ano))).sort(), [raw]);
  const niveis = useMemo(() => Array.from(new Set(raw.map((q) => q.nivel))).sort(), [raw]);
  const fases = useMemo(() => Array.from(new Set(raw.map((q) => q.fase))).sort(), [raw]);
  const classes = useMemo(() => Array.from(new Set(raw.map((q) => q.classe))).sort(), [raw]);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Filtros</h3>
      <div className="flex flex-col gap-3">
        <Select value={filters.ano} onChange={(v) => setFilters((s: any) => ({ ...s, ano: v }))} options={anos} placeholder="Ano" />
        <Select value={filters.nivel} onChange={(v) => setFilters((s: any) => ({ ...s, nivel: v }))} options={niveis} placeholder="Nível" />
        <Select value={filters.fase} onChange={(v) => setFilters((s: any) => ({ ...s, fase: v }))} options={fases} placeholder="Fase" />
        <Select value={filters.classe} onChange={(v) => setFilters((s: any) => ({ ...s, classe: v }))} options={classes} placeholder="Classe" />
        <Input value={search} onChange={setSearch} placeholder="Buscar por título/enunciado..." />
        <Button variant="outline" onClick={() => setFilters({ ano: "", nivel: "", fase: "", classe: "" })}>Limpar filtros</Button>
      </div>
      <p className="mt-3 text-[11px] text-gray-500">Fonte: {PATH_CSV}</p>
    </section>
  );
}
