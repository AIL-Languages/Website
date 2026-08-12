import { NextResponse } from "next/server";
import { requireCmsAdmin } from "@/lib/cms/access";
import { getCmsAuth, hasCmsPassword } from "@/lib/cms/store";
import { isCmsUnlocked } from "@/lib/cms/session";
import { SOLE_ADMIN_EMAIL } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireCmsAdmin();
  if (gate.error || !gate.user) return gate.error!;

  const auth = await getCmsAuth();
  return NextResponse.json({
    ok: true,
    adminEmail: SOLE_ADMIN_EMAIL,
    hasPassword: await hasCmsPassword(),
    unlocked: await isCmsUnlocked(),
    passwordUpdatedAt: auth.passwordUpdatedAt,
  });
}
