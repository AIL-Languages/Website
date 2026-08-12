import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsAdmin } from "@/lib/cms/access";
import { hasCmsPassword, verifyCmsPassword } from "@/lib/cms/store";
import { clearCmsUnlockCookie, setCmsUnlockCookie } from "@/lib/cms/session";
import { SOLE_ADMIN_EMAIL } from "@/lib/auth/admin";

export const runtime = "nodejs";

const schema = z.object({
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const gate = await requireCmsAdmin();
  if (gate.error || !gate.user) return gate.error!;

  if (!(await hasCmsPassword())) {
    return NextResponse.json(
      { ok: false, error: "Primero crea la contraseña exclusiva del CMS." },
      { status: 400 },
    );
  }

  try {
    const body = schema.parse(await request.json());
    const valid = await verifyCmsPassword(body.password);
    if (!valid) {
      return NextResponse.json(
        { ok: false, error: "Contraseña del CMS incorrecta." },
        { status: 401 },
      );
    }

    await setCmsUnlockCookie(SOLE_ADMIN_EMAIL);
    return NextResponse.json({ ok: true, unlocked: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "No se pudo desbloquear el CMS.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  const gate = await requireCmsAdmin();
  if (gate.error || !gate.user) return gate.error!;
  await clearCmsUnlockCookie();
  return NextResponse.json({ ok: true, unlocked: false });
}
