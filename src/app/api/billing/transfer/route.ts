import { NextResponse } from "next/server";
import { canViewBankTransferDetails } from "@/lib/billing/access";
import { resolveBankTransfer } from "@/lib/billing/transfer";
import { getCurrentProfile } from "@/lib/auth/profile";
import { getSettings } from "@/lib/settings/store";

export const runtime = "nodejs";

/**
 * Datos bancarios sensibles — solo alumno, empresa y admin.
 * Nunca exponer desde rutas públicas.
 */
export async function GET() {
  const user = await getCurrentProfile();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Debes iniciar sesión." },
      { status: 401 },
    );
  }

  if (!canViewBankTransferDetails(user.role, user.email)) {
    return NextResponse.json(
      { ok: false, error: "No tienes acceso a esta sección." },
      { status: 403 },
    );
  }

  const settings = await getSettings();
  const details = resolveBankTransfer(settings);

  return NextResponse.json({ ok: true, details });
}
