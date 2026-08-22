"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import {
  Badge,
  STATUS_TONE,
  SectionHeader,
  btnGhost,
  btnPrimary,
  cardCls,
  fmtDate,
  fmtMoney,
  inputCls,
  labelCls,
} from "@/components/admin/ui";
import { STATUS_LABELS } from "@/lib/types";

const PROVINCES = ["Tungurahua", "Chimborazo", "Bolívar", "Cotopaxi", "Pastaza"] as const;

export default function RevendedoresPage() {
  const { db, loading, action } = useAdmin();
  const [form, setForm] = useState({ name: "", phone: "", city: "", province: "Tungurahua", discountPct: 15, notes: "" });

  const stats = useMemo(() => {
    if (!db) return new Map<string, { count: number; total: number; last?: string }>();
    const map = new Map<string, { count: number; total: number; last?: string }>();
    for (const o of db.orders.filter((x) => x.type === "revendedor" && x.status !== "cancelado")) {
      const cur = map.get(o.resellerId ?? "") ?? { count: 0, total: 0 };
      cur.count += 1;
      cur.total += o.total;
      if (!cur.last || o.createdAt > cur.last) cur.last = o.createdAt;
      map.set(o.resellerId ?? "", cur);
    }
    return map;
  }, [db]);

  if (loading || !db) return <p className="text-sm text-zinc-500">Cargando revendedores…</p>;

  const resellerOrders = db.orders
    .filter((o) => o.type === "revendedor")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const submit = async () => {
    const ok = await action("reseller.create", form);
    if (ok) setForm({ name: "", phone: "", city: "", province: "Tungurahua", discountPct: 15, notes: "" });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Revendedores" desc="Registro y control de ventas por volumen del canal B2B" />

      <section className={`${cardCls} p-5`}>
        <h2 className="mb-4 text-sm font-semibold tracking-wider text-zinc-300 uppercase">Registrar nuevo revendedor</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Nombre comercial</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Modas Shirley" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>WhatsApp</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+593 …" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Ciudad</label>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Ej. Guaranda" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Provincia</label>
            <select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className={inputCls}>
              {PROVINCES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Descuento por volumen (%)</label>
            <input
              type="number"
              min={0}
              max={50}
              value={form.discountPct}
              onChange={(e) => setForm({ ...form, discountPct: Number(e.target.value) })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Notas</label>
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Opcional" className={inputCls} />
          </div>
        </div>
        <button onClick={submit} disabled={!form.name} className={`${btnPrimary} mt-4`}>
          Registrar revendedor
        </button>
      </section>

      <section className={`${cardCls} overflow-x-auto`}>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs tracking-wider text-zinc-400 uppercase">
              <th className="px-5 py-3">Revendedor</th>
              <th className="px-3 py-3">Ubicación</th>
              <th className="px-3 py-3 text-center">Desc.</th>
              <th className="px-3 py-3 text-center">Pedidos</th>
              <th className="px-3 py-3 text-right">Total comprado</th>
              <th className="px-3 py-3">Última compra</th>
              <th className="px-5 py-3 text-right">Estado</th>
            </tr>
          </thead>
          <tbody>
            {db.resellers.map((r) => {
              const s = stats.get(r.id) ?? { count: 0, total: 0 };
              return (
                <tr key={r.id} className={`border-b border-white/5 align-top last:border-0 ${!r.active ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3">
                    <p className="font-mono text-[10px] text-zinc-500">{r.id}</p>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-zinc-500">{r.phone}</p>
                    {r.notes && <p className="max-w-48 text-[11px] text-zinc-600 italic">{r.notes}</p>}
                  </td>
                  <td className="px-3 py-3 text-zinc-400">
                    {r.city}
                    <p className="text-xs text-zinc-600">{r.province}</p>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge tone="amber">{r.discountPct}%</Badge>
                  </td>
                  <td className="px-3 py-3 text-center">{s.count}</td>
                  <td className="px-3 py-3 text-right font-semibold">{fmtMoney(s.total)}</td>
                  <td className="px-3 py-3 text-zinc-400">{s.last ? fmtDate(s.last) : "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => void action("reseller.update", { id: r.id, active: !r.active })}
                      className={btnGhost}
                    >
                      <Badge tone={r.active ? "green" : "zinc"}>{r.active ? "Activo" : "Inactivo"}</Badge>
                    </button>
                    <Link
                      href={`/admin/despachos`}
                      onClick={() => sessionStorage.setItem("garage_prefill_reseller", r.id)}
                      className="mt-1 block text-[11px] text-sky-400 hover:underline"
                    >
                      Nuevo pedido volumen →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className={`${cardCls} p-5`}>
        <h2 className="mb-4 text-sm font-semibold tracking-wider text-zinc-300 uppercase">
          Historial de ventas por volumen
        </h2>
        {resellerOrders.length ? (
          <ul className="divide-y divide-white/5 text-sm">
            {resellerOrders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <span>
                  <span className="font-mono text-xs text-amber-400">{o.code}</span>{" "}
                  <strong>{db.resellers.find((r) => r.id === o.resellerId)?.name ?? "—"}</strong>{" "}
                  <span className="text-xs text-zinc-500">
                    · {fmtDate(o.createdAt)} · {o.province}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <strong>{fmtMoney(o.total)}</strong>
                  <Badge tone={STATUS_TONE[o.paymentStatus]}>{o.paymentStatus === "pagado" ? "$ Pagado" : "Por pagar"}</Badge>
                  <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABELS[o.status]}</Badge>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">Aún no hay compras por volumen registradas.</p>
        )}
      </section>
    </div>
  );
}
