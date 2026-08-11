import { NextRequest, NextResponse } from "next/server";
import { parseDetails } from "@/lib/academic/details";
import { updateProfileSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Inicia sesión para modificar tus datos." },
        { status: 401 },
      );
    }

    const parsed = updateProfileSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
        },
        { status: 400 },
      );
    }

    const name = parsed.data.name;
    const phone = parsed.data.phone?.trim() || null;
    const interest = parsed.data.interest?.trim() || null;
    const details = parseDetails(parsed.data.details);

    const { error } = await supabase
      .from("profiles")
      .update({ name, phone, interest, details })
      .eq("id", user.id);

    if (error) {
      const fallback = await supabase
        .from("profiles")
        .update({ name, phone, interest })
        .eq("id", user.id);
      if (fallback.error) {
        console.error("[profile]", fallback.error);
        return NextResponse.json(
          { ok: false, error: "No se pudieron guardar los cambios." },
          { status: 500 },
        );
      }
    }

    await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        name,
        phone: phone ?? "",
        interest: interest ?? "",
        details,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[profile]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudieron guardar los cambios." },
      { status: 500 },
    );
  }
}
