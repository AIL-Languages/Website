import { NextRequest, NextResponse } from "next/server";
import {
  inquiryFromLeadInput,
  sendContactInquiryEmail,
} from "@/lib/email/contact";
import { leadFlagsFromRow } from "@/lib/email/journey-store";
import { onLeadCreated } from "@/lib/email/send-lead-welcome";
import { maskEmail } from "@/lib/leads/mask";
import { clientKeyFrom, isRateLimited } from "@/lib/leads/rate-limit";
import { createLead } from "@/lib/leads/store";
import {
  isHoneypotFilled,
  parseLeadBody,
  toLeadInput,
} from "@/lib/leads/validate";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(clientKeyFrom(request))) {
      return NextResponse.json(
        { ok: false, error: "Espera un momento antes de enviar otra solicitud." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = parseLeadBody(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Completa los campos obligatorios.",
        },
        { status: 400 },
      );
    }

    if (isHoneypotFilled(parsed.data)) {
      return NextResponse.json({
        ok: true,
        saved: true,
        welcomeEmailSent: false,
        maskedEmail: maskEmail(String(parsed.data.email)),
      });
    }

    const inquiry = toLeadInput(parsed.data);
    const created = await createLead(inquiry);

    const welcome = await onLeadCreated({
      lead: leadFlagsFromRow(created.row),
      name: inquiry.name,
      email: inquiry.email,
      interest: inquiry.interest,
    });

    if (!created.record.duplicate) {
      try {
        await sendContactInquiryEmail(inquiryFromLeadInput(inquiry), created.record.id);
      } catch (error) {
        console.error("[contact:notify]", error);
      }
    }

    return NextResponse.json({
      ok: true,
      saved: true,
      welcomeEmailSent: welcome.leadEmail === "sent",
      maskedEmail: maskEmail(inquiry.email),
    });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo procesar la solicitud." },
      { status: 500 },
    );
  }
}
