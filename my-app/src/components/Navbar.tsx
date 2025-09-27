"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const items = [
    { href: "/", label: "Explorar" },
    { href: "/classificar", label: "Classificar" },
    { href: "/sobre", label: "Sobre" },
  ];
  return (
    <nav
      className="
        sticky top-0 z-[100] isolate
        bg-white border-b border-gray-200 shadow-sm
      "
    >
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo Well"
            width={200}
            height={190}
            className="rounded-md"
            priority
          />
          <span className="text-2xl font-semibold tracking-tight">
            Well: Classificador de Questões OBI
          </span>
        </Link>

        <div className="flex gap-1">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="px-3 py-1.5 rounded-full text-sm border bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
            >
              {it.label}
            </Link>
          ))}
        </div>
      </div>

      {/* faixa verde de 1rem */}
      <div className="h-8 bg-green-600" />
    </nav>
  );
}
