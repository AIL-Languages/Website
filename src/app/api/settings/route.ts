import { NextRequest, NextResponse } from "next/server";
import type { PublicProfileRole } from "@/lib/auth/admin";
import { canManageSystem } from "@/lib/auth/admin";
import { getCurrentProfile } from "@/lib/auth/profile";
import { addAdminLog, getSettings, updateSettings } from "@/lib/settings/store";

export const runtime = "nodejs";

const PROFILES: PublicProfileRole[] = [
  "student",
  "teacher",
  "coordinator",
  "company",
];

export async function GET() {
  const current = await getCurrentProfile();
  if (!current || !canManageSystem(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  return NextResponse.json({ ok: true, settings: await getSettings() });
}

export async function PATCH(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current || !canManageSystem(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const enabled = Array.isArray(body.enabledProfiles)
    ? body.enabledProfiles.filter(
        (item): item is PublicProfileRole =>
          typeof item === "string" && PROFILES.includes(item as PublicProfileRole),
      )
    : undefined;

  const bank =
    body.bankTransfer && typeof body.bankTransfer === "object"
      ? (body.bankTransfer as Record<string, string>)
      : null;

  const settings = await updateSettings({
    institutionName: String(body.institutionName ?? ""),
    slogan: String(body.slogan ?? ""),
    email: String(body.email ?? ""),
    phone: String(body.phone ?? ""),
    coordinationPhone: String(body.coordinationPhone ?? ""),
    location: String(body.location ?? ""),
    weeklySmrtHours: Number(body.weeklySmrtHours) || 1,
    maxGroupSize: Number(body.maxGroupSize) || 5,
    classDurationMinutes: Number(body.classDurationMinutes) || 60,
    allowPublicRegistration: Boolean(body.allowPublicRegistration),
    enabledProfiles: enabled,
    classModalities: String(body.classModalities ?? ""),
    classTypes: String(body.classTypes ?? ""),
    timezone: String(body.timezone ?? "America/Chihuahua"),
    notifyPayments: Boolean(body.notifyPayments),
    notifyClasses: Boolean(body.notifyClasses),
    notifySchedule: Boolean(body.notifySchedule),
    notifyAdmin: Boolean(body.notifyAdmin),
    notifyAcademic: Boolean(body.notifyAcademic),
    bankTransfer: bank
      ? {
          institution: String(bank.institution ?? ""),
          beneficiary: String(bank.beneficiary ?? ""),
          clabe: String(bank.clabe ?? ""),
          dimoPhone: String(bank.dimoPhone ?? ""),
          logoSrc: String(bank.logoSrc ?? "/logo-mercadopago.png"),
          logoAlt: String(bank.logoAlt ?? "Mercado Pago"),
        }
      : undefined,
  });

  return NextResponse.json({ ok: true, settings });
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current || !canManageSystem(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const body = (await request.json()) as { title?: string; body?: string };
  if (!body.title?.trim() || !body.body?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Completa título y nota." },
      { status: 400 },
    );
  }

  const entry = await addAdminLog({
    title: body.title.trim(),
    body: body.body.trim(),
    createdBy: current.id,
    createdByName: current.name,
  });

  return NextResponse.json({ ok: true, entry });
}
