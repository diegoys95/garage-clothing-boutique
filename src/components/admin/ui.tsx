import type { ReactNode } from "react";

export function fmtMoney(n: number): string {
  return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(n);
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", { day: "2-digit", month: "short" });
}

export function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("es-EC", { day: "2-digit", month: "short" })} ${d.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })}`;
}

export const cardCls = "rounded-xl border border-white/10 bg-zinc-900";
export const inputCls =
  "w-full rounded-md border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-amber-500/60";
export const labelCls = "mb-1 block text-xs font-medium text-zinc-400";
export const btnPrimary =
  "rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-40";
export const btnGhost =
  "rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-amber-500/50 hover:text-amber-400";
export const btnDanger =
  "rounded-md border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10";

const toneMap = {
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  green: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  red: "border-red-500/40 bg-red-500/10 text-red-400",
  blue: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  zinc: "border-white/15 bg-white/5 text-zinc-400",
} as const;

export type Tone = keyof typeof toneMap;

export function Badge({ tone = "zinc", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneMap[tone]}`}>
      {children}
    </span>
  );
}

export function KpiCard({ value, label, sub }: { value: string; label: string; sub?: ReactNode }) {
  return (
    <div className={`${cardCls} p-5`}>
      <p className="font-display text-3xl font-bold text-amber-400">{value}</p>
      <p className="mt-1 text-sm font-medium text-zinc-200">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>}
    </div>
  );
}

export function SectionHeader({ title, desc, children }: { title: string; desc?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase">{title}</h1>
        {desc && <p className="mt-1 text-sm text-zinc-400">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export const STATUS_TONE: Record<string, Tone> = {
  recibido: "blue",
  confirmado: "amber",
  empacado: "amber",
  en_ruta: "blue",
  entregado: "green",
  cancelado: "red",
  por_pagar: "red",
  pagado: "green",
  abierto: "amber",
  convertido: "green",
  cerrado: "zinc",
};
