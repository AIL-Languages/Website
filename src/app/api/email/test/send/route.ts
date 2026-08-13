import { NextRequest, NextResponse } from "next/server";
import { canManageSystem } from "@/lib/auth/admin";
import { getCurrentProfile } from "@/lib/auth/profile";
import { nl2br } from "@/lib/email/escape";
import { isResendConfigured, sendEmail } from "@/lib/email/resend";
import { brandEmailHtml } from "@/lib/email/shell";
import { clientKeyFrom, isRateLimited } from "@/lib/leads/rate-limit";
import { site } from "@/lib/site";

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json(
      { ok: false, error: "Inicia sesión como administradora para enviar una prueba." },
      { status: 401 },
    );
  }
  if (!canManageSystem(current.role, current.email)) {
    return NextResponse.json(
      { ok: false, error: "Solo la administradora puede enviar correos de prueba." },
      { status: 403 },
    );
  }

  if (!isResendConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Falta configurar RESEND_API_KEY o EMAIL_API_KEY." },
      { status: 503 },
    );
  }

  if (isRateLimited(`test-email:${clientKeyFrom(request)}`)) {
    return NextResponse.json(
      { ok: false, error: "Demasiados envíos de prueba. Espera unos minutos." },
      { status: 429 },
    );
  }

  const body = (await request.json()) as {
    to?: string;
    subject?: string;
    message?: string;
  };

  const to = body.to?.trim().replace(/\s+/g, "").toLowerCase() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!to || !isValidEmail(to)) {
    return NextResponse.json(
      { ok: false, error: "Ingresa un correo de destino válido." },
      { status: 400 },
    );
  }
  if (!subject) {
    return NextResponse.json(
      { ok: false, error: "Escribe el asunto del correo." },
      { status: 400 },
    );
  }
  if (!message) {
    return NextResponse.json(
      { ok: false, error: "Escribe el mensaje del correo." },
      { status: 400 },
    );
  }
  if (subject.length > 180 || message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "El asunto o el mensaje son demasiado largos." },
      { status: 400 },
    );
  }

  try {
    const result = await sendEmail({
      to,
      subject,
      html: brandEmailHtml(subject, `<p style="margin:0;">${nl2br(message)}</p>`),
      text: message,
      replyTo: site.email,
    });
    return NextResponse.json({
      ok: true,
      id: result?.id ?? null,
    });
  } catch (error) {
    console.error("[email:test]", error);
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
