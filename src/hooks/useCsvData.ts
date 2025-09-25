"use client";

import { useEffect, useState } from "react";
import { csvToJson, PATH_CSV } from "@/lib/csv";
import type { Questao } from "@/types/questao";

export function useCsvData() {
  const [data, setData] = useState<Questao[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoaded(false);
      setError(null);
      try {
        const res = await fetch(PATH_CSV, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const txt = await res.text();
        const json = csvToJson<Questao>(txt);
        if (alive) setData(json);
      } catch (e: any) {
        if (alive) setError(String(e?.message || e));
        if (alive) setData([]);
      } finally {
        if (alive) setLoaded(true);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  return { data, loaded, error };
}
