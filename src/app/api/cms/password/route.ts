import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsAdmin } from "@/lib/cms/access";
import { hasCmsPassword, setCmsPassword, verifyCmsPassword } from "@/lib/cms/store";
import { clearCmsUnlockCookie } from "@/lib/cms/session";

export const runtime = "nodejs";

const schema = z.object({
  password: z.string().min(10, "Mínimo 10 caracteres."),
  currentPassword: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const gate = await requireCmsAdmin();
  if (gate.error || !gate.user) return gate.error!;

  try {
    const body = schema.parse(await request.json());
    const already = await hasCmsPassword();

    if (already) {
      if (!body.currentPassword) {
        return NextResponse.json(
          { ok: false, error: "Indica la contraseña actual del CMS." },
          { status: 400 },
        );
      }
      const valid = await verifyCmsPassword(body.currentPassword);
      if (!valid) {
        return NextResponse.json(
          { ok: false, error: "La contraseña actual del CMS no es correcta." },
          { status: 401 },
        );
      }
    }

    await setCmsPassword(body.password);
    await clearCmsUnlockCookie();

    return NextResponse.json({
      ok: true,
      message: already
        ? "Contraseña del CMS actualizada. Vuelve a desbloquear el gestor."
        : "Contraseña exclusiva del CMS creada.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo guardar la contraseña del CMS.",
      },
      { status: 400 },
    );
  }
}
