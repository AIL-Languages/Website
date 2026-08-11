import { NextRequest, NextResponse } from "next/server";
import { canCoordinate, isSoleAdminEmail } from "@/lib/auth/admin";
import { getCurrentProfile, getProfileById } from "@/lib/auth/profile";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  const current = await getCurrentProfile();
  if (!current || !canCoordinate(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const { id } = await context.params;
  const existing = await getProfileById(id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado." }, { status: 404 });
  }
  if (isSoleAdminEmail(existing.email) && existing.id !== current.id) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  if (
    current.role === "coordinator" &&
    existing.role !== "student" &&
    existing.role !== "teacher"
  ) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const body = (await request.json()) as { password?: string };
  if (!body.password || body.password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "La contraseña debe tener al menos 8 caracteres." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(id, {
    password: body.password,
  });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
