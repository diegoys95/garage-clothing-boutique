"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Badge, STATUS_TONE, SectionHeader, btnPrimary, cardCls, fmtDateTime, inputCls, labelCls } from "@/components/admin/ui";

const CHANNELS = ["WhatsApp", "Web", "TikTok", "Instagram", "Referido"] as const;

export default function ChatsVentasPage() {
  const { db, loading, action } = useAdmin();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", channel: "WhatsApp", interest: "" });

  if (loading || !db) return <p className="text-sm text-zinc-500">Cargando chats…</p>;

  const chats = [...db.chats].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const submit = async () => {
    const ok = await action("chat.create", form);
    if (ok) setForm({ name: "", phone: "", channel: "WhatsApp", interest: "" });
  };

  const convertir = (c: { id: string; name: string; phone: string }) => {
    router.push(`/ventas?cliente=${encodeURIComponent(c.name)}&tel=${encodeURIComponent(c.phone)}&chat=${c.id}`);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Chats entrantes" desc="Registra cada conversación y conviértela en venta en un clic" />

      <section className={`${cardCls} p-5`}>
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
            <label className={labelCls}>Canal</label>
            <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className={inputCls}>
              {CHANNELS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Consulta</label>
            <input value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} placeholder="Ej. Camisa Tommy talla L" className={inputCls} />
          </div>
        </div>
        <button onClick={submit} disabled={!form.name} className={`${btnPrimary} mt-4`}>
          Registrar chat
        </button>
      </section>

      <section className={`${cardCls} overflow-x-auto`}>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs tracking-wider text-zinc-400 uppercase">
              <th className="px-5 py-3">Cliente</th>
              <th className="px-3 py-3">Canal</th>
              <th className="px-3 py-3">Consulta</th>
              <th className="px-3 py-3">Fecha</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((c) => (
              <tr key={c.id} className={`border-b border-white/5 last:border-0 ${c.status !== "abierto" ? "opacity-50" : ""}`}>
                <td className="px-5 py-2.5">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-zinc-500">{c.phone}</p>
                </td>
                <td className="px-3 py-2.5">
                  <Badge tone="blue">{c.channel}</Badge>
                </td>
                <td className="px-3 py-2.5 max-w-56 truncate text-zinc-400">{c.interest || "—"}</td>
                <td className="px-3 py-2.5 whitespace-nowrap text-xs text-zinc-500">{fmtDateTime(c.createdAt)}</td>
                <td className="px-3 py-2.5">
                  <Badge tone={STATUS_TONE[c.status]}>
                    {c.status === "abierto" ? "Abierto" : c.status === "convertido" ? "Convertido ✓" : "Cerrado"}
                  </Badge>
                </td>
                <td className="px-5 py-2.5 text-right">
                  {c.status === "abierto" && (
                    <button onClick={() => convertir(c)} className={btnPrimary}>
                      Convertir en venta →
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
