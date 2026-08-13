import { NextRequest, NextResponse } from "next/server";
import {
  canCoordinate,
  canCreateRole,
  canManageSystem,
  type UserRole,
} from "@/lib/auth/admin";
import { getCurrentProfile } from "@/lib/auth/profile";
import { isResendConfigured } from "@/lib/email/resend";
import { sendStaffWelcomeEmail } from "@/lib/email/welcome";
import {
  isWelcomeRole,
  type WelcomeRole,
  type WelcomeTemplate,
} from "@/lib/email/welcome-types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "Debes iniciar sesión." }, { status: 401 });
  }
  if (!canCoordinate(current.role, current.email) && current.role !== "company") {
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
    role?: string;
    password?: string;
    template?: Partial<WelcomeTemplate>;
  };

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const role = body.role?.trim() ?? "";

  if (role === "student") {
    return NextResponse.json(
      {
        ok: false,
        error: "El correo de alumno inscrito se envía con sendStudentWelcomeEmail.",
      },
      { status: 400 },
    );
  }

  if (!name || !email || !isWelcomeRole(role)) {
    return NextResponse.json(
      { ok: false, error: "Indica nombre, correo y perfil de equipo válidos." },
      { status: 400 },
    );
  }

  if (
    !canManageSystem(current.role, current.email) &&
    !canCreateRole(current.role, role as UserRole, current.email)
  ) {
    return NextResponse.json(
      { ok: false, error: "No puedes enviar este tipo de bienvenida." },
      { status: 403 },
    );
  }

  try {
    const result = await sendStaffWelcomeEmail({
      recipient: {
        name,
        email,
        role: role as WelcomeRole,
        password: body.password?.trim() || undefined,
      },
      template: body.template,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[welcome:send]", error);
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
