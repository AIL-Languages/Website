import { NextRequest, NextResponse } from "next/server";
import { canManageSystem } from "@/lib/auth/admin";
import { getCurrentProfile } from "@/lib/auth/profile";
import {
  getWelcomeTemplates,
  saveWelcomeTemplate,
} from "@/lib/email/welcome-store";
import {
  isWelcomeRole,
  type WelcomeRole,
  type WelcomeTemplate,
} from "@/lib/email/welcome-types";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentProfile();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Debes iniciar sesión." }, { status: 401 });
  }
  if (user.role !== "coordinator" && !canManageSystem(user.role, user.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  return NextResponse.json({ ok: true, templates: await getWelcomeTemplates() });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentProfile();
  if (!user || !canManageSystem(user.role, user.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const body = (await request.json()) as {
    role?: string;
    template?: Partial<WelcomeTemplate>;
  };

  if (!body.role || !isWelcomeRole(body.role) || !body.template) {
    return NextResponse.json(
      { ok: false, error: "Indica el perfil y la plantilla." },
      { status: 400 },
    );
  }

  const template = await saveWelcomeTemplate(body.role as WelcomeRole, body.template);
  return NextResponse.json({ ok: true, role: body.role, template });
}
