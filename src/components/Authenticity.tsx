import { site } from "@/lib/config";

const guarantees = [
  {
    icon: "🛡️",
    title: "100% originales o te devolvemos tu dinero",
    text: "Cada prenda es importada directamente de EE. UU. Si encuentras algo que no sea original, devolvemos el 100% de tu pago.",
  },
  {
    icon: "🏬",
    title: `Respaldo físico: ${site.years} años en el mercado`,
    text: "No somos una tienda fantasma. Tenemos locales reales en Ambato y Riobamba donde puedes ver, tocar y probarte tus prendas.",
  },
  {
    icon: "📹",
    title: "Prueba de autenticidad en video",
    text: "Grabamos unboxing y detalles (etiquetas, costuras, hologramas) de tu prenda antes de enviarla. La transparencia es nuestra garantía.",
  },
];

export default function Authenticity() {
  return (
    <section id="autenticidad" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">
          Autenticidad <span className="text-amber-400">garantizada</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
          Comprar ropa importada por internet no debería ser una apuesta. Estos
          son los compromisos que nos respaldan frente a las réplicas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {guarantees.map((g) => (
          <article
            key={g.title}
            className="rounded-xl border border-white/10 bg-zinc-900 p-6"
          >
            <span className="text-3xl">{g.icon}</span>
            <h3 className="mt-4 font-semibold">{g.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{g.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-bold uppercase">
              Mira las pruebas tú mismo
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              Unboxings y comparativas de autenticidad en nuestras redes.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={site.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            >
              TikTok
            </a>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            >
              Instagram
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <a
              key={n}
              href={site.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex aspect-[9/16] max-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-zinc-950 text-center transition hover:border-amber-500/50"
            >
              <span className="text-2xl">▶️</span>
              <span className="mt-2 px-2 text-xs text-zinc-500">
                Video unboxing {n}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
