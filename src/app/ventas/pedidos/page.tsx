"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import PaymentModal from "@/components/admin/PaymentModal";
import { Badge, STATUS_TONE, SectionHeader, btnDanger, btnGhost, cardCls, fmtDate, fmtMoney, inputCls } from "@/components/admin/ui";
import type { Order } from "@/lib/types";
import { ORDER_FLOW, STATUS_LABELS } from "@/lib/types";

function nextStatus(status: Order["status"]): Order["status"] | null {
  const i = ORDER_FLOW.indexOf(status);
  if (i === -1 || i === ORDER_FLOW.length - 1) return null;
  return ORDER_FLOW[i + 1];
}

export default function MisPedidosPage() {
  const { db, loading, action } = useAdmin();
  const [payFor, setPayFor] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [search, setSearch] = useState("");

  const orders = useMemo(() => {
    if (!db) return [];
    return [...db.orders]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((o) => filterStatus === "todos" || o.status === filterStatus)
      .filter((o) => {
        const q = search.toLowerCase();
        return !q || `${o.code} ${o.customerName} ${o.phone}`.toLowerCase().includes(q);
      });
  }, [db, filterStatus, search]);

  if (loading || !db) return <p className="text-sm text-zinc-500">Cargando pedidos…</p>;

  return (
    <div className="space-y-6">
      <SectionHeader title="Mis Pedidos" desc="Avanza el pipeline y registra los cobros" />

      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar código o cliente…" className={`${inputCls} w-56`} />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={`${inputCls} w-44`}>
          <option value="todos">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <section className={`${cardCls} overflow-x-auto`}>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs tracking-wider text-zinc-400 uppercase">
              <th className="px-4 py-3">Pedido</th>
              <th className="px-3 py-3">Cliente</th>
              <th className="px-3 py-3">Destino</th>
              <th className="px-3 py-3 text-right">Total</th>
              <th className="px-3 py-3">Pago</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const nxt = nextStatus(o.status);
              return (
                <tr key={o.id} className={`border-b border-white/5 last:border-0 ${o.status === "cancelado" ? "opacity-50" : ""}`}>
                  <td className="px-4 py-2.5 font-mono text-xs text-emerald-400">
                    {o.code}
                    <p className="font-sans text-[11px] text-zinc-500">{fmtDate(o.createdAt)}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    {o.customerName}
                    <p className="text-xs text-zinc-500">{o.phone}</p>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-zinc-400">{o.province}</td>
                  <td className="px-3 py-2.5 text-right font-semibold">{fmtMoney(o.total)}</td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => setPayFor(o)} disabled={o.status === "cancelado"}>
                      <Badge tone={STATUS_TONE[o.paymentStatus]}>
                        {o.paymentStatus === "pagado" ? "$ Pagado" : "Por pagar"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABELS[o.status]}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    {nxt && o.status !== "cancelado" && (
                      <button onClick={() => void action("order.update", { id: o.id, status: nxt })} className={btnGhost}>
                        ▸ {STATUS_LABELS[nxt]}
                      </button>
                    )}{" "}
                    {!["entregado", "cancelado"].includes(o.status) && (
                      <button onClick={() => void action("order.update", { id: o.id, status: "cancelado" })} className={btnDanger}>
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <PaymentModal order={payFor} onClose={() => setPayFor(null)} />
    </div>
  );
}
