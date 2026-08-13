import { NextRequest, NextResponse } from "next/server";
import { canCoordinate, canManageSystem } from "@/lib/auth/admin";
import { getCurrentProfile } from "@/lib/auth/profile";
import { isResendConfigured } from "@/lib/email/resend";
import { sendLeadWelcomeEmail } from "@/lib/email/send-lead-welcome";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current || !canCoordinate(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  if (!canManageSystem(current.role, current.email) && current.role !== "coordinator") {
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
    interest?: string;
  };
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const interest = body.interest?.trim() || "ingles";
  if (!name || !email) {
    return NextResponse.json(
      { ok: false, error: "Indica nombre y correo." },
      { status: 400 },
    );
  }

  try {
    const result = await sendLeadWelcomeEmail({ name, email, interest });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[lead-welcome:send]", error);
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
