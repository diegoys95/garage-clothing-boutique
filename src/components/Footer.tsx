import Link from "next/link";
import { site, waLink } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center bg-amber-500 font-display text-xl font-bold text-black">
              G
            </span>
            <span className="font-display text-xl font-bold uppercase tracking-widest">
              Garage
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            {site.tagline}
          </p>
          <p className="mt-3 text-xs font-semibold tracking-widest text-amber-400 uppercase">
            {site.years} años vistiendo al hombre ecuatoriano
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-widest text-zinc-200 uppercase">
            Tiendas físicas
          </h3>
          <ul className="space-y-4 text-sm text-zinc-400">
            {site.stores.map((s) => (
              <li key={s.city}>
                <p className="font-semibold text-zinc-200">🏬 {s.city}</p>
                <p>{s.address}</p>
                <p className="text-xs">{s.hours}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-widest text-zinc-200 uppercase">
            Navegación
          </h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><a href="#productos" className="hover:text-amber-400">Catálogo</a></li>
            <li><a href="#autenticidad" className="hover:text-amber-400">Autenticidad</a></li>
            <li><a href="#tallas" className="hover:text-amber-400">Guía de tallas</a></li>
            <li><a href="#envios" className="hover:text-amber-400">Envíos</a></li>
            <li><a href="#revendedores" className="hover:text-amber-400">Revendedores</a></li>
            <li><a href="#pagos" className="hover:text-amber-400">Formas de pago</a></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-widest text-zinc-200 uppercase">
            Contacto
          </h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li>
              <a
                href={waLink("Hola GARAGE 👋 Vengo de su página web.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400"
              >
                📱 {site.whatsappDisplay}
              </a>
            </li>
            <li>✉️ {site.email}</li>
            <li>
              <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">
                TikTok
              </a>{" · "}
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">
                Instagram
              </a>
            </li>
            <li>
              <Link href="/login" className="text-zinc-500 hover:text-zinc-300">
                🔒 Panel interno
              </Link>
            </li>
          </ul>
          <p className="mt-5 rounded-lg border border-white/10 p-3 text-xs leading-relaxed text-zinc-500">
            Enviamos a: Tungurahua, Chimborazo, Bolívar, Cotopaxi y Pastaza.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {site.fullName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
