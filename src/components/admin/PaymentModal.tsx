"use client";

import { useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Badge, btnGhost, btnPrimary, fmtDateTime, fmtMoney, inputCls, labelCls } from "@/components/admin/ui";
import { PAYMENT_METHODS } from "@/lib/types";
import type { Order } from "@/lib/types";

export default function PaymentModal({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const { db, action } = useAdmin();
  const [method, setMethod] = useState("transferencia");
  const [bank, setBank] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  if (!order || !db) return null;
  const pagos = db.payments.filter((p) => p.orderId === order.id).sort((a, b) => b.date.localeCompare(a.date));
  const cobrado = pagos.reduce((s, p) => s + p.amount, 0);

  const submit = async () => {
    setSaving(true);
    const ok = await action("order.pay", {
      id: order.id,
      method,
      bank,
      reference,
      note,
      amount: amount === "" ? order.total : amount,
    });
    setSaving(false);
    if (ok) {
      setBank("");
      setReference("");
      setAmount("");
      setNote("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-zinc-900 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-bold uppercase">
              Registrar pago · <span className="text-amber-400">{order.code}</span>
            </h2>
            <p className="mt-0.5 text-sm text-zinc-400">
              {order.customerName} · Total {fmtMoney(order.total)}{" "}
              {cobrado > 0 && <span className="text-emerald-400">(cobrado {fmtMoney(cobrado)})</span>}
            </p>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-zinc-500 hover:text-zinc-200">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Método</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputCls}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Banco {method === "transferencia" ? "" : "(opcional)"}</label>
            <input
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              placeholder="Pichincha, Guayaquil…"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>N° comprobante</label>
            <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Ej. 482137" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Monto recibido ($)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder={String(order.total)}
              className={inputCls}
            />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Nota</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Opcional" className={inputCls} />
          </div>
        </div>

        <button onClick={submit} disabled={saving} className={`${btnPrimary} mt-4 w-full`}>
          {saving ? "Registrando…" : `Registrar ${method === "transferencia" ? "transferencia" : "pago"} de ${fmtMoney(amount === "" ? order.total : amount)}`}
        </button>

        {pagos.length > 0 && (
          <div className="mt-5 border-t border-white/10 pt-4">
            <h3 className="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">Historial del pedido</h3>
            <ul className="space-y-2">
              {pagos.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-sm">
                  <div>
                    <p className="font-semibold">{fmtMoney(p.amount)}</p>
                    <p className="text-xs text-zinc-500">
                      {fmtDateTime(p.date)}
                      {p.bank ? ` · ${p.bank}` : ""}
                      {p.reference ? ` · ${p.reference}` : ""}
                      {" · "}
                      {PAYMENT_METHODS.find((m) => m.id === p.method)?.label}
                    </p>
                    <p className="text-[11px] text-zinc-600">Registró: {p.registeredBy}</p>
                  </div>
                  <button
                    onClick={() => void action("payment.delete", { id: p.id })}
                    className={btnGhost}
                    aria-label={`Anular pago ${p.id}`}
                  >
                    Anular
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
          <Badge tone="green">Conciliación automática</Badge> El pago queda vinculado al pedido para el cierre de caja.
        </div>
      </div>
    </div>
  );
}
