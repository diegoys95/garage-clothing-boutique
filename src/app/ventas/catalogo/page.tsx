"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Badge, SectionHeader, cardCls, fmtMoney, inputCls } from "@/components/admin/ui";
import { MIN_STOCK, type StoreId } from "@/lib/types";

export default function CatalogoVentasPage() {
  const { db, loading } = useAdmin();
  const [store, setStore] = useState<StoreId>("ambato");
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    if (!db) return [];
    return db.products
      .filter((p) => {
        const q = search.toLowerCase();
        return !q || `${p.brand} ${p.name} ${p.sku}`.toLowerCase().includes(q);
      })
      .map((p) => ({
        product: p,
        stock: p.sizes.map((size) => ({
          size,
          qty: db.inventory.find((r) => r.productId === p.id && r.size === size && r.store === store)?.qty ?? 0,
        })),
      }));
  }, [db, search, store]);

  if (loading || !db) return <p className="text-sm text-zinc-500">Cargando catálogo…</p>;

  return (
    <div className="space-y-6">
      <SectionHeader title="Catálogo y Stock" desc="Consulta la disponibilidad real antes de prometer al cliente">
        <div className="flex flex-wrap gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar…" className={`${inputCls} w-52`} />
          <div className="flex rounded-md border border-white/15 p-0.5">
            {(["ambato", "riobamba"] as StoreId[]).map((s) => (
              <button
                key={s}
                onClick={() => setStore(s)}
                className={`rounded px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  store === s ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </SectionHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ product, stock }) => {
          const total = stock.reduce((s, x) => s + x.qty, 0);
          return (
            <article key={product.id} className={`${cardCls} p-5`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">{product.brand}</p>
                  <h3 className="mt-0.5 font-medium">{product.name}</h3>
                  <p className="mt-1 font-display text-xl font-bold">{fmtMoney(product.price)}</p>
                </div>
                <Badge tone={total === 0 ? "red" : total < MIN_STOCK * 2 ? "amber" : "green"}>{total} und.</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {stock.map((s) => (
                  <span
                    key={s.size}
                    className={`rounded border px-2 py-1 text-xs ${
                      s.qty === 0
                        ? "border-white/10 text-zinc-600 line-through"
                        : s.qty < MIN_STOCK
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                          : "border-white/15 text-zinc-300"
                    }`}
                    title={`${s.size}: ${s.qty} unidades`}
                  >
                    {s.size} · {s.qty}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
