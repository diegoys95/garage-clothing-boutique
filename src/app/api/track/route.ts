import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = typeof body?.id === "string" ? body.id.slice(0, 60) : "";
    const sid = typeof body?.sid === "string" ? body.sid.slice(0, 24) : "anon";
    if (!id) return NextResponse.json({ ok: false }, { status: 400 });
    const db = await readDb();
    db.events.push({ id, t: Date.now(), sid });
    if (db.events.length > 3000) db.events = db.events.slice(-2000);
    await writeDb(db);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
