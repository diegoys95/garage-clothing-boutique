export type StoreId = "ambato" | "riobamba";

export const MIN_STOCK = 3;

export type Province =
  | "Tungurahua"
  | "Chimborazo"
  | "Bolívar"
  | "Cotopaxi"
  | "Pastaza";

export const STORES: { id: StoreId; label: string }[] = [
  { id: "ambato", label: "Ambato" },
  { id: "riobamba", label: "Riobamba" },
];

export type Product = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  sizes: string[];
};

export type InventoryRow = {
  productId: string;
  size: string;
  store: StoreId;
  qty: number;
};

export type OrderItem = {
  productId: string;
  size: string;
  qty: number;
};

export type OrderStatus =
  | "recibido"
  | "confirmado"
  | "empacado"
  | "en_ruta"
  | "entregado"
  | "cancelado";

export const ORDER_FLOW: OrderStatus[] = [
  "recibido",
  "confirmado",
  "empacado",
  "en_ruta",
  "entregado",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  recibido: "Recibido",
  confirmado: "Confirmado",
  empacado: "Empacado",
  en_ruta: "En ruta",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export type PaymentStatus = "por_pagar" | "pagado";

export type PaymentMethod = "transferencia" | "efectivo_tienda" | "contra_entrega";

export const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "transferencia", label: "Transferencia / Depósito" },
  { id: "efectivo_tienda", label: "Efectivo en tienda" },
  { id: "contra_entrega", label: "Efectivo contra entrega" },
];

export type Payment = {
  id: string;
  orderId: string;
  orderCode: string;
  method: PaymentMethod;
  bank?: string;
  reference?: string;
  amount: number;
  date: string;
  registeredBy: string;
  note?: string;
};

export type Order = {
  id: string;
  code: string;
  type: "minorista" | "revendedor";
  resellerId?: string;
  customerName: string;
  phone: string;
  province: Province;
  address: string;
  originStore: StoreId;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  courier?: string;
  createdAt: string;
  notes?: string;
};

export type Reseller = {
  id: string;
  name: string;
  phone: string;
  city: string;
  province: Province;
  discountPct: number;
  active: boolean;
  notes?: string;
  since: string;
};

export type ChatChannel = "Web" | "WhatsApp" | "TikTok" | "Instagram" | "Referido";
export type ChatStatus = "abierto" | "convertido" | "cerrado";

export type Chat = {
  id: string;
  name: string;
  phone: string;
  channel: ChatChannel;
  interest: string;
  status: ChatStatus;
  createdAt: string;
};

export type TrackEvent = {
  id: string;
  t: number;
  sid?: string;
};

export type DbShape = {
  products: Product[];
  inventory: InventoryRow[];
  orders: Order[];
  resellers: Reseller[];
  chats: Chat[];
  payments: Payment[];
  events: TrackEvent[];
};
