"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import PaymentModal from "@/components/admin/PaymentModal";
import OrderForm from "@/components/shared/OrderForm";
import {
  Badge,
  STATUS_TONE,
  SectionHeader,
  btnDanger,
  btnGhost,
  btnPrimary,
  cardCls,
  fmtDate,
  fmtMoney,
  inputCls,
} from "@/components/admin/ui";
import type { Order } from "@/lib/types";
import { ORDER_FLOW, STATUS_LABELS } from "@/lib/types";

const PROVINCES = ["Tungurahua", "Chimborazo", "Bolívar", "Cotopaxi", "Pastaza"] as const;

function nextStatus(status: Order["status"]): Order["status"] | null {
  const i = ORDER_FLOW.indexOf(status);
  if (i === -1 || i === ORDER_FLOW.length - 1) return null;
  return ORDER_FLOW[i + 1];
}

export default function DespachosPage() {
  const { db, loading, action } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [payFor, setPayFor] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterProvince, setFilterProvince] = useState("todas");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      if (new URLSearchParams(window.location.search).has("cliente")) setShowForm(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const orders = useMemo(() => {
    if (!db) return [];
    return [...db.orders]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((o) => filterStatus === "todos" || o.status === filterStatus)
      .filter((o) => filterProvince === "todas" || o.province === filterProvince)
      .filter((o) => {
        const q = search.toLowerCase();
        return !q || `${o.code} ${o.customerName} ${o.phone}`.toLowerCase().includes(q);
      });
  }, [db, filterStatus, filterProvince, search]);

  if (loading || !db) return <p className="text-sm text-zinc-500">Cargando pedidos…</p>;

  return (
    <div className="space-y-6">
      <SectionHeader title="Pedidos y Despachos" desc="Pipeline de ventas web y coordinación de envíos a provincias">
        <button onClick={() => setShowForm(!showForm)} className={btnPrimary}>
          {showForm ? "Cerrar formulario" : "+ Nuevo pedido"}
        </button>
      </SectionHeader>

      {showForm && <OrderForm onDone={() => setShowForm(false)} />}

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
        <select value={filterProvince} onChange={(e) => setFilterProvince(e.target.value)} className={`${inputCls} w-40`}>
          <option value="todas">Todas las provincias</option>
          {PROVINCES.map((pv) => (
            <option key={pv}>{pv}</option>
          ))}
        </select>
      </div>

      <section className={`${cardCls} overflow-x-auto`}>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs tracking-wider text-zinc-400 uppercase">
              <th className="px-4 py-3">Pedido</th>
              <th className="px-3 py-3">Cliente</th>
              <th className="px-3 py-3">Destino</th>
              <th className="px-3 py-3 text-center">Und.</th>
              <th className="px-3 py-3 text-right">Total</th>
              <th className="px-3 py-3">Pago</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const nxt = nextStatus(o.status);
              const und = o.items.reduce((s, i) => s + i.qty, 0);
              return (
                <tr key={o.id} className={`border-b border-white/5 align-top last:border-0 ${o.status === "cancelado" ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs text-amber-400">{o.code}</p>
                    <p className="text-[11px] text-zinc-500">{fmtDate(o.createdAt)}</p>
                    <details className="mt-1">
                      <summary className="cursor-pointer text-[11px] text-zinc-500 hover:text-zinc-300">Detalle</summary>
                      <ul className="mt-1 space-y-0.5 text-[11px] text-zinc-400">
                        {o.items.map((it, i) => (
                          <li key={i}>
                            {it.qty}× {db.products.find((p) => p.id === it.productId)?.name ?? it.productId} ({it.size})
                          </li>
                        ))}
                        <li className="pt-1 text-zinc-500">
                          Origen: {o.originStore === "ambato" ? "Ambato" : "Riobamba"}
                          {o.courier ? ` · ${o.courier}` : ""}
                          {o.notes ? ` · ${o.notes}` : ""}
                        </li>
                      </ul>
                    </details>
                  </td>
                  <td className="px-3 py-3">
                    <p>{o.customerName}</p>
                    <p className="text-xs text-zinc-500">{o.phone}</p>
                    {o.type === "revendedor" && (
                      <Badge tone="amber">{db.resellers.find((r) => r.id === o.resellerId)?.name ?? "Revendedor"}</Badge>
                    )}
                  </td>
                  <td className="px-3 py-3 text-zinc-400">
                    {o.province}
                    <p className="max-w-36 truncate text-xs text-zinc-600">{o.address}</p>
                  </td>
                  <td className="px-3 py-3 text-center">{und}</td>
                  <td className="px-3 py-3 text-right font-semibold">
                    {fmtMoney(o.total)}
                    {o.discount > 0 && <p className="text-[11px] font-normal text-emerald-400">−{fmtMoney(o.discount)}</p>}
                  </td>
                  <td className="px-3 py-3">
                    <button onClick={() => setPayFor(o)} disabled={o.status === "cancelado"}>
                      <Badge tone={STATUS_TONE[o.paymentStatus]}>
                        {o.paymentStatus === "pagado" ? "$ Pagado" : "Por pagar"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABELS[o.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {nxt && o.status !== "cancelado" && (
                      <button onClick={() => void action("order.update", { id: o.id, status: nxt })} className={btnGhost}>
                        ▸ {STATUS_LABELS[nxt]}
                      </button>
                    )}{" "}
                    {!["entregado", "cancelado"].includes(o.status) && (
                      <button onClick={() => void action("order.update", { id: o.id, status: "cancelado" })} className={btnDanger}>
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!orders.length && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                  Sin pedidos que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      <PaymentModal order={payFor} onClose={() => setPayFor(null)} />
      <p className="text-xs text-zinc-500">
        Pipeline: recibido → confirmado → empacado → en ruta → entregado. Cancelar un pedido devuelve las unidades al
        inventario de la tienda de origen.
      </p>
    </div>
  );
}
