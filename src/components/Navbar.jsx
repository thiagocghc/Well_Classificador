"use client";
import React from "react";
import Link from "next/link";

export default function Navbar() {
  const items = [
    { href: "/", label: "Explorar" },
    { href: "/classificar", label: "Classificar" },
    { href: "/sobre", label: "Sobre" },
  ];
  return (
    <nav className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-semibold tracking-tight">OBI Classifier</div>
        <div className="flex gap-1">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="px-3 py-1.5 rounded-full text-sm border bg-white text-gray-700 hover:bg-gray-100 border-gray-200">
              {it.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
