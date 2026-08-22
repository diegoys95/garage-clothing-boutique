"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Badge, KpiCard, SectionHeader, btnGhost, btnPrimary, cardCls, fmtMoney, inputCls } from "@/components/admin/ui";
import { MIN_STOCK } from "@/lib/types";
import type { StoreId } from "@/lib/types";

export default function InventarioPage() {
  const { db, loading, action } = useAdmin();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [transfer, setTransfer] = useState({ productId: "", size: "", qty: 1, from: "ambato" as StoreId, to: "riobamba" as StoreId });

  const products = db?.products ?? [];
  const categories = ["Todas", ...new Set(products.map((p) => p.category))];

  const rows = useMemo(() => {
    if (!db) return [];
    return db.products
      .filter((p) => category === "Todas" || p.category === category)
      .filter((p) => {
        const q = search.toLowerCase();
        return !q || `${p.brand} ${p.name} ${p.sku}`.toLowerCase().includes(q);
      })
      .flatMap((p) =>
        p.sizes.map((size) => {
          const get = (store: StoreId) =>
            db.inventory.find((r) => r.productId === p.id && r.size === size && r.store === store)?.qty ?? 0;
          const ambato = get("ambato");
          const riobamba = get("riobamba");
          return { product: p, size, ambato, riobamba, total: ambato + riobamba };
        })
      );
  }, [db, search, category]);

  if (loading || !db) return <p className="text-sm text-zinc-500">Cargando inventario…</p>;

  const totalAmbato = rows.reduce((s, r) => s + r.ambato, 0);
  const totalRiobamba = rows.reduce((s, r) => s + r.riobamba, 0);
  const enAlerta = rows.filter((r) => r.total < MIN_STOCK).length;
  const valorInventario = rows.reduce((s, r) => s + r.total * r.product.price, 0);

  const adjust = (productId: string, size: string, store: StoreId, delta: number) =>
    void action("inventory.adjust", { productId, size, store, delta });

  const doTransfer = async () => {
    const ok = await action("inventory.transfer", transfer);
    if (ok) setTransfer({ ...transfer, productId: "", size: "", qty: 1 });
  };

  const selectedProduct = products.find((p) => p.id === transfer.productId);

  return (
    <div className="space-y-6">
      <SectionHeader title="Inventario" desc="Control de stock por tienda y tallas americanas">
        <div className="flex flex-wrap gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar marca o modelo…"
            className={`${inputCls} w-56`}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls} w-40`}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </SectionHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard value={String(totalAmbato)} label="Unidades · Ambato" />
        <KpiCard value={String(totalRiobamba)} label="Unidades · Riobamba" />
        <KpiCard value={String(enAlerta)} label="SKUs en alerta" sub={`Menos de ${MIN_STOCK} und.`} />
        <KpiCard value={fmtMoney(valorInventario)} label="Valor del inventario" sub="A precio de venta" />
      </div>

      <section className={`${cardCls} p-5`}>
        <h2 className="mb-4 text-sm font-semibold tracking-wider text-zinc-300 uppercase">
          Transferencia entre tiendas
        </h2>
        <div className="grid gap-3 sm:grid-cols-6">
          <select
            value={transfer.productId}
            onChange={(e) => setTransfer({ ...transfer, productId: e.target.value, size: "" })}
            className={`${inputCls} sm:col-span-2`}
          >
            <option value="">Selecciona producto…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.sku} · {p.brand} {p.name}
              </option>
            ))}
          </select>
          <select
            value={transfer.size}
            onChange={(e) => setTransfer({ ...transfer, size: e.target.value })}
            className={inputCls}
            disabled={!selectedProduct}
          >
            <option value="">Talla…</option>
            {selectedProduct?.sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={transfer.qty}
            onChange={(e) => setTransfer({ ...transfer, qty: Number(e.target.value) })}
            className={inputCls}
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">De</span>
            <select
              value={transfer.from}
              onChange={(e) => setTransfer({ ...transfer, from: e.target.value as StoreId })}
              className={inputCls}
            >
              <option value="ambato">Ambato</option>
              <option value="riobamba">Riobamba</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">A</span>
            <select
              value={transfer.to}
              onChange={(e) => setTransfer({ ...transfer, to: e.target.value as StoreId })}
              className={inputCls}
            >
              <option value="riobamba">Riobamba</option>
              <option value="ambato">Ambato</option>
            </select>
            <button onClick={doTransfer} disabled={!transfer.productId || !transfer.size} className={btnPrimary}>
              Mover
            </button>
          </div>
        </div>
      </section>

      <section className={`${cardCls} overflow-x-auto`}>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs tracking-wider text-zinc-400 uppercase">
              <th className="px-5 py-3">Producto</th>
              <th className="px-3 py-3">Talla</th>
              <th className="px-3 py-3 text-center">Ambato</th>
              <th className="px-3 py-3 text-center">Riobamba</th>
              <th className="px-3 py-3 text-center">Total</th>
              <th className="px-5 py-3 text-right">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const low = r.total < MIN_STOCK;
              return (
                <tr key={`${r.product.id}-${r.size}`} className={`border-b border-white/5 last:border-0 ${low ? "bg-red-950/20" : ""}`}>
                  <td className="px-5 py-2.5">
                    <p className="font-medium">{r.product.name}</p>
                    <p className="text-xs text-zinc-500">
                      {r.product.sku} · {r.product.brand} · {fmtMoney(r.product.price)}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs">{r.size}</td>
                  {(["ambato", "riobamba"] as StoreId[]).map((store) => (
                    <td key={store} className="px-3 py-2.5 text-center">
                      <span className="mr-2 inline-block w-5 font-semibold">{store === "ambato" ? r.ambato : r.riobamba}</span>
                      <button
                        onClick={() => adjust(r.product.id, r.size, store, -1)}
                        className="rounded border border-white/15 px-1.5 leading-none hover:border-white/40"
                        aria-label={`Restar una unidad en ${store}`}
                      >
                        −
                      </button>{" "}
                      <button
                        onClick={() => adjust(r.product.id, r.size, store, 1)}
                        className="rounded border border-white/15 px-1.5 leading-none hover:border-white/40"
                        aria-label={`Sumar una unidad en ${store}`}
                      >
                        +
                      </button>
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-center font-semibold">{r.total}</td>
                  <td className="px-5 py-2.5 text-right">
                    {low ? <Badge tone={r.total === 0 ? "red" : "amber"}>{r.total === 0 ? "Agotado" : "Stock bajo"}</Badge> : <Badge tone="green">OK</Badge>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <p className="text-xs text-zinc-500">
        Usa los botones − / + para ajustes rápidos (recepción de mercadería o correcciones). Las transferencias mueven
        unidades entre las tiendas de <strong>Ambato</strong> y <strong>Riobamba</strong>.
        {" "}
        <span className={btnGhost + " inline-block"}>Prototipo v1</span>
      </p>
    </div>
  );
}
