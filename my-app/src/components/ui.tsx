"use client";
import React from "react";

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-700 border-gray-200 bg-gray-50">
      {children}
    </span>
  );
}

export function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string; }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
    />
  );
}

export function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-gray-300"
    >
      <option value="">{placeholder || "Todos"}</option>
      {options.map((op) => (
        <option key={op} value={op}>{op}</option>
      ))}
    </select>
  );
}

export function Button({ children, onClick, variant = "default", type = "button" }: { children: React.ReactNode; onClick?: () => void; variant?: "default" | "outline" | "ghost"; type?: "button" | "submit"; }) {
  const styles =
    variant === "outline"
      ? "border border-gray-300 bg-white hover:bg-gray-50"
      : variant === "ghost"
      ? "bg-transparent hover:bg-gray-100"
      : "bg-green-700 text-white hover:bg-green-900";
  return (
    <button type={type} onClick={onClick} className={`rounded-xl px-3 py-2 text-sm transition ${styles}`}>
      {children}
    </button>
  );
}
