import { NextRequest, NextResponse } from "next/server";
import { parseDetails } from "@/lib/academic/details";
import {
  canCoordinate,
  canCreateRole,
  canManageSystem,
  isSoleAdminEmail,
  resolveRole,
} from "@/lib/auth/admin";
import { getCurrentProfile, listProfiles } from "@/lib/auth/profile";
import { createUserSchema } from "@/lib/auth/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { type Profile, toPublicUser } from "@/lib/auth/types";
import { onStudentEnrolled } from "@/lib/email/send-student-welcome";

export const runtime = "nodejs";

export async function GET() {
  const current = await getCurrentProfile();
  if (!current || !canCoordinate(current.role, current.email)) {
    if (current?.role !== "company") {
      return NextResponse.json(
        { ok: false, error: "No autorizado." },
        { status: 403 },
      );
    }
  }

  const users = await listProfiles();
  const filtered =
    current?.role === "company"
      ? users.filter(
          (user) =>
            user.role === "student" &&
            (user.details.companyId === current.id ||
              user.createdBy === current.id ||
              Boolean(
                current.details.companyLegalName &&
                  user.details.companyName === current.details.companyLegalName,
              )),
        )
      : current && canManageSystem(current.role, current.email)
        ? users
        : users.filter(
            (user) =>
              user.role === "student" ||
              user.role === "teacher" ||
              user.role === "company",
          );

  return NextResponse.json({ ok: true, users: filtered });
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json(
      { ok: false, error: "No autorizado." },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
        },
        { status: 400 },
      );
    }

    const {
      name,
      email,
      password,
      phone,
      interest,
      role: requestedRole,
      details: rawDetails,
    } = parsed.data;
    const role = resolveRole(email, requestedRole);

    if (!canCreateRole(current.role, role, current.email)) {
      return NextResponse.json(
        { ok: false, error: "No puedes crear este tipo de perfil." },
        { status: 403 },
      );
    }

    if (isSoleAdminEmail(email)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "La cuenta de administradora única se crea al registrarse con ainman.languages@gmail.com.",
        },
        { status: 400 },
      );
    }

    const details = parseDetails(rawDetails);
    if (current.role === "company") {
      details.companyId = current.id;
      details.companyName =
        current.details.companyLegalName || current.name;
    }
    if (role === "student") {
      details.enrollmentStatus = "active";
    }

    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        phone: phone ?? "",
        interest: interest ?? "",
        role,
        details,
      },
    });

    if (error || !data.user) {
      const message =
        error?.message.toLowerCase().includes("already") ||
        error?.message.toLowerCase().includes("registered")
          ? "Ya existe una cuenta con este correo."
          : error?.message || "No se pudo crear el usuario.";
      return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }

    const profilePayload = {
      id: data.user.id,
      name,
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      interest: interest?.trim() || null,
      role,
      details,
      created_by: current.id,
    };

    let { data: profile, error: profileError } = await admin
      .from("profiles")
      .upsert(profilePayload)
      .select("*")
      .single();

    if (profileError && role !== "student") {
      ({ data: profile, error: profileError } = await admin
        .from("profiles")
        .upsert({ ...profilePayload, role: "student" })
        .select("*")
        .single());
    }

    if (profileError || !profile) {
      return NextResponse.json(
        { ok: false, error: profileError?.message || "Usuario auth creado, pero falló el perfil." },
        { status: 500 },
      );
    }

    let welcome: { studentEmail?: string } | undefined;
    if (role === "student") {
      welcome = await onStudentEnrolled({
        studentId: data.user.id,
        name,
        email: email.trim().toLowerCase(),
        role,
        details,
      });
    }

    return NextResponse.json({
      ok: true,
      user: toPublicUser({ ...(profile as Profile), role, details }),
      studentWelcomeEmail: welcome?.studentEmail,
    });
  } catch (error) {
    console.error("[users]", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "No se pudo crear el usuario.",
      },
      { status: 500 },
    );
  }
}
