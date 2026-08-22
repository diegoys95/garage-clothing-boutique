"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { btnGhost, btnPrimary, cardCls, fmtMoney, inputCls, labelCls } from "@/components/admin/ui";
import type { StoreId } from "@/lib/types";

const PROVINCES = ["Tungurahua", "Chimborazo", "Bolívar", "Cotopaxi", "Pastaza"] as const;

type ItemDraft = { productId: string; size: string; qty: number };

export default function OrderForm({ onDone }: { onDone?: () => void }) {
  const { db, action } = useAdmin();
  const [chatClient, setChatClient] = useState<string | null>(null);
  const [type, setType] = useState<"minorista" | "revendedor">("minorista");
  const [resellerId, setResellerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState<string>("Tungurahua");
  const [address, setAddress] = useState("");
  const [originStore, setOriginStore] = useState<StoreId>("ambato");
  const [courier, setCourier] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([{ productId: "", size: "", qty: 1 }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const name = params.get("cliente") ?? "";
      const tel = params.get("tel") ?? "";
      const chatParam = params.get("chat");
      if (name) {
        setCustomerName((prev) => prev || name);
        setPhone((prev) => prev || tel);
        setChatClient(name);
      }
      if (chatParam) void action("chat.update", { id: chatParam, status: "convertido" });
    }, 100);
    return () => clearTimeout(t);
  }, [action]);

  const products = db?.products ?? [];
  const resellers = useMemo(() => db?.resellers ?? [], [db]);

  const activeDiscount = useMemo(
    () => (type === "revendedor" ? resellers.find((r) => r.id === resellerId)?.discountPct ?? 0 : 0),
    [type, resellerId, resellers]
  );

  const subtotalCalc = items.reduce((s, it) => {
    const prod = products.find((p) => p.id === it.productId);
    return s + (prod ? prod.price * it.qty : 0);
  }, 0);
  const discountCalc = Math.round(subtotalCalc * activeDiscount) / 100;

  if (!db) return null;

  const stockOf = (productId: string, size: string) =>
    db.inventory.find((r) => r.productId === productId && r.size === size && r.store === originStore)?.qty ?? 0;

  const submitOrder = async () => {
    setSaving(true);
    const ok = await action("order.create", {
      type,
      resellerId,
      customerName,
      phone,
      province,
      address,
      originStore,
      courier,
      notes,
      items: items.filter((i) => i.productId && i.size && i.qty > 0),
    });
    setSaving(false);
    if (ok) {
      setCustomerName("");
      setPhone("");
      setAddress("");
      setNotes("");
      setCourier("");
      setItems([{ productId: "", size: "", qty: 1 }]);
      onDone?.();
    }
  };

  return (
    <section className={`${cardCls} space-y-4 p-5`}>
      {chatClient && (
        <p className="rounded-md border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs text-sky-300">
          Datos precargados desde el chat de <strong>{chatClient}</strong>
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelCls}>Tipo de venta</label>
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className={inputCls}>
            <option value="minorista">Minorista (tienda/web)</option>
            <option value="revendedor">Revendedor (volumen)</option>
          </select>
        </div>
        {type === "revendedor" && (
          <div>
            <label className={labelCls}>Revendedor</label>
            <select value={resellerId} onChange={(e) => setResellerId(e.target.value)} className={inputCls}>
              <option value="">Selecciona…</option>
              {resellers.filter((r) => r.active).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.discountPct}% desc.)
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className={labelCls}>Tienda de origen</label>
          <select value={originStore} onChange={(e) => setOriginStore(e.target.value as StoreId)} className={inputCls}>
            <option value="ambato">Ambato</option>
            <option value="riobamba">Riobamba</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Cliente</label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nombre" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>WhatsApp</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+593 …" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Provincia destino</label>
          <select value={province} onChange={(e) => setProvince(e.target.value)} className={inputCls}>
            {PROVINCES.map((pv) => (
              <option key={pv}>{pv}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Dirección / referencia</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ciudad, sector…" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Transportadora</label>
          <input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="Tramaco, Servientrega…" className={inputCls} />
        </div>
        <div className="sm:col-span-3">
          <label className={labelCls}>Notas internas</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opcional" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Productos del pedido (descuenta stock de la tienda de origen)</label>
        <div className="space-y-2">
          {items.map((it, idx) => {
            const prod = products.find((p) => p.id === it.productId);
            return (
              <div key={idx} className="flex flex-wrap gap-2">
                <select
                  value={it.productId}
                  onChange={(e) => {
                    const copy = [...items];
                    copy[idx] = { productId: e.target.value, size: "", qty: it.qty };
                    setItems(copy);
                  }}
                  className={`${inputCls} sm:max-w-xs`}
                >
                  <option value="">Producto…</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} · {p.brand} {p.name}
                    </option>
                  ))}
                </select>
                <select
                  value={it.size}
                  onChange={(e) => {
                    const copy = [...items];
                    copy[idx].size = e.target.value;
                    setItems(copy);
                  }}
                  className={`${inputCls} w-28`}
                  disabled={!prod}
                >
                  <option value="">Talla…</option>
                  {prod?.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s} ({stockOf(prod.id, s)})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={it.qty}
                  onChange={(e) => {
                    const copy = [...items];
                    copy[idx].qty = Number(e.target.value);
                    setItems(copy);
                  }}
                  className={`${inputCls} w-20`}
                />
                <button
                  onClick={() => setItems(items.filter((_, i) => i !== idx))}
                  className="rounded-md border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                  aria-label="Quitar producto"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <button onClick={() => setItems([...items, { productId: "", size: "", qty: 1 }])} className={`${btnGhost} mt-2`}>
          + Agregar línea
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div className="text-sm text-zinc-400">
          Subtotal: <strong className="text-zinc-100">{fmtMoney(subtotalCalc)}</strong> · Descuento:{" "}
          <strong className={activeDiscount ? "text-emerald-400" : "text-zinc-100"}>
            −{fmtMoney(discountCalc)} ({activeDiscount}%)
          </strong>{" "}
          · Total: <strong className="font-display text-xl text-amber-400">{fmtMoney(subtotalCalc - discountCalc)}</strong>
        </div>
        <button
          onClick={submitOrder}
          disabled={saving || !items.some((i) => i.productId && i.size)}
          className={btnPrimary}
        >
          {saving ? "Registrando…" : "Registrar pedido"}
        </button>
      </div>
    </section>
  );
}
