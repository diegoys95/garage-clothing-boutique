"use client";

import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Badge, KpiCard, STATUS_TONE, cardCls, fmtDate, fmtMoney } from "@/components/admin/ui";
import { MIN_STOCK, ORDER_FLOW, STATUS_LABELS } from "@/lib/types";

export default function DashboardPage() {
  const { db, loading } = useAdmin();
  if (loading || !db) return <p className="text-sm text-zinc-500">Cargando panel…</p>;

  const now = new Date();
  const isThisMonth = (iso: string) => {
    const d = new Date(iso);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };
  const valid = db.orders.filter((o) => o.status !== "cancelado");
  const monthOrders = valid.filter((o) => isThisMonth(o.createdAt));
  const ventasMes = monthOrders.reduce((s, o) => s + o.total, 0);
  const despachadosMes = monthOrders.filter((o) => o.status === "en_ruta" || o.status === "entregado").length;
  const pagadosMes = monthOrders.filter((o) => o.paymentStatus === "pagado").length;
  const conversion = monthOrders.length ? Math.round((pagadosMes / monthOrders.length) * 100) : 0;
  const chatsAbiertos = db.chats.filter((c) => c.status === "abierto");

  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    days.push({
      label: d.toLocaleDateString("es-EC", { weekday: "short" }),
      count: valid.filter((o) => new Date(o.createdAt).toDateString() === key).length,
    });
  }
  const max = Math.max(1, ...days.map((d) => d.count));

  const stockByKey = new Map<string, number>();
  for (const row of db.inventory) {
    const key = `${row.productId}|${row.size}`;
    stockByKey.set(key, (stockByKey.get(key) ?? 0) + row.qty);
  }
  const alertas = [...stockByKey.entries()]
    .filter(([, total]) => total < MIN_STOCK)
    .map(([key, total]) => {
      const [productId, size] = key.split("|");
      return { product: db.products.find((p) => p.id === productId), size, total };
    })
    .filter((a) => a.product)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase">Dashboard operativo</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Métricas en vivo de la operación GARAGE · {now.toLocaleDateString("es-EC", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard value={String(chatsAbiertos.length)} label="Chats abiertos" sub="Esperando asesoría" />
        <KpiCard value={String(despachadosMes)} label="Paquetes despachados" sub="En ruta o entregados este mes" />
        <KpiCard value={fmtMoney(ventasMes)} label="Ventas del mes" sub={`${monthOrders.length} pedidos válidos`} />
        <KpiCard value={`${conversion}%`} label="Conversión a pago" sub={`${pagadosMes} pedidos pagados del mes`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${cardCls} p-5`}>
          <h2 className="mb-4 text-sm font-semibold tracking-wider text-zinc-300 uppercase">
            Pedidos últimos 7 días
          </h2>
          <div className="flex h-40 items-end justify-between gap-2">
            {days.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-semibold text-zinc-400">{d.count || ""}</span>
                <div
                  className="w-full rounded-t bg-amber-500/80"
                  style={{ height: `${Math.max(6, (d.count / max) * 120)}px` }}
                />
                <span className="text-[10px] text-zinc-500 capitalize">{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${cardCls} p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider text-zinc-300 uppercase">
              Alertas de stock bajo
            </h2>
            <Link href="/admin/inventario" className={btnLink}>
              Ver inventario →
            </Link>
          </div>
          {alertas.length ? (
            <ul className="divide-y divide-white/5 text-sm">
              {alertas.map((a) => (
                <li key={`${a.product!.id}-${a.size}`} className="flex items-center justify-between py-2">
                  <span>
                    <span className="font-medium">{a.product!.brand}</span>{" "}
                    <span className="text-zinc-400">{a.product!.name}</span>
                    <span className="ml-2 rounded bg-white/5 px-1.5 py-0.5 text-xs text-zinc-400">{a.size}</span>
                  </span>
                  <Badge tone={a.total === 0 ? "red" : "amber"}>{a.total} und.</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">Sin alertas. Todo el inventario está sobre el mínimo.</p>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`${cardCls} p-5 lg:col-span-2`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider text-zinc-300 uppercase">Últimos pedidos</h2>
            <Link href="/admin/despachos" className={btnLink}>
              Gestionar →
            </Link>
          </div>
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs tracking-wider text-zinc-500 uppercase">
                  <th className="pb-2">Código</th>
                  <th className="pb-2">Cliente</th>
                  <th className="pb-2">Destino</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {[...db.orders]
                  .reverse()
                  .slice(0, 6)
                  .map((o) => (
                    <tr key={o.id} className="border-b border-white/5 last:border-0">
                      <td className="py-2 font-mono text-xs text-amber-400">{o.code}</td>
                      <td className="py-2">{o.customerName}</td>
                      <td className="py-2 text-zinc-400">{o.province}</td>
                      <td className="py-2">{fmtMoney(o.total)}</td>
                      <td className="py-2">
                        <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABELS[o.status]}</Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`${cardCls} p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider text-zinc-300 uppercase">Chats abiertos</h2>
            <Link href="/admin/chats" className={btnLink}>
              Atender →
            </Link>
          </div>
          <ul className="space-y-3 text-sm">
            {chatsAbiertos.slice(0, 5).map((c) => (
              <li key={c.id}>
                <p className="font-medium">
                  {c.name}{" "}
                  <span className="ml-1 rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400">{c.channel}</span>
                </p>
                <p className="truncate text-xs text-zinc-500">{c.interest}</p>
              </li>
            ))}
            {!chatsAbiertos.length && <li className="text-zinc-500">No hay chats pendientes 🎉</li>}
          </ul>
        </section>
      </div>

      <section className={`${cardCls} p-5`}>
        <h2 className="mb-3 text-sm font-semibold tracking-wider text-zinc-300 uppercase">
          Pipeline de pedidos (mes actual)
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {ORDER_FLOW.map((s) => (
            <div key={s} className="rounded-lg border border-white/10 bg-zinc-950 p-3 text-center">
              <p className="font-display text-xl font-bold text-amber-400">
                {monthOrders.filter((o) => o.status === s).length}
              </p>
              <p className="mt-1 text-xs text-zinc-400">{STATUS_LABELS[s]}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Fecha de referencia del pedido más antiguo del mes: {monthOrders.length ? fmtDate(monthOrders[0].createdAt) : "—"}
        </p>
      </section>
    </div>
  );
}

const btnLink = "text-xs font-medium text-amber-400 hover:underline";
