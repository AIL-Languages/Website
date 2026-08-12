import { NextResponse } from "next/server";
import { canManageSystem } from "@/lib/auth/admin";
import { getCurrentProfile } from "@/lib/auth/profile";
import { hasCmsPassword } from "@/lib/cms/store";
import { isCmsUnlocked } from "@/lib/cms/session";

export async function requireCmsAdmin() {
  const user = await getCurrentProfile();
  if (!user || !canManageSystem(user.role, user.email)) {
    return {
      user: null,
      error: NextResponse.json(
        { ok: false, error: "Solo la administradora AIL puede gestionar el CMS." },
        { status: 403 },
      ),
    };
  }
  return { user, error: null };
}

export async function requireCmsEditor() {
  const gate = await requireCmsAdmin();
  if (gate.error || !gate.user) return gate;

  const configured = await hasCmsPassword();
  if (!configured) {
    return {
      user: gate.user,
      error: NextResponse.json(
        {
          ok: false,
          error: "Primero configura la contraseña exclusiva del CMS.",
          needsPasswordSetup: true,
        },
        { status: 403 },
      ),
    };
  }

  if (!(await isCmsUnlocked())) {
    return {
      user: gate.user,
      error: NextResponse.json(
        {
          ok: false,
          error: "Desbloquea el CMS con tu contraseña exclusiva.",
          needsUnlock: true,
        },
        { status: 403 },
      ),
    };
  }

  return { user: gate.user, error: null };
}
