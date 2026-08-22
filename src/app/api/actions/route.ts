import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { priceOf, readDb, writeDb } from "@/lib/store";
import type {
  Chat,
  DbShape,
  InventoryRow,
  Order,
  OrderItem,
  Payment,
  Reseller,
  StoreId,
} from "@/lib/types";

type Payload = Record<string, unknown>;

const str = (p: Payload, k: string) => String(p[k] ?? "");
const num = (p: Payload, k: string) => Number(p[k] ?? 0);

function qtyOf(db: DbShape, productId: string, size: string, store: StoreId): number {
  return db.inventory.find((r) => r.productId === productId && r.size === size && r.store === store)?.qty ?? 0;
}

function setQty(db: DbShape, productId: string, size: string, store: StoreId, delta: number) {
  let row = db.inventory.find((r) => r.productId === productId && r.size === size && r.store === store);
  if (!row) {
    row = { productId, size, store, qty: 0 } as InventoryRow;
    db.inventory.push(row);
  }
  row.qty = Math.max(0, row.qty + delta);
}

export async function POST(request: NextRequest) {
  if (!request.cookies.get("garage_admin")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = (await request.json()) as { type?: string; payload?: Payload };
  const type = body.type ?? "";
  const p = body.payload ?? {};
  const db = await readDb();

  try {
    if (type === "inventory.adjust") {
      const delta = num(p, "delta");
      if (!delta) throw new Error("Cantidad inválida");
      setQty(db, str(p, "productId"), str(p, "size"), str(p, "store") as StoreId, delta);
    } else if (type === "inventory.transfer") {
      const productId = str(p, "productId");
      const size = str(p, "size");
      const from = str(p, "from") as StoreId;
      const to = str(p, "to") as StoreId;
      const qty = Math.floor(num(p, "qty"));
      if (!productId || !size || !qty || from === to) throw new Error("Datos de transferencia incompletos");
      if (qtyOf(db, productId, size, from) < qty) throw new Error("Stock insuficiente en la tienda de origen");
      setQty(db, productId, size, from, -qty);
      setQty(db, productId, size, to, qty);
    } else if (type === "order.create") {
      const items = (p.items as { productId: string; size: string; qty: number }[]) ?? [];
      const originStore = str(p, "originStore") as StoreId;
      const cleanItems: OrderItem[] = items.filter((i) => i.productId && i.size && i.qty > 0);
      if (!cleanItems.length) throw new Error("Agrega al menos un producto");
      if (!str(p, "customerName")) throw new Error("Falta el nombre del cliente");
      for (const it of cleanItems) {
        const available = qtyOf(db, it.productId, it.size, originStore);
        if (available < it.qty) {
          throw new Error(`Stock insuficiente: ${it.productId} talla ${it.size} (${available} disp. en ${originStore})`);
        }
      }
      for (const it of cleanItems) setQty(db, it.productId, it.size, originStore, -it.qty);
      const subtotal = cleanItems.reduce((s, it) => s + priceOf(it.productId) * it.qty, 0);
      const isReseller = str(p, "type") === "revendedor";
      const reseller = isReseller ? db.resellers.find((r) => r.id === str(p, "resellerId")) : undefined;
      const pct = reseller?.discountPct ?? 0;
      const discount = Math.round(subtotal * pct) / 100;
      const n = db.orders.length + 1;
      const order: Order = {
        id: `ORD-${String(n).padStart(4, "0")}`,
        code: `ORD-${String(n).padStart(4, "0")}`,
        type: isReseller ? "revendedor" : "minorista",
        resellerId: reseller?.id,
        customerName: str(p, "customerName"),
        phone: str(p, "phone"),
        province: str(p, "province") as Order["province"],
        address: str(p, "address"),
        originStore,
        items: cleanItems,
        subtotal,
        discount,
        total: subtotal - discount,
        paymentStatus: "por_pagar",
        status: "recibido",
        courier: str(p, "courier") || undefined,
        createdAt: new Date().toISOString(),
        notes: str(p, "notes") || undefined,
      };
      db.orders.push(order);
    } else if (type === "order.update") {
      const order = db.orders.find((o) => o.id === str(p, "id"));
      if (!order) throw new Error("Pedido no encontrado");
      if (typeof p.status !== "undefined") {
        const status = str(p, "status") as Order["status"];
        if (status === "cancelado" && order.status !== "cancelado") {
          for (const it of order.items) setQty(db, it.productId, it.size, order.originStore, it.qty);
        }
        order.status = status;
      }
      if (typeof p.paymentStatus !== "undefined") order.paymentStatus = str(p, "paymentStatus") as Order["paymentStatus"];
      if (typeof p.courier !== "undefined" && str(p, "courier")) order.courier = str(p, "courier");
    } else if (type === "order.pay") {
      const order = db.orders.find((o) => o.id === str(p, "id"));
      if (!order) throw new Error("Pedido no encontrado");
      if (order.status === "cancelado") throw new Error("No se puede registrar el pago de un pedido cancelado");
      const amount = Math.round(num(p, "amount") * 100) / 100;
      if (amount <= 0) throw new Error("Monto inválido");
      order.paymentStatus = "pagado";
      db.payments.push({
        id: `PAY-${String(db.payments.length + 1).padStart(4, "0")}`,
        orderId: order.id,
        orderCode: order.code,
        method: (str(p, "method") || "transferencia") as Payment["method"],
        bank: str(p, "bank") || undefined,
        reference: str(p, "reference") || undefined,
        amount,
        date: new Date().toISOString(),
        registeredBy: str(p, "registeredBy") || "Asesor",
        note: str(p, "note") || undefined,
      });
    } else if (type === "order.unpay") {
      const order = db.orders.find((o) => o.id === str(p, "id"));
      if (!order) throw new Error("Pedido no encontrado");
      order.paymentStatus = "por_pagar";
      db.payments = db.payments.filter((pay) => pay.orderId !== order.id);
    } else if (type === "payment.delete") {
      const pay = db.payments.find((x) => x.id === str(p, "id"));
      if (!pay) throw new Error("Pago no encontrado");
      db.payments = db.payments.filter((x) => x.id !== pay.id);
      const order = db.orders.find((o) => o.id === pay.orderId);
      if (order) {
        order.paymentStatus = db.payments.some((x) => x.orderId === order.id) ? order.paymentStatus : "por_pagar";
      }
    } else if (type === "reseller.create") {
      if (!str(p, "name")) throw new Error("Falta el nombre del revendedor");
      const n = db.resellers.length + 1;
      const reseller: Reseller = {
        id: `RE-${String(n).padStart(3, "0")}`,
        name: str(p, "name"),
        phone: str(p, "phone"),
        city: str(p, "city"),
        province: str(p, "province") as Reseller["province"],
        discountPct: Math.min(50, Math.max(0, num(p, "discountPct"))),
        active: true,
        notes: str(p, "notes") || undefined,
        since: new Date().toISOString(),
      };
      db.resellers.push(reseller);
    } else if (type === "reseller.update") {
      const reseller = db.resellers.find((r) => r.id === str(p, "id"));
      if (!reseller) throw new Error("Revendedor no encontrado");
      if (typeof p.active !== "undefined") reseller.active = Boolean(p.active);
      if (typeof p.discountPct !== "undefined") reseller.discountPct = Math.min(50, Math.max(0, num(p, "discountPct")));
      if (typeof p.phone !== "undefined" && str(p, "phone")) reseller.phone = str(p, "phone");
      if (typeof p.notes !== "undefined") reseller.notes = str(p, "notes") || undefined;
    } else if (type === "chat.create") {
      if (!str(p, "name")) throw new Error("Falta el nombre del cliente");
      const n = db.chats.length + 1;
      const chat: Chat = {
        id: `CH-${String(n).padStart(3, "0")}`,
        name: str(p, "name"),
        phone: str(p, "phone"),
        channel: (str(p, "channel") || "WhatsApp") as Chat["channel"],
        interest: str(p, "interest"),
        status: "abierto",
        createdAt: new Date().toISOString(),
      };
      db.chats.push(chat);
    } else if (type === "chat.update") {
      const chat = db.chats.find((c) => c.id === str(p, "id"));
      if (!chat) throw new Error("Chat no encontrado");
      chat.status = str(p, "status") as Chat["status"];
    } else {
      throw new Error(`Acción desconocida: ${type}`);
    }

    await writeDb(db);
    return NextResponse.json(db);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error inesperado" }, { status: 400 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
