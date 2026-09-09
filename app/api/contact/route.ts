import { NextResponse } from "next/server";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const improve = String(body.improve ?? "").trim();

  if (name.length < 2 || !isEmail(email) || improve.length < 12) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
