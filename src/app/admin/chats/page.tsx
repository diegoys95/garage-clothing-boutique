"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import {
  Badge,
  STATUS_TONE,
  KpiCard,
  SectionHeader,
  btnGhost,
  btnPrimary,
  cardCls,
  fmtDateTime,
  inputCls,
  labelCls,
} from "@/components/admin/ui";

const CHANNELS = ["WhatsApp", "Web", "TikTok", "Instagram", "Referido"] as const;

export default function ChatsPage() {
  const { db, loading, action } = useAdmin();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", channel: "WhatsApp", interest: "" });

  if (loading || !db) return <p className="text-sm text-zinc-500">Cargando chats…</p>;

  const abiertos = db.chats.filter((c) => c.status === "abierto");
  const convertidos = db.chats.filter((c) => c.status === "convertido");
  const tasa = db.chats.length ? Math.round((convertidos.length / db.chats.length) * 100) : 0;
  const chats = [...db.chats].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const submit = async () => {
    const ok = await action("chat.create", form);
    if (ok) setForm({ name: "", phone: "", channel: "WhatsApp", interest: "" });
  };

  const convertir = (c: { name: string; phone: string; id: string }) => {
    router.push(`/admin/despachos?cliente=${encodeURIComponent(c.name)}&tel=${encodeURIComponent(c.phone)}&chat=${c.id}`);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Chats y Asesorías"
        desc="Registro de conversaciones de WhatsApp y su conversión en ventas"
      />

      <div className="grid grid-cols-3 gap-4">
        <KpiCard value={String(abiertos.length)} label="Chats abiertos" sub="En asesoría activa" />
        <KpiCard value={String(convertidos.length)} label="Convertidos a venta" />
        <KpiCard value={`${tasa}%`} label="Tasa de conversión" sub="De todos los chats registrados" />
      </div>

      <section className={`${cardCls} p-5`}>
        <h2 className="mb-4 text-sm font-semibold tracking-wider text-zinc-300 uppercase">Registrar chat entrante</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className={labelCls}>Cliente</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Teléfono</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+593 …" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Canal de origen</label>
            <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className={inputCls}>
              {CHANNELS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Interés / consulta</label>
            <input value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} placeholder="Ej. Camisa Tommy talla L" className={inputCls} />
          </div>
        </div>
        <button onClick={submit} disabled={!form.name} className={`${btnPrimary} mt-4`}>
          Registrar chat
        </button>
      </section>

      <section className={`${cardCls} overflow-x-auto`}>
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs tracking-wider text-zinc-400 uppercase">
              <th className="px-5 py-3">Cliente</th>
              <th className="px-3 py-3">Canal</th>
              <th className="px-3 py-3">Consulta</th>
              <th className="px-3 py-3">Fecha</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((c) => (
              <tr key={c.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-2.5">
                  <p className="font-mono text-[10px] text-zinc-500">{c.id}</p>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-zinc-500">{c.phone}</p>
                </td>
                <td className="px-3 py-2.5">
                  <Badge tone="blue">{c.channel}</Badge>
                </td>
                <td className="px-3 py-2.5 max-w-64 truncate text-zinc-400">{c.interest || "—"}</td>
                <td className="px-3 py-2.5 whitespace-nowrap text-xs text-zinc-500">{fmtDateTime(c.createdAt)}</td>
                <td className="px-3 py-2.5">
                  <Badge tone={STATUS_TONE[c.status]}>
                    {c.status === "abierto" ? "Abierto" : c.status === "convertido" ? "Convertido ✓" : "Cerrado"}
                  </Badge>
                </td>
                <td className="px-5 py-2.5 text-right whitespace-nowrap">
                  {c.status === "abierto" && (
                    <>
                      <button onClick={() => convertir(c)} className={btnPrimary}>
                        Convertir en pedido →
                      </button>{" "}
                    </>
                  )}
                  {c.status === "abierto" ? (
                    <button onClick={() => void action("chat.update", { id: c.id, status: "cerrado" })} className={btnGhost}>
                      Cerrar sin venta
                    </button>
                  ) : (
                    <button onClick={() => void action("chat.update", { id: c.id, status: "abierto" })} className={btnGhost}>
                      Reabrir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
