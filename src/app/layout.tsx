import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GARAGE Clothing Boutique | Moda masculina original de EE. UU. en Ambato y Riobamba",
  description:
    "30 años vistiendo hombres con marcas originales de EE. UU.: Tommy Hilfiger, Ralph Lauren, Levi's y más. Tiendas físicas en Ambato y Riobamba, envíos seguros a Tungurahua, Chimborazo, Bolívar, Cotopaxi y Pastaza. Asesoría directa por WhatsApp.",
  keywords: [
    "ropa masculina original",
    "marcas americanas Ecuador",
    "Ambato",
    "Riobamba",
    "Tommy Hilfiger Ecuador",
    "Ralph Lauren Ambato",
    "Levis Riobamba",
    "ropa importada original",
  ],
  openGraph: {
    title: "GARAGE Clothing Boutique",
    description:
      "Moda masculina premium a un clic: marcas originales de EE. UU. con la confianza de siempre y entrega directa.",
    locale: "es_EC",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
