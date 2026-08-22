import { site } from "@/lib/config";
import { categories, products, productWaLink } from "@/lib/products";

import type { Product } from "@/lib/products";

function Placeholder({ product }: { product: Product }) {
  return (
    <div className="flex aspect-[4/5] flex-col items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
      <span className="font-display text-2xl font-bold tracking-widest text-amber-500/80 uppercase">
        {product.brand}
      </span>
      <span className="mt-2 rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-400">
        {product.category}
      </span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900 transition hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5">
      <Placeholder product={product} />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
          {product.brand}
        </p>
        <h3 className="mt-1 font-medium text-zinc-100">{product.name}</h3>
        <p className="mt-2 font-display text-2xl font-bold text-white">
          ${product.price.toFixed(2)}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.sizes.map((s) => (
            <span
              key={s}
              className="rounded border border-white/10 px-2 py-0.5 text-xs text-zinc-400"
            >
              {s}
            </span>
          ))}
        </div>
        <a
          href={productWaLink(product)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block rounded-md bg-emerald-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition group-hover:bg-emerald-400"
        >
          Asesoría por WhatsApp
        </a>
      </div>
    </article>
  );
}

export default function ProductGrid() {
  return (
    <section id="productos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">
          Catálogo <span className="text-amber-400">GARAGE</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
          Selección de prendas originales de EE. UU. Elige tu prenda y un asesor
          humano te confirmará stock, tallas y pago por WhatsApp.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <span
            key={c}
            className="cursor-default rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-zinc-300 first:border-amber-500/60 first:bg-amber-500/10 first:text-amber-400"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-zinc-400">
        ¿No encuentras lo que buscas?{" "}
        <a
          href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hola GARAGE 👋 Busco una prenda específica, ¿me pueden ayudar a encontrarla?")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-emerald-400 hover:underline"
        >
          Pídelo por WhatsApp
        </a>{" "}
        y lo cotizamos con la próxima importación.
      </p>
    </section>
  );
}
