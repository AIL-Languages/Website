import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/profile";
import { loginSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: "Correo o contraseña incorrectos." },
        { status: 401 },
      );
    }

    const profile = await getCurrentProfile();
    return NextResponse.json({ ok: true, user: profile });
  } catch (error) {
    console.error("[auth/login]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo iniciar sesión." },
      { status: 500 },
    );
  }
}
