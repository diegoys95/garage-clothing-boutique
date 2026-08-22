"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/ventas", label: "Punto de Venta", icon: "🛒" },
  { href: "/ventas/pedidos", label: "Mis Pedidos", icon: "🧾" },
  { href: "/ventas/chats", label: "Chats", icon: "💬" },
  { href: "/ventas/catalogo", label: "Catálogo y Stock", icon: "🔎" },
];

export default function VentasSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  };

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-white/10 bg-black md:flex">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
          <span className="flex h-8 w-8 items-center justify-center bg-emerald-500 font-display text-lg font-bold text-black">
            G
          </span>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest">Garage</p>
            <p className="text-[10px] tracking-wider text-zinc-500 uppercase">App operativa</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`block rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-emerald-500/10 font-semibold text-emerald-400"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                }`}
              >
                {l.icon} {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <Link href="/admin" className="block rounded-md px-3 py-2 text-sm text-zinc-500 hover:text-zinc-200">
            ⚙️ Panel administrativo
          </Link>
          <Link href="/" className="block rounded-md px-3 py-2 text-sm text-zinc-500 hover:text-zinc-200">
            ↗ Ver tienda pública
          </Link>
          <button
            onClick={logout}
            className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-300"
          >
            ⎋ Cerrar sesión
          </button>
        </div>
      </aside>

      <nav className="sticky top-0 z-40 flex gap-1 overflow-x-auto border-b border-white/10 bg-black px-2 py-2 md:hidden">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium ${
                active ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-400"
              }`}
            >
              {l.icon} {l.label}
            </Link>
          );
        })}
        <button onClick={logout} className="ml-auto whitespace-nowrap px-3 py-1.5 text-xs text-red-400">
          Salir
        </button>
      </nav>
    </>
  );
}
