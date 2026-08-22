import { site, waLink } from "@/lib/config";

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.15),transparent_55%)]" />
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-400 uppercase">
          {site.years} años de trayectoria · Ambato y Riobamba
        </p>
        <h1 className="font-display mx-auto max-w-3xl text-4xl font-bold uppercase leading-tight sm:text-6xl">
          Moda masculina premium a un clic
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-300 sm:text-lg">
          Marcas originales de EE. UU. con la confianza de siempre y entrega
          directa. Compra sin miedo a réplicas: respaldo real de tiendas físicas
          y asesoría humana por WhatsApp.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#productos"
            className="w-full rounded-md bg-amber-500 px-8 py-3 font-semibold text-black transition hover:bg-amber-400 sm:w-auto"
          >
            Ver catálogo
          </a>
          <a
            href={waLink("Hola GARAGE 👋 Quiero asesoría para elegir mi prenda.")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-md border border-emerald-500/50 px-8 py-3 font-semibold text-emerald-400 transition hover:bg-emerald-500/10 sm:w-auto"
          >
            Asesoría por WhatsApp
          </a>
        </div>
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-400">
          <li>✔️ 100% originales garantizados</li>
          <li>🚚 Envíos seguros a 5 provincias</li>
          <li>🏬 Respaldo físico en Ambato y Riobamba</li>
        </ul>
      </div>
    </section>
  );
}
