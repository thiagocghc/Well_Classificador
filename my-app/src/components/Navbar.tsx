"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/classificar", label: "Classificar" },
  { href: "/repositorio", label: "Repositório" },
  { href: "/sobre", label: "Sobre" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-[100] isolate bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Logo + título */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo Well"
            width={148}
            height={148}
            className="rounded-md"
            priority
          />
          <span className="hidden sm:inline text-[1.15rem] font-bold tracking-tight text-gray-800">
            Well: Classificador de Questões OBI
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((it) => {
            const active = isActive(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`relative group inline-flex items-center px-3 py-1.5 text-sm font-bold transition-all
                  ${
                    active
                      ? "text-emerald-700"
                      : "text-gray-700 hover:text-emerald-700"
                  }`}
              >
                {it.label}
                <span
                  className={`pointer-events-none absolute -bottom-0.5 left-0 right-0 h-[2px] origin-left scale-x-0 transform transition-transform duration-200
                  ${
                    active
                      ? "scale-x-100 bg-emerald-500"
                      : "group-hover:scale-x-100 bg-emerald-400/80"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Botão hamburger (mobile) */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Linha gradiente */}
      <div className="h-[2px] bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500" />

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300
          ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
            {navItems.map((it) => {
              const active = isActive(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className={`w-full rounded-xl px-3 py-2 text-sm font-bold transition
                    ${
                      active
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50"
                    }`}
                >
                  {it.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}