"use client";

import { useMemo } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Badge, KpiCard, SectionHeader, cardCls, fmtDate, fmtDateTime, fmtMoney } from "@/components/admin/ui";
import { PAYMENT_METHODS } from "@/lib/types";

export default function PagosPage() {
  const { db, loading } = useAdmin();

  const data = useMemo(() => {
    if (!db) return null;
    const now = new Date();
    const thisMonth = (iso: string) => {
      const d = new Date(iso);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    };
    const pagosMes = db.payments.filter((p) => thisMonth(p.date));
    const cobradoMes = pagosMes.reduce((s, p) => s + p.amount, 0);
    const porMetodo = PAYMENT_METHODS.map((m) => ({
      ...m,
      total: pagosMes.filter((p) => p.method === m.id).reduce((s, p) => s + p.amount, 0),
      count: pagosMes.filter((p) => p.method === m.id).length,
    }));
    const pendientes = db.orders
      .filter((o) => o.status !== "cancelado" && o.paymentStatus === "por_pagar")
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((o) => ({ order: o, dias: Math.floor((now.getTime() - new Date(o.createdAt).getTime()) / 864e5) }));
    const porCobrar = pendientes.reduce((s, x) => s + x.order.total, 0);
    return { pagos: [...db.payments].sort((a, b) => b.date.localeCompare(a.date)), pagosMes, cobradoMes, porMetodo, pendientes, porCobrar };
  }, [db]);

  if (loading || !db || !data) return <p className="text-sm text-zinc-500">Cargando cartera…</p>;

  const waReminder = (code: string, name: string, phone: string, total: number) =>
    `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      `Hola ${name} 👋 Te recordamos amablemente que tu pedido ${code} (${fmtMoney(total)}) está pendiente de pago. Puedes cancelarlo por transferencia o depósito y enviarnos el comprobante por aquí. ¡Gracias!`
    )}`;

  return (
    <div className="space-y-6">
      <SectionHeader title="Pagos y Cartera" desc="Conciliación de transferencias, efectivo y cierre del mes" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard value={fmtMoney(data.cobradoMes)} label="Cobrado este mes" sub={`${data.pagosMes.length} transacciones`} />
        <KpiCard value={fmtMoney(data.porCobrar)} label="Por cobrar" sub={`${data.pendientes.length} pedidos abiertos`} />
        <KpiCard
          value={data.pagosMes.length ? fmtMoney(data.cobradoMes / data.pagosMes.length) : fmtMoney(0)}
          label="Ticket promedio"
          sub="Por transacción del mes"
        />
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
          <p className="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">Cierre por método</p>
          <ul className="space-y-1 text-xs">
            {data.porMetodo.map((m) => (
              <li key={m.id} className="flex justify-between gap-2">
                <span className="truncate text-zinc-400">{m.label}</span>
                <span className="font-semibold text-zinc-100">{fmtMoney(m.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className={`${cardCls} overflow-x-auto`}>
        <h2 className="border-b border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold tracking-wider text-zinc-300 uppercase">
          Cartera pendiente de cobro
        </h2>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs tracking-wider text-zinc-400 uppercase">
              <th className="px-5 py-3">Pedido</th>
              <th className="px-3 py-3">Cliente</th>
              <th className="px-3 py-3 text-right">Monto</th>
              <th className="px-3 py-3 text-center">Antigüedad</th>
              <th className="px-5 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {data.pendientes.map(({ order, dias }) => (
              <tr key={order.id} className={`border-b border-white/5 last:border-0 ${dias > 5 ? "bg-red-950/20" : ""}`}>
                <td className="px-5 py-2.5 font-mono text-xs text-amber-400">
                  {order.code}
                  <p className="font-sans text-[11px] text-zinc-500">{fmtDate(order.createdAt)}</p>
                </td>
                <td className="px-3 py-2.5">
                  {order.customerName}
                  <p className="text-xs text-zinc-500">{order.phone}</p>
                </td>
                <td className="px-3 py-2.5 text-right font-semibold">{fmtMoney(order.total)}</td>
                <td className="px-3 py-2.5 text-center">
                  <Badge tone={dias > 5 ? "red" : dias > 2 ? "amber" : "zinc"}>{dias} días</Badge>
                </td>
                <td className="px-5 py-2.5 text-right">
                  <a
                    href={waReminder(order.code, order.customerName, order.phone, order.total)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-emerald-400 hover:underline"
                  >
                    💬 Recordar pago
                  </a>
                </td>
              </tr>
            ))}
            {!data.pendientes.length && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-zinc-500">
                  🎉 Cartera al día. No hay pagos pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className={`${cardCls} overflow-x-auto`}>
        <h2 className="border-b border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold tracking-wider text-zinc-300 uppercase">
          Historial de transacciones
        </h2>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs tracking-wider text-zinc-400 uppercase">
              <th className="px-5 py-3">Pago</th>
              <th className="px-3 py-3">Fecha</th>
              <th className="px-3 py-3">Pedido</th>
              <th className="px-3 py-3">Método / Banco</th>
              <th className="px-3 py-3">Comprobante</th>
              <th className="px-3 py-3">Registró</th>
              <th className="px-5 py-3 text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {data.pagos.map((p) => (
              <tr key={p.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-2.5 font-mono text-xs text-zinc-400">{p.id}</td>
                <td className="px-3 py-2.5 whitespace-nowrap text-xs text-zinc-500">{fmtDateTime(p.date)}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-amber-400">{p.orderCode}</td>
                <td className="px-3 py-2.5">
                  {PAYMENT_METHODS.find((m) => m.id === p.method)?.label ?? p.method}
                  {p.bank && <p className="text-xs text-zinc-500">{p.bank}</p>}
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-zinc-500">{p.reference ?? "—"}</td>
                <td className="px-3 py-2.5 text-xs text-zinc-500">{p.registeredBy}</td>
                <td className="px-5 py-2.5 text-right font-semibold">{fmtMoney(p.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
