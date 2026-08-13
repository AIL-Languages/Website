import { NextRequest, NextResponse } from "next/server";
import { parseDetails } from "@/lib/academic/details";
import { canCoordinate, canCreateRole } from "@/lib/auth/admin";
import { getCurrentProfile, listProfiles } from "@/lib/auth/profile";
import { isResendConfigured } from "@/lib/email/resend";
import {
  onStudentEnrolled,
  sendStudentWelcomeEmail,
} from "@/lib/email/send-student-welcome";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "Debes iniciar sesión." }, { status: 401 });
  }
  if (!canCoordinate(current.role, current.email) && current.role !== "company") {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  if (!canCreateRole(current.role, "student", current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  if (!isResendConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Falta configurar Resend (RESEND_API_KEY)." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    studentId?: string;
    persist?: boolean;
    force?: boolean;
    details?: Record<string, unknown>;
  };

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  if (!name || !email) {
    return NextResponse.json(
      { ok: false, error: "Indica nombre y correo del alumno." },
      { status: 400 },
    );
  }

  try {
    const users = await listProfiles();
    const profile =
      users.find((item) => item.id === body.studentId) ||
      users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (body.persist === false || !profile) {
      const result = await sendStudentWelcomeEmail({
        name,
        email,
        details: parseDetails(body.details ?? profile?.details),
        studentId: profile?.id,
      });
      return NextResponse.json({ ok: true, ...result, persisted: false });
    }

    const result = await onStudentEnrolled({
      studentId: profile.id,
      name: profile.name || name,
      email: profile.email,
      role: profile.role,
      details: {
        ...profile.details,
        ...parseDetails(body.details),
        enrollmentStatus: profile.details.enrollmentStatus || "active",
      },
      force: body.force !== false,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[student-welcome:send]", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "No se pudo enviar el correo.",
      },
      { status: 502 },
    );
  }
}
