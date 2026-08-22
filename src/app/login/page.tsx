"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "ventas">("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, role }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Error de acceso");
      }
      router.push(role === "admin" ? "/admin" : "/ventas");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-xl"
      >
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center bg-amber-500 font-display text-2xl font-bold text-black">
            G
          </span>
          <h1 className="font-display mt-3 text-xl font-bold uppercase tracking-widest">GARAGE</h1>
          <p className="mt-1 text-xs text-zinc-500">Ambato y Riobamba · Acceso interno</p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`rounded-md border px-3 py-2.5 text-xs font-semibold transition ${
              role === "admin"
                ? "border-amber-500/60 bg-amber-500/10 text-amber-400"
                : "border-white/15 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            ⚙️ Administración
            <span className="mt-0.5 block text-[10px] font-normal opacity-70">Gerencia / bodega</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("ventas")}
            className={`rounded-md border px-3 py-2.5 text-xs font-semibold transition ${
              role === "ventas"
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
                : "border-white/15 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            🛒 App de ventas
            <span className="mt-0.5 block text-[10px] font-normal opacity-70">Asesores de tienda</span>
          </button>
        </div>

        <label className="mb-1 block text-xs font-medium text-zinc-400">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoFocus
          className="w-full rounded-md border border-white/15 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-amber-500/60"
        />
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className={`mt-5 w-full rounded-md px-4 py-2.5 text-sm font-semibold transition disabled:opacity-40 ${
            role === "admin" ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-emerald-500 text-white hover:bg-emerald-400"
          }`}
        >
          {loading ? "Verificando…" : role === "admin" ? "Ingresar al panel" : "Abrir app de ventas"}
        </button>
        <p className="mt-4 text-center text-[11px] text-zinc-600">
          Prototipo demo · admin: garage2026 · ventas: ventas2026
        </p>
      </form>
    </div>
  );
}
