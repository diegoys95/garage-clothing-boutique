import { waLink } from "@/lib/config";

const steps = [
  {
    n: "1",
    title: "Elige tu prenda",
    text: "Explora el catálogo y escríbele a tu asesor por WhatsApp para confirmar stock y talla.",
  },
  {
    n: "2",
    title: "Paga con transferencia o depósito",
    text: "Cuentas a nombre de Garage Clothing Boutique. Tu asesor comparte los datos bancarios al confirmar el pedido.",
  },
  {
    n: "3",
    title: "Recibe tu pedido",
    text: "Envía el comprobante por WhatsApp, coordinamos entrega a domicilio en 5 provincias o recogida en tienda.",
  },
];

export default function Payment() {
  return (
    <section id="pagos" className="scroll-mt-20 border-y border-white/10 bg-zinc-900/50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">
            Paga de forma <span className="text-amber-400">simple y segura</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
            Sin carritos ni registros complicados: tres pasos y tu prenda está
            en camino, respaldada por un asesor real.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <article
              key={s.n}
              className="relative rounded-xl border border-white/10 bg-zinc-950 p-6"
            >
              <span className="font-display absolute -top-4 left-6 rounded-md bg-amber-500 px-3 py-1 text-lg font-bold text-black">
                {s.n}
              </span>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-lg border border-white/10 p-4">
            <p className="font-semibold">🏦 Transferencia bancaria</p>
            <p className="mt-1 text-zinc-400">
              Banco Pichincha · Banco Guayaquil (datos los envía tu asesor).
            </p>
          </div>
          <div className="rounded-lg border border-white/10 p-4">
            <p className="font-semibold">💵 Efectivo en tienda</p>
            <p className="mt-1 text-zinc-400">
              Reserva por WhatsApp y paga al recoger en Ambato o Riobamba.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="font-semibold text-emerald-400">✅ Compra protegida</p>
            <p className="mt-1 text-zinc-400">
              Video de tu prenda antes del despacho + garantía de originalidad.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href={waLink("Hola GARAGE 👋 Quiero realizar un pedido y necesito los datos de pago.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-emerald-500 px-8 py-3 font-semibold text-white transition hover:bg-emerald-400"
          >
            Iniciar mi pedido ahora
          </a>
        </div>
      </div>
    </section>
  );
}
