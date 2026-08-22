import { promises as fs } from "fs";
import path from "path";
import type {
  Chat,
  DbShape,
  InventoryRow,
  Order,
  Payment,
  Product,
  Reseller,
  StoreId,
} from "./types";

const DATA_DIR = process.env.VERCEL ? "/tmp/garage-data" : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "garage-db.json");

const daysAgo = (d: number, h = 10) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  t.setHours(h, (d * 17) % 60, 0, 0);
  return t.toISOString();
};

const PRODUCTS: Product[] = [
  { id: "camisa-tommy-oxford", sku: "TH-OXF", name: "Camisa Oxford Classic Fit", brand: "Tommy Hilfiger", category: "Camisas", price: 59.9, sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "polo-ralph-lauren", sku: "RL-PIQ", name: "Polo Piqué Custom Fit", brand: "Ralph Lauren", category: "Polos", price: 64.9, sizes: ["S", "M", "L", "XL"] },
  { id: "jeans-levis-511", sku: "LV-511", name: "Jean Slim Fit 511", brand: "Levi's", category: "Pantalones", price: 74.9, sizes: ["30x32", "32x32", "34x32", "36x32", "38x32"] },
  { id: "camiseta-nike-dri", sku: "NK-DRF", name: "Camiseta Dri-FIT Essentials", brand: "Nike", category: "Camisetas", price: 29.9, sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "chaqueta-carhartt", sku: "CH-DTR", name: "Chaqueta Detroit Workwear", brand: "Carhartt", category: "Chaquetas", price: 89.9, sizes: ["M", "L", "XL", "XXL"] },
  { id: "camisa-nautica-linen", sku: "NA-LIN", name: "Camisa Lino Resort", brand: "Nautica", category: "Camisas", price: 49.9, sizes: ["S", "M", "L", "XL"] },
  { id: "jean-wrangler-texana", sku: "WR-TX", name: "Jean Regular Fit Texas", brand: "Wrangler", category: "Pantalones", price: 59.9, sizes: ["32x32", "34x32", "36x32", "38x32", "40x32"] },
  { id: "polo-lacoste-classic", sku: "LC-1212", name: "Polo L.12.12 Classic", brand: "Lacoste", category: "Polos", price: 69.9, sizes: ["3", "4", "5", "6", "7"] },
];

export function priceOf(productId: string): number {
  return PRODUCTS.find((p) => p.id === productId)?.price ?? 0;
}

function seedInventory(): InventoryRow[] {
  const rows: InventoryRow[] = [];
  const pattern = [4, 7, 2, 0, 9, 3, 6, 1, 8, 5, 2, 11];
  let i = 0;
  for (const p of PRODUCTS) {
    for (const size of p.sizes) {
      for (const store of ["ambato", "riobamba"] as StoreId[]) {
        rows.push({ productId: p.id, size, store, qty: pattern[i % pattern.length] });
        i++;
      }
    }
  }
  return rows;
}

const RESELLERS: Reseller[] = [
  { id: "RE-001", name: "Modas Shirley", phone: "+593 98 452 1187", city: "Ambato", province: "Tungurahua", discountPct: 15, active: true, since: daysAgo(400), notes: "Compra cada 2 semanas, prefiere polos." },
  { id: "RE-002", name: "Tienda Andrade", phone: "+593 97 218 4402", city: "Guaranda", province: "Bolívar", discountPct: 12, active: true, since: daysAgo(320) },
  { id: "RE-003", name: "StreetWear Latacunga", phone: "+593 99 674 2315", city: "Latacunga", province: "Cotopaxi", discountPct: 18, active: true, since: daysAgo(210), notes: "Vende por Instagram, pide camisetas Nike." },
  { id: "RE-004", name: "El Armario de Puyo", phone: "+593 96 381 5590", city: "Puyo", province: "Pastaza", discountPct: 15, active: true, since: daysAgo(150) },
  { id: "RE-005", name: "Ropa del Centro", phone: "+593 99 903 7741", city: "Riobamba", province: "Chimborazo", discountPct: 20, active: false, since: daysAgo(500), notes: "Inactivo desde marzo, retomar contacto." },
];

type SeedOrderInput = {
  type: "minorista" | "revendedor";
  resellerId?: string;
  customerName: string;
  phone: string;
  province: Order["province"];
  address: string;
  originStore: StoreId;
  items: [string, string, number][];
  paymentStatus: Order["paymentStatus"];
  status: Order["status"];
  courier?: string;
  createdAt: string;
  notes?: string;
};

