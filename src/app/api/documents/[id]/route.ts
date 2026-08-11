import { NextRequest, NextResponse } from "next/server";
import { canDeleteDocument, canReadDocument } from "@/lib/documents/access";
import { deleteDocument, getDocument, toPublicDocument } from "@/lib/documents/store";
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

  return NextResponse.json({ ok: true, document: toPublicDocument(document) });
}

export async function DELETE(_request: NextRequest, context: Context) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const document = await getDocument(id);
  if (!document) {
    return NextResponse.json({ ok: false, error: "Documento no encontrado." }, { status: 404 });
  }
  if (!canDeleteDocument(current, document)) {
    return NextResponse.json(
      { ok: false, error: "No puedes eliminar este documento." },
      { status: 403 },
    );
  }

  await deleteDocument(id);
  return NextResponse.json({ ok: true });
}
