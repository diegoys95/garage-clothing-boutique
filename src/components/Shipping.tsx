import { site, waLink } from "@/lib/config";

export default function Shipping() {
  return (
    <section
      id="envios"
      className="scroll-mt-20 border-y border-white/10 bg-gradient-to-b from-amber-500/10 to-transparent"
    >
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold tracking-widest text-amber-400 uppercase">
            Llegamos cada vez más lejos
          </p>
          <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">
            Envíos seguros a <span className="text-amber-400">5 provincias</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
            Coordinamos la entrega con tu asesor GARAGE: te confirma el costo,
            el tiempo y el número de guía antes de pagar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {site.provinces.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border border-white/10 bg-zinc-900/80 p-5 text-center"
            >
              <span className="text-2xl">📍</span>
              <h3 className="mt-2 font-display text-lg font-bold uppercase">
                {p.name}
              </h3>
              <p className="mt-1 text-xs text-zinc-400">{p.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={waLink("Hola GARAGE 👋 Quiero coordinar un envío a mi provincia.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-amber-500 px-8 py-3 font-semibold text-black transition hover:bg-amber-400"
          >
            Cotizar mi envío por WhatsApp
          </a>
          <p className="mt-3 text-xs text-zinc-500">
            También puedes recoger sin costo en nuestras tiendas de Ambato o Riobamba.
          </p>
        </div>
      </div>
    </section>
  );
}
