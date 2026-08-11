import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { canReadDocument } from "@/lib/documents/access";
import { filePathFor, getDocument } from "@/lib/documents/store";
import { getCurrentProfile } from "@/lib/auth/profile";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const document = await getDocument(id);
  if (!document || !canReadDocument(current, document)) {
    return NextResponse.json({ ok: false, error: "Documento no encontrado." }, { status: 404 });
  }

  try {
    const bytes = await readFile(filePathFor(document));
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(document.originalName)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se encontró el archivo PDF." },
      { status: 404 },
    );
  }
}
