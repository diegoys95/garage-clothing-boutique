"use client";

import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import OrderForm from "@/components/shared/OrderForm";
import { KpiCard, cardCls, fmtMoney } from "@/components/admin/ui";

export default function PuntoVentaPage() {
  const { db, loading } = useAdmin();
  if (loading || !db) return <p className="text-sm text-zinc-500">Cargando punto de venta…</p>;

  const hoy = new Date().toDateString();
  const pedidosHoy = db.orders.filter((o) => new Date(o.createdAt).toDateString() === hoy && o.status !== "cancelado");
  const cobradoHoy = db.payments
    .filter((p) => new Date(p.date).toDateString() === hoy)
    .reduce((s, p) => s + p.amount, 0);
  const chatsAbiertos = db.chats.filter((c) => c.status === "abierto").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase">Punto de venta</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Registra la venta, descuenta stock y genera el pedido para despacho · Ambato / Riobamba
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard value={String(pedidosHoy.length)} label="Pedidos de hoy" />
        <KpiCard value={fmtMoney(cobradoHoy)} label="Cobrado hoy" />
        <KpiCard value={String(chatsAbiertos)} label="Chats por atender" sub={<Link href="/ventas/chats" className="text-emerald-400 hover:underline">Atender →</Link>} />
      </div>

      <OrderForm />

      <section className={`${cardCls} p-5`}>
        <h2 className="mb-3 text-sm font-semibold tracking-wider text-zinc-300 uppercase">Pedidos registrados hoy</h2>
        {pedidosHoy.length ? (
          <ul className="divide-y divide-white/5 text-sm">
            {[...pedidosHoy].reverse().map((o) => (
              <li key={o.id} className="flex items-center justify-between py-2">
                <span>
                  <span className="font-mono text-xs text-emerald-400">{o.code}</span>{" "}
                  {o.customerName}{" "}
                  <span className="text-xs text-zinc-500">· {o.province}</span>
                </span>
                <strong>{fmtMoney(o.total)}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">Aún no hay ventas registradas hoy.</p>
        )}
      </section>
    </div>
  );
}
