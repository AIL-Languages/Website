import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/profile";
import { listNotifications, markNotificationRead } from "@/lib/billing/store";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  const notifications = await listNotifications(current.id);
  return NextResponse.json({ ok: true, notifications });
}

export async function PATCH(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  const body = (await request.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ ok: false, error: "Falta id." }, { status: 400 });
  }
  await markNotificationRead(body.id, current.id);
  return NextResponse.json({ ok: true });
}
