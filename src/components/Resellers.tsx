import { waLink } from "@/lib/config";

const benefits = [
  {
    icon: "📦",
    title: "Precios por volumen",
    text: "Descuentos escalonados desde 10 prendas. Ideal para tiendas, stands y ventas online en tu ciudad.",
  },
  {
    icon: "🔁",
    title: "Reposición constante",
    text: "Importaciones mensuales desde EE. UU.: accede a modelos nuevos antes que nadie.",
  },
  {
    icon: "🤝",
    title: "Respaldo de marca",
    text: `Vende con la confianza de ${30} años de trayectoria: tus clientes ya conocen y confían en GARAGE.`,
  },
];

export default function Resellers() {
  return (
    <section id="revendedores" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 sm:p-10">
            <p className="mb-2 text-xs font-semibold tracking-widest text-amber-400 uppercase">
              Programa para revendedores locales
            </p>
            <h2 className="font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
              Vende marcas originales <span className="text-amber-400">con tu propia marca</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
              Si tienes tienda, stand o vendes por redes sociales en Tungurahua,
              Chimborazo, Bolívar, Cotopaxi o Pastaza, este es tu momento:
              abastécete de ropa original de EE. UU. con precios mayoristas.
            </p>
            <ul className="mt-6 space-y-4">
              {benefits.map((b) => (
                <li key={b.title} className="flex gap-3">
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{b.title}</p>
                    <p className="text-sm text-zinc-400">{b.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <a
              href={waLink("Hola GARAGE 👋 Soy revendedor local y me interesa comprar por volumen.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-md bg-amber-500 px-8 py-3 font-semibold text-black transition hover:bg-amber-400"
            >
              Quiero ser revendedor GARAGE
            </a>
          </div>

          <div className="relative hidden bg-gradient-to-br from-amber-500/20 via-transparent to-transparent p-10 lg:block">
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-white/15 p-10 text-center">
              <span className="font-display text-7xl font-bold text-amber-500/60">B2B</span>
              <p className="mt-4 max-w-xs text-sm text-zinc-400">
                Espacio reservado para foto del showroom o bodega de distribución
                mayorista.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
