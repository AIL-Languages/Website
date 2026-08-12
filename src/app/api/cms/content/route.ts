import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsEditor } from "@/lib/cms/access";
import { getCmsContent, saveCmsContent } from "@/lib/cms/store";

export const runtime = "nodejs";

const contentSchema = z.object({
  hero: z.object({
    headline: z.string().min(3),
    subheadline: z.string().min(3),
    primaryCtaLabel: z.string().min(2),
    primaryCtaHref: z.string().min(1),
    secondaryCtaLabel: z.string().min(2),
    secondaryCtaHref: z.string().min(1),
    advantages: z.array(z.string().min(2)).min(1).max(8),
  }),
  about: z.object({
    eyebrow: z.string().min(2),
    title: z.string().min(3),
    body: z.string().min(10),
  }),
  programs: z.object({
    eyebrow: z.string().min(2),
    title: z.string().min(3),
    certificationsEyebrow: z.string().min(2),
    certificationsTitle: z.string().min(3),
    certificationsBody: z.string().min(10),
    certificationsCta: z.string().min(2),
  }),
  contact: z.object({
    eyebrow: z.string().min(2),
    title: z.string().min(3),
    body: z.string().min(10),
    bullets: z.array(z.string().min(2)).min(1).max(8),
    socialTitle: z.string().min(2),
    socialBody: z.string().min(5),
  }),
});

export async function GET() {
  const gate = await requireCmsEditor();
  if (gate.error || !gate.user) return gate.error!;
  const content = await getCmsContent();
  return NextResponse.json({ ok: true, content });
}

export async function PUT(request: NextRequest) {
  const gate = await requireCmsEditor();
  if (gate.error || !gate.user) return gate.error!;

  try {
    const body = contentSchema.parse(await request.json());
    const current = await getCmsContent();
    const saved = await saveCmsContent(
      {
        ...current,
        ...body,
      },
      gate.user.email,
    );
    return NextResponse.json({ ok: true, content: saved });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo guardar el contenido del CMS.",
      },
      { status: 400 },
    );
  }
}