function buildOrders(): Order[] {
  const inputs: SeedOrderInput[] = [
    { type: "minorista", customerName: "Marcelo Torres", phone: "+593 98 512 3390", province: "Tungurahua", address: "Av. Los Chibuleos y Huachi", originStore: "ambato", items: [["camisa-tommy-oxford", "L", 1]], paymentStatus: "pagado", status: "entregado", courier: "Tramaco", createdAt: daysAgo(12) },
    { type: "revendedor", resellerId: "RE-002", customerName: "Tienda Andrade", phone: "+593 97 218 4402", province: "Bolívar", address: "Calle Sucre 4-35", originStore: "riobamba", items: [["jeans-levis-511", "32x32", 4], ["jeans-levis-511", "34x32", 4], ["camiseta-nike-dri", "L", 4]], paymentStatus: "pagado", status: "entregado", courier: "Servientrega", createdAt: daysAgo(11) },
    { type: "minorista", customerName: "Diego Cueva", phone: "+593 99 128 7745", province: "Chimborazo", address: "Barrio Maldonado, Riobamba", originStore: "riobamba", items: [["polo-lacoste-classic", "5", 1], ["jean-wrangler-texana", "34x32", 1]], paymentStatus: "pagado", status: "entregado", createdAt: daysAgo(9) },
    { type: "revendedor", resellerId: "RE-001", customerName: "Modas Shirley", phone: "+593 98 452 1187", province: "Tungurahua", address: "Mercado Mayorista, local 22", originStore: "ambato", items: [["polo-ralph-lauren", "M", 5], ["polo-ralph-lauren", "L", 5], ["camiseta-nike-dri", "M", 6]], paymentStatus: "pagado", status: "entregado", courier: "Tramaco", createdAt: daysAgo(8) },
    { type: "minorista", customerName: "Fernando Salazar", phone: "+593 97 884 2013", province: "Tungurahua", address: "La Merced, Ambato", originStore: "ambato", items: [["chaqueta-carhartt", "XL", 1]], paymentStatus: "por_pagar", status: "cancelado", createdAt: daysAgo(7), notes: "Cliente no confirmó pago." },
    { type: "revendedor", resellerId: "RE-003", customerName: "StreetWear Latacunga", phone: "+593 99 674 2315", province: "Cotopaxi", address: "Av. Atahualpa y Quiroga", originStore: "ambato", items: [["camiseta-nike-dri", "M", 8], ["camiseta-nike-dri", "L", 8], ["camiseta-nike-dri", "XL", 4]], paymentStatus: "pagado", status: "entregado", courier: "Servientrega", createdAt: daysAgo(6) },
    { type: "minorista", customerName: "Pablo Freire", phone: "+593 96 220 8841", province: "Bolívar", address: "Guaranda centro", originStore: "riobamba", items: [["camisa-nautica-linen", "M", 1]], paymentStatus: "pagado", status: "empacado", createdAt: daysAgo(4) },
    { type: "minorista", customerName: "Jhon Zambrano", phone: "+593 98 771 4420", province: "Pastaza", address: "Barrio El Jardín, Puyo", originStore: "ambato", items: [["camiseta-nike-dri", "XL", 2]], paymentStatus: "pagado", status: "entregado", courier: "Servientrega", createdAt: daysAgo(4, 15) },
    { type: "revendedor", resellerId: "RE-003", customerName: "StreetWear Latacunga", phone: "+593 99 674 2315", province: "Cotopaxi", address: "Av. Atahualpa y Quiroga", originStore: "ambato", items: [["jeans-levis-511", "32x32", 3], ["jeans-levis-511", "34x32", 3]], paymentStatus: "por_pagar", status: "en_ruta", courier: "Servientrega", createdAt: daysAgo(2) },
    { type: "minorista", customerName: "Andrés Naranjo", phone: "+593 99 340 6612", province: "Tungurahua", address: "Sector La Península, Ambato", originStore: "ambato", items: [["polo-lacoste-classic", "4", 1], ["polo-lacoste-classic", "6", 1]], paymentStatus: "por_pagar", status: "en_ruta", courier: "Tramaco", createdAt: daysAgo(2, 16) },
    { type: "revendedor", resellerId: "RE-004", customerName: "El Armario de Puyo", phone: "+593 96 381 5590", province: "Pastaza", address: "Av. 12 de Mayo y Tarqui", originStore: "ambato", items: [["camisa-nautica-linen", "L", 4], ["camisa-tommy-oxford", "M", 4], ["camisa-tommy-oxford", "L", 4]], paymentStatus: "pagado", status: "entregado", courier: "Servientrega", createdAt: daysAgo(1) },
    { type: "minorista", customerName: "Gabriel Paredes", phone: "+593 97 115 9083", province: "Chimborazo", address: "Cdla. San Francisco, Riobamba", originStore: "riobamba", items: [["jeans-levis-511", "34x32", 1]], paymentStatus: "pagado", status: "en_ruta", createdAt: daysAgo(1, 14) },
    { type: "minorista", customerName: "Luis Guzmán", phone: "+593 98 604 2257", province: "Tungurahua", address: "Av. Victor Hugo y Ambato", originStore: "ambato", items: [["camiseta-nike-dri", "M", 1]], paymentStatus: "por_pagar", status: "confirmado", createdAt: daysAgo(0, 9) },
    { type: "minorista", customerName: "Esteban Villacís", phone: "+593 99 258 1174", province: "Tungurahua", address: "Quisapinca, Ambato", originStore: "ambato", items: [["chaqueta-carhartt", "L", 1]], paymentStatus: "por_pagar", status: "recibido", createdAt: daysAgo(0, 11) },
  ];
  return inputs.map((o, idx) => {
    const items = o.items.map(([productId, size, qty]) => ({ productId, size, qty }));
    const subtotal = items.reduce((s, it) => s + priceOf(it.productId) * it.qty, 0);
    const pct = o.type === "revendedor" ? RESELLERS.find((r) => r.id === o.resellerId)?.discountPct ?? 0 : 0;
    const discount = Math.round(subtotal * pct) / 100;
    return {
      id: `ORD-${String(idx + 1).padStart(4, "0")}`,
      code: `ORD-${String(idx + 1).padStart(4, "0")}`,
      type: o.type,
      resellerId: o.resellerId,
      customerName: o.customerName,
      phone: o.phone,
      province: o.province,
      address: o.address,
      originStore: o.originStore,
      items,
      subtotal,
      discount,
      total: subtotal - discount,
      paymentStatus: o.paymentStatus,
      status: o.status,
      courier: o.courier,
      createdAt: o.createdAt,
      notes: o.notes,
    };
  });
}

