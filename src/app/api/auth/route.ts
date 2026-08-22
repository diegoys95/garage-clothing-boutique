import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { password?: string; role?: string };
  const role = body.role === "ventas" ? "ventas" : "admin";
  const expected =
    role === "admin"
      ? process.env.ADMIN_PASSWORD ?? "garage2026"
      : process.env.VENTAS_PASSWORD ?? "ventas2026";
  if (body.password !== expected) {
    return NextResponse.json({ ok: false, error: "Contraseña incorrecta" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set("garage_admin", role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("garage_admin", "", { path: "/", maxAge: 0 });
  return res;
}
