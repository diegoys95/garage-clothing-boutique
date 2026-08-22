import { site } from "@/lib/config";

const stats = [
  { value: `${site.years}+`, label: "Años de trayectoria en el mercado" },
  { value: "2", label: "Tiendas físicas: Ambato y Riobamba" },
  { value: "100%", label: "Prendas originales de EE. UU." },
  { value: "5", label: "Provincias con envío coordinado" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-zinc-900/50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 text-center lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-3xl font-bold text-amber-400 sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
