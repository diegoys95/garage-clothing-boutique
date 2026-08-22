import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readDb } from "@/lib/store";

export async function GET(request: NextRequest) {
  if (!request.cookies.get("garage_admin")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const db = await readDb();
  return NextResponse.json(db);
}
