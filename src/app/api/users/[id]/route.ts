import { NextRequest, NextResponse } from "next/server";
import { parseDetails } from "@/lib/academic/details";
import {
  canCoordinate,
  canCreateRole,
  canManageSystem,
  isSoleAdminEmail,
  resolveRole,
} from "@/lib/auth/admin";
import { getCurrentProfile, getProfileById } from "@/lib/auth/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { type Profile, toPublicUser } from "@/lib/auth/types";
import { onStudentEnrolled } from "@/lib/email/send-student-welcome";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const current = await getCurrentProfile();
  if (!current || !canCoordinate(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  const { id } = await context.params;
  const user = await getProfileById(id);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, user });
}

export async function PATCH(request: NextRequest, context: Context) {
  const current = await getCurrentProfile();
  if (!current || !canCoordinate(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const { id } = await context.params;
  const existing = await getProfileById(id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado." }, { status: 404 });
  }
  if (isSoleAdminEmail(existing.email) && !isSoleAdminEmail(current.email)) {
    return NextResponse.json({ ok: false, error: "No puedes modificar a la administradora." }, { status: 403 });
  }
  if (
    current.role === "coordinator" &&
    existing.role !== "student" &&
    existing.role !== "teacher"
  ) {
    return NextResponse.json({ ok: false, error: "Solo puedes gestionar alumnos y profesores." }, { status: 403 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : existing.name;
  const phone = typeof body.phone === "string" ? body.phone.trim() : existing.phone ?? "";
  const details = parseDetails({ ...existing.details, ...(body.details as object) });
  const accountStatus =
    body.accountStatus === "inactivo" || body.accountStatus === "activo"
      ? body.accountStatus
      : existing.accountStatus;

  let role = existing.role;
  if (typeof body.role === "string" && canManageSystem(current.role, current.email)) {
    role = resolveRole(existing.email, body.role);
    if (role === "admin") role = existing.role;
  }

  if (!canCreateRole(current.role, role === "admin" ? "student" : role, current.email) && role !== existing.role) {
    return NextResponse.json({ ok: false, error: "No puedes asignar ese perfil." }, { status: 403 });
  }

  details.accountStatus = accountStatus;
  const becameEnrolled =
    role === "student" &&
    existing.details.enrollmentStatus !== "active" &&
    details.enrollmentStatus === "active";

  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(id, {
    ban_duration: accountStatus === "inactivo" ? "876000h" : "none",
    user_metadata: {
      name,
      phone,
      role,
      details,
      accountStatus,
    },
  });

  const payload = {
    name,
    phone: phone || null,
    role,
    details,
  };

  let { data: profile, error } = await admin
    .from("profiles")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    ({ data: profile, error } = await admin
      .from("profiles")
      .update({ name, phone: phone || null })
      .eq("id", id)
      .select("*")
      .single());
  }

  if (error || !profile) {
    return NextResponse.json(
      { ok: false, error: error?.message || "No se pudo actualizar." },
      { status: 500 },
    );
  }

  let welcome: { studentEmail?: string } | undefined;
  if (becameEnrolled) {
    welcome = await onStudentEnrolled({
      studentId: id,
      name,
      email: existing.email,
      role,
      details,
    });
  }

  return NextResponse.json({
    ok: true,
    user: toPublicUser({
      ...(profile as Profile),
      role,
      details,
      account_status: accountStatus,
    }),
    studentWelcomeEmail: welcome?.studentEmail,
  });
}

export async function DELETE(_request: NextRequest, context: Context) {
  const current = await getCurrentProfile();
  if (!current || !canManageSystem(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  const { id } = await context.params;
  const existing = await getProfileById(id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado." }, { status: 404 });
  }
  if (isSoleAdminEmail(existing.email) || existing.id === current.id) {
    return NextResponse.json(
      { ok: false, error: "Esta cuenta no se puede eliminar." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  await admin.from("profiles").delete().eq("id", id);
  await admin.auth.admin.deleteUser(id);
  return NextResponse.json({ ok: true });
}
