"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import type { Questao } from "@/types/questao";

type TaskListContextType = {
  items: Questao[];
  add: (q: Questao) => void;
  remove: (id: string | number) => void;
  clear: () => void;
  has: (id: string | number) => boolean;
  count: number;
};

const TaskListContext = createContext<TaskListContextType | null>(null);

export function TaskListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Questao[]>([]);

  const add = useCallback((q: Questao) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === q.id)) return prev;
      return [...prev, q];
    });
  }, []);

  const remove = useCallback((id: string | number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback(
    (id: string | number) => items.some((item) => item.id === id),
    [items]
  );

  return (
    <TaskListContext.Provider value={{ items, add, remove, clear, has, count: items.length }}>
      {children}
    </TaskListContext.Provider>
  );
}

export function useTaskList() {
  const ctx = useContext(TaskListContext);
  if (!ctx) throw new Error("useTaskList must be used within TaskListProvider");
  return ctx;
}
