import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  goals?: string;
  availability?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactBody;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const interest = body.interest?.trim() ?? "";
    const goals = body.goals?.trim() ?? "";
    const availability = body.availability?.trim() ?? "";

    if (!name || !email || !interest || !goals) {
      return NextResponse.json(
        { ok: false, error: "Completa los campos obligatorios." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Ingresa un correo válido." },
        { status: 400 },
      );
    }

    // This endpoint is server-only. Use the service-role client so contact
    // submissions do not depend on an anonymous RLS insert policy.
    const supabase = createAdminClient();
    const { error } = await supabase.from("leads").insert({
      nombre: name,
      email,
      telefono: phone,
      servicios: [interest],
      respuestas: {
        objetivos: goals,
        disponibilidad: availability || null,
        fuente: "website-contact",
      },
      propuesta: "",
    });

    if (error) {
      console.error("[contact]", error);
      return NextResponse.json(
        { ok: false, error: "No se pudo procesar la solicitud." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo procesar la solicitud." },
      { status: 500 },
    );
  }
}
