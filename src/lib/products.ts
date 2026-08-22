import { site } from "./config";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  sizes: string[];
  badge?: string;
};

export const categories = [
  "Todos",
  "Camisas",
  "Polos",
  "Camisetas",
  "Pantalones",
  "Chaquetas",
] as const;

export const products: Product[] = [
  {
    id: "camisa-tommy-oxford",
    name: "Camisa Oxford Classic Fit",
    brand: "Tommy Hilfiger",
    category: "Camisas",
    price: 59.9,
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Más vendida",
  },
  {
    id: "polo-ralph-lauren",
    name: "Polo Piqué Custom Fit",
    brand: "Ralph Lauren",
    category: "Polos",
    price: 64.9,
    sizes: ["S", "M", "L", "XL"],
    badge: "Original EE.UU.",
  },
  {
    id: "jeans-levis-511",
    name: "Jean Slim Fit 511",
    brand: "Levi's",
    category: "Pantalones",
    price: 74.9,
    sizes: ["30x32", "32x32", "34x32", "36x32", "38x32"],
  },
  {
    id: "camiseta-nike-dri",
    name: "Camiseta Dri-FIT Essentials",
    brand: "Nike",
    category: "Camisetas",
    price: 29.9,
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "chaqueta-carhartt",
    name: "Chaqueta Detroit Workwear",
    brand: "Carhartt",
    category: "Chaquetas",
    price: 89.9,
    sizes: ["M", "L", "XL", "XXL"],
    badge: "Edición limitada",
  },
  {
    id: "camisa-nautica-linen",
    name: "Camisa Lino Resort",
    brand: "Nautica",
    category: "Camisas",
    price: 49.9,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "jean-wrangler-texana",
    name: "Jean Regular Fit Texas",
    brand: "Wrangler",
    category: "Pantalones",
    price: 59.9,
    sizes: ["32x32", "34x32", "36x32", "38x32", "40x32"],
  },
  {
    id: "polo-lacoste-classic",
    name: "Polo L.12.12 Classic",
    brand: "Lacoste",
    category: "Polos",
    price: 69.9,
    sizes: ["3", "4", "5", "6", "7"],
  },
];

const waProductMessage = (p: Product) =>
  `Hola GARAGE 👋 Me interesa este producto:\n\n• ${p.name}\n• Marca: ${p.brand}\n• Precio: $${p.price.toFixed(2)}\n\n¿Me puedes asesorar?`;

export function productWaLink(p: Product): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(waProductMessage(p))}`;
}