const CHATS: Chat[] = [
  { id: "CH-001", name: "Rodrigo Morales", phone: "+593 98 330 1120", channel: "Web", interest: "Camisa Tommy Oxford talla XL", status: "abierto", createdAt: daysAgo(0, 8) },
  { id: "CH-002", name: "Xavier Bonilla", phone: "+593 97 442 8851", channel: "TikTok", interest: "Unboxing Carhartt, pregunta precio chaqueta", status: "abierto", createdAt: daysAgo(0, 10) },
  { id: "CH-003", name: "Christian Pérez", phone: "+593 99 807 2244", channel: "WhatsApp", interest: "Jean Levis 511 talla 32", status: "convertido", createdAt: daysAgo(1) },
  { id: "CH-004", name: "Milton Cárdenas", phone: "+593 96 550 3391", channel: "Instagram", interest: "Envíos a Puyo, catálogo general", status: "convertido", createdAt: daysAgo(1, 16) },
  { id: "CH-005", name: "Henry Almeida", phone: "+593 98 214 6650", channel: "Referido", interest: "Polo Ralph Lauren para regalo", status: "cerrado", createdAt: daysAgo(3) },
  { id: "CH-006", name: "Santiago Robles", phone: "+593 99 118 4473", channel: "Web", interest: "Revendedor: precios al por mayor", status: "abierto", createdAt: daysAgo(2) },
  { id: "CH-007", name: "Paúl Viteri", phone: "+593 97 660 9912", channel: "TikTok", interest: "Comparación original vs réplica Tommy", status: "cerrado", createdAt: daysAgo(4) },
  { id: "CH-008", name: "Marco Andino", phone: "+593 96 774 3320", channel: "WhatsApp", interest: "Camisa lino Nautica talla M", status: "abierto", createdAt: daysAgo(2, 15) },
  { id: "CH-009", name: "Iván Espín", phone: "+593 98 091 5567", channel: "Instagram", interest: "Guía de tallas americana, duda entre L y XL", status: "convertido", createdAt: daysAgo(5) },
];

function buildPayments(orders: Order[]): Payment[] {
  const defs: [string, Payment["method"], string, number, number][] = [
    ["ORD-0001", "transferencia", "Banco Pichincha", 12, 59.9],
    ["ORD-0002", "transferencia", "Banco Guayaquil", 11, 838.72],
    ["ORD-0003", "efectivo_tienda", "", 9, 134.8],
    ["ORD-0004", "transferencia", "Banco Pichincha", 8, 925.4],
    ["ORD-0006", "transferencia", "Produbanco", 6, 519.2],
    ["ORD-0008", "contra_entrega", "", 4, 59.8],
    ["ORD-0011", "transferencia", "Banco Bolivariano", 1, 749.08],
    ["ORD-0012", "transferencia", "Banco Pichincha", 1, 74.9],
  ];
  return defs.flatMap(([code, method, bank, ago, amount], i) => {
    const order = orders.find((o) => o.code === code);
    if (!order) return [];
    return [
      {
        id: `PAY-${String(i + 1).padStart(4, "0")}`,
        orderId: order.id,
        orderCode: order.code,
        method,
        bank: bank || undefined,
        reference: `REF${String(482100 + i * 137).slice(0, 6)}`,
        amount,
        date: daysAgo(ago, (i % 8) + 9),
        registeredBy: order.originStore === "ambato" ? "Asesor Ambato" : "Asesor Riobamba",
      } satisfies Payment,
    ];
  });
}

async function writeDbFile(db: DbShape) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_PATH}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_PATH);
}

export async function readDb(): Promise<DbShape> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw) as DbShape;
  } catch {
    const orders = buildOrders();
    const db: DbShape = {
      products: PRODUCTS,
      inventory: seedInventory(),
      resellers: RESELLERS,
      orders,
      chats: CHATS,
      payments: buildPayments(orders),
    };
    await writeDbFile(db);
    return db;
  }
}

export async function writeDb(db: DbShape) {
  await writeDbFile(db);
}
