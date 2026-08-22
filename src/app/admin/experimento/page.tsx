"use client";

import { useMemo } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { KpiCard, SectionHeader, cardCls, fmtMoney } from "@/components/admin/ui";

const SECTIONS = [
  { id: "view_ofertas", label: "Vio Ofertas" },
  { id: "view_tallas", label: "Vio Guía de tallas" },
  { id: "view_prueba", label: "Vio Prueba social" },
  { id: "view_revendedores", label: "Vio Revendedores" },
  { id: "view_envios", label: "Vio Envíos y pago QR" },
];

export default function ExperimentoPage() {
  const { db, loading } = useAdmin();

  const s = useMemo(() => {
    if (!db) return null;
    const evs = db.events ?? [];
    const byId: Record<string, number> = {};
    evs.forEach((e) => {
      byId[e.id] = (byId[e.id] || 0) + 1;
    });
    const sids = new Set(evs.map((e) => e.sid || "anon")).size;
    const chatsTotal = db.chats.length;
    const chatsConv = db.chats.filter((c) => c.status === "convertido").length;
    const convPct = chatsTotal ? Math.round((chatsConv / chatsTotal) * 100) : 0;
    const now = new Date();
    const monthOrders = db.orders.filter((o) => {
      const d = new Date(o.createdAt);
      return (
        o.status !== "cancelado" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
    const revenue = monthOrders.reduce((acc, o) => acc + o.total, 0);

    const TH = { chats: 10, pedidos: 3, conv: 40 };
    let verdict: { label: string; cls: string; msg: string };
    if (chatsTotal >= TH.chats && monthOrders.length >= TH.pedidos && convPct >= TH.conv)
      verdict = {
        label: "✅ HIPÓTESIS VALIDADA — MVP VIABLE",
        cls: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
        msg: "Los datos superan los umbrales mínimos definidos. Escala: número WhatsApp real, pasarela de pagos y stock dedicado al canal web.",
      };
    else if (chatsTotal > 0 || monthOrders.length > 0)
      verdict = {
        label: "🟡 EN OBSERVACIÓN",
        cls: "border-amber-500/50 bg-amber-500/10 text-amber-400",
        msg: `Aún no alcanzas los umbrales (≥${TH.chats} chats, ≥${TH.pedidos} pedidos/mes, ≥${TH.conv}% conversión). Comparte el enlace del experimento y registra cada conversación.`,
      };
    else
      verdict = {
        label: "⚪ SIN DATOS SUFICIENTES",
        cls: "border-white/15 bg-white/5 text-zinc-400",
        msg: "Comparte el enlace del experimento (/experimento.html) con usuarios reales: cada clic y cada sección vista llena este panel automáticamente vía /api/track.",
      };

    return {
      evs,
      byId,
      sids,
      chatsTotal,
      chatsConv,
      convPct,
      ordersCount: monthOrders.length,
      revenue,
      verdict,
      TH,
    };
  }, [db]);

  if (loading || !s) return <p className="text-sm text-zinc-500">Cargando datos del experimento…</p>;

  const productEntries = Object.entries(s.byId).filter(([k]) => k.startsWith("prod_"));
  const maxProd = Math.max(1, ...productEntries.map(([, v]) => v));
  const topProducts = [...productEntries].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxSec = Math.max(1, ...SECTIONS.map((x) => s.byId[x.id] || 0));
  const wow = ["wow_fitcalc", "wow_fitcalc_wa", "pay_qr_gen", "pay_copy", "pay_comprobante_wa"];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Validación MVP · Lean Startup"
        desc="Evidencia en vivo: tráfico real de la landing pública + negocio registrado"
      />

      <div className={`rounded-xl border p-5 ${s.verdict.cls}`}>
        <p className="font-display text-lg font-bold">{s.verdict.label}</p>
        <p className="mt-1 text-sm opacity-80">{s.verdict.msg}</p>
        <p className="mt-2 text-[11px] opacity-60">
          Umbrales: ≥{s.TH.chats} chats registrados · ≥{s.TH.pedidos} pedidos este mes · ≥{s.TH.conv}% conversión
          chat→pedido
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Sesiones con actividad" value={String(s.sids)} sub="visitantes únicos que interactuaron" />
        <KpiCard label="Eventos capturados" value={String(s.evs.length)} sub="clics y secciones vía /api/track" />
        <KpiCard label="Chats registrados" value={String(s.chatsTotal)} sub={`${s.chatsConv} convertidos en pedido`} />
        <KpiCard
          label="Conversión chat→pedido"
          value={`${s.convPct}%`}
          sub={`umbral ${s.TH.conv}% · ${fmtMoney(s.revenue)} vendido este mes`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={`${cardCls} p-5`}>
          <h3 className="mb-4 font-semibold">🏆 Productos con más intención (clics a WhatsApp)</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-zinc-500">Sin clics aún. Comparte el enlace del experimento.</p>
          ) : (
            <ul className="space-y-2.5">
              {topProducts.map(([id, n]) => (
                <li key={id}>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>{id.replace("prod_", "")}</span>
                    <span className="font-bold text-zinc-200">{n}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-white/5">
                    <div className="h-2 rounded-full bg-amber-400/70" style={{ width: `${(n / maxProd) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${cardCls} p-5`}>
          <h3 className="mb-4 font-semibold">📉 Embudo de la landing (secciones realmente vistas)</h3>
          <ul className="space-y-2.5">
            {SECTIONS.map((sec) => {
              const n = s.byId[sec.id] || 0;
              return (
                <li key={sec.id}>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>{sec.label}</span>
                    <span className="font-bold text-zinc-200">{n}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-white/5">
                    <div className="h-2 rounded-full bg-sky-400/60" style={{ width: `${(n / maxSec) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={`${cardCls} p-5`}>
          <h3 className="mb-3 font-semibold">✨ Uso de las funciones WOW</h3>
          <div className="flex flex-wrap gap-2">
            {wow.map((id) => (
              <span
                key={id}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-300"
              >
                {id} <strong className="ml-1 text-amber-400">{s.byId[id] || 0}</strong>
              </span>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-zinc-600">
            wow_fitcalc_wa &gt; 0 significa que la calculadora no solo se usó: generó intención de compra.
            pay_comprobante_wa &gt; 0 significa que alguien declaró haber pagado.
          </p>
        </div>

        <div className={`${cardCls} p-5`}>
          <h3 className="mb-3 font-semibold">📌 Pedidos del mes (canal digital)</h3>
          <p className="font-display text-4xl font-bold">{s.ordersCount}</p>
          <p className="mt-1 text-sm text-zinc-400">
            Ingresos registrados este mes: <strong className="text-emerald-400">{fmtMoney(s.revenue)}</strong>
          </p>
          <p className="mt-4 text-xs leading-relaxed text-zinc-600">
            Regla de decisión Lean Startup: si se validan los umbrales → escalar (inversión). Si no → pivotar
            (ajustar oferta o canal) sin gastar más de lo necesario.
          </p>
        </div>
      </div>
    </div>
  );
}
