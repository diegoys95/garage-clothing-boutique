import { waLink } from "@/lib/config";

const shirtSizes = [
  { size: "S", pecho: "89 - 94 cm", cintura: "74 - 79 cm" },
  { size: "M", pecho: "96 - 102 cm", cintura: "81 - 86 cm" },
  { size: "L", pecho: "104 - 109 cm", cintura: "89 - 94 cm" },
  { size: "XL", pecho: "112 - 117 cm", cintura: "97 - 99 cm" },
  { size: "XXL", pecho: "119 - 124 cm", cintura: "104 - 109 cm" },
];

const jeanSizes = [
  { size: "30x32", cintura: "30 in / 76 cm", largo: "81 cm", equivalente: "M (38 EC)" },
  { size: "32x32", cintura: "32 in / 81 cm", largo: "81 cm", equivalente: "L (40 EC)" },
  { size: "34x32", cintura: "34 in / 86 cm", largo: "81 cm", equivalente: "L (42 EC)" },
  { size: "36x32", cintura: "36 in / 91 cm", largo: "81 cm", equivalente: "XL (44 EC)" },
  { size: "38x32", cintura: "38 in / 97 cm", largo: "81 cm", equivalente: "XL (46 EC)" },
];

export default function SizeGuide() {
  return (
    <section id="tallas" className="scroll-mt-20 border-y border-white/10 bg-zinc-900/50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">
            Guía de tallas <span className="text-amber-400">americanas</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
            Compra con la seguridad de que tu talla quedará perfecta. Si tienes
            dudas, tu asesor GARAGE te guía paso a paso por WhatsApp antes de pagar.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-white/10">
            <h3 className="bg-white/5 px-5 py-3 font-semibold">
              Camisas y polos
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs tracking-wider text-zinc-400 uppercase">
                  <th className="px-5 py-2">Talla US</th>
                  <th className="px-5 py-2">Pecho</th>
                  <th className="px-5 py-2">Cintura</th>
                </tr>
              </thead>
              <tbody>
                {shirtSizes.map((r) => (
                  <tr key={r.size} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-2 font-semibold text-amber-400">{r.size}</td>
                    <td className="px-5 py-2">{r.pecho}</td>
                    <td className="px-5 py-2">{r.cintura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10">
            <h3 className="bg-white/5 px-5 py-3 font-semibold">
              Jeans y pantalones
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs tracking-wider text-zinc-400 uppercase">
                  <th className="px-5 py-2">Talla US</th>
                  <th className="px-5 py-2">Cintura</th>
                  <th className="px-5 py-2">Largo</th>
                  <th className="px-5 py-2">Equivale</th>
                </tr>
              </thead>
              <tbody>
                {jeanSizes.map((r) => (
                  <tr key={r.size} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-2 font-semibold text-amber-400">{r.size}</td>
                    <td className="px-5 py-2">{r.cintura}</td>
                    <td className="px-5 py-2">{r.largo}</td>
                    <td className="px-5 py-2 text-zinc-400">{r.equivalente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
          <p className="text-sm text-zinc-200 sm:text-base">
            💡 <strong>Consejo GARAGE:</strong> toma una prenda tuya que te quede bien,
            mídela y compáranosla. O simplemente escríbenos:{" "}
            <a
              href={waLink("Hola GARAGE 👋 Necesito ayuda para elegir mi talla correcta.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-400 hover:underline"
            >
              te ayudamos a elegir tu talla sin compromiso
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
