"use client";

import { useState } from "react";
import { site, waLink } from "@/lib/config";

const links = [
  { href: "#productos", label: "Productos" },
  { href: "#autenticidad", label: "Autenticidad" },
  { href: "#tallas", label: "Guía de Tallas" },
  { href: "#envios", label: "Envíos" },
  { href: "#revendedores", label: "Revendedores" },
  { href: "#pagos", label: "Pagos" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#inicio" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center bg-amber-500 font-display text-xl font-bold text-black">
            G
          </span>
          <span className="font-display text-xl font-bold tracking-widest uppercase">
            Garage
            <span className="ml-2 hidden text-xs font-normal tracking-normal text-zinc-400 sm:inline">
              Clothing Boutique · {site.years} años
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-5 text-sm text-zinc-300 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-amber-400">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={waLink("Hola GARAGE 👋 Quiero asesoría para elegir mi prenda.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 md:block"
          >
            Asesoría por WhatsApp
          </a>
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen(!open)}
            className="rounded-md border border-white/15 p-2 lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-zinc-950 px-4 py-3 lg:hidden">
          <ul className="flex flex-col gap-1 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded px-3 py-2 text-zinc-200 hover:bg-white/5 hover:text-amber-400"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <a
                href={waLink("Hola GARAGE 👋 Quiero asesoría para elegir mi prenda.")}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md bg-emerald-500 px-3 py-2 text-center font-semibold text-white"
              >
                Asesoría por WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
