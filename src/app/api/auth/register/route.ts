import { NextRequest, NextResponse } from "next/server";
import { parseDetails } from "@/lib/academic/details";
import { resolveRole } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/profile";
import { registerSchema } from "@/lib/auth/validation";
import {
  replaceAvailability,
  WEEKDAYS,
  type Weekday,
} from "@/lib/scheduling/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
        },
        { status: 400 },
      );
    }

    const { name, email, password, phone, interest, role: requestedRole, details: rawDetails } =
      parsed.data;
    const role = resolveRole(email, requestedRole);

    // Alta pública no crea profesores: solo tras aprobación de AIL.
    if (role === "teacher") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Para unirte como profesor, completa primero el formulario de aplicación docente. La cuenta de profesor se crea solo tras aprobación de AIL.",
        },
        { status: 403 },
      );
    }

    const details = parseDetails(rawDetails);
    if (details.preferredStartDate && !details.startDate) {
      details.startDate = details.preferredStartDate;
    }
    details.timezone = details.timezone || "America/Chihuahua";
    details.enrollmentStatus = details.enrollmentStatus || "pending";
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone: phone ?? details.contactPhone ?? "",
          interest: interest ?? "",
          role,
          details,
        },
      },
    });

    if (error) {
      const message =
        error.message.toLowerCase().includes("already") ||
        error.message.toLowerCase().includes("registered")
          ? "Ya existe una cuenta con este correo."
          : error.message;
      return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }

    if (data.user && role === "student" && Array.isArray(body.availabilitySlots)) {
      const slots = (body.availabilitySlots as Array<Record<string, string>>)
        .filter(
          (slot) =>
            slot &&
            WEEKDAYS.includes(slot.weekday as Weekday) &&
            slot.availableFrom &&
            slot.availableTo,
        )
        .map((slot) => ({
          weekday: slot.weekday as Weekday,
          availableFrom: slot.availableFrom,
          availableTo: slot.availableTo,
          timezone: slot.timezone || "America/Chihuahua",
        }));
      if (slots.length) {
        await replaceAvailability(data.user.id, "student", slots);
      }
    }

    if (!data.session) {
      return NextResponse.json({
        ok: true,
        needsEmailConfirmation: true,
        message:
          "Cuenta creada. Revisa tu correo para confirmar la cuenta antes de iniciar sesión.",
        user: data.user
          ? { id: data.user.id, email: data.user.email }
          : undefined,
      });
    }

    if (data.user) {
      try {
        const admin = createAdminClient();
        const sync = {
          name,
          phone: phone?.trim() || details.contactPhone || null,
          interest: interest?.trim() || null,
          role,
          details,
        };
        const { error: syncError } = await admin
          .from("profiles")
          .update(sync)
          .eq("id", data.user.id);
        if (syncError && role !== "student" && role !== "admin") {
          await admin
            .from("profiles")
            .update({ ...sync, role: "student" })
            .eq("id", data.user.id);
        }
      } catch (profileError) {
        console.error("[auth/register] profile sync", profileError);
      }
    }

    let profile = await getCurrentProfile();
    if (!profile && data.user) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      profile = await getCurrentProfile();
    }

    return NextResponse.json({
      ok: true,
      user: profile ?? {
        id: data.user!.id,
        name,
        email,
        phone,
        interest,
        role,
        details,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[auth/register]", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo completar el registro.",
      },
      { status: 500 },
    );
  }
}


