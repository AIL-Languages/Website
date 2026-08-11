import { NextRequest, NextResponse } from "next/server";
import { visibleDocuments } from "@/lib/documents/access";
import { analyzePdf } from "@/lib/documents/extract";
import { parseRequestedKind } from "@/lib/documents/kinds";
import { listDocuments, saveDocument, toPublicDocument } from "@/lib/documents/store";
import { getCurrentProfile, listProfiles } from "@/lib/auth/profile";
import { createPayment } from "@/lib/ops/payments";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;

function isPdf(bytes: Buffer, name: string, mime: string) {
  const header = bytes.subarray(0, 5).toString("utf8");
  const looksPdf = header.startsWith("%PDF");
  const namedPdf = name.toLowerCase().endsWith(".pdf");
  const mimePdf = mime === "application/pdf" || mime === "application/x-pdf" || mime === "";
  return looksPdf && (namedPdf || mimePdf);
}

export async function GET() {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const documents = visibleDocuments(current, await listDocuments()).map(toPublicDocument);
  return NextResponse.json({ ok: true, documents });
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Selecciona un archivo PDF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "El PDF no puede pesar más de 10 MB." },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (!isPdf(bytes, file.name, file.type)) {
      return NextResponse.json(
        { ok: false, error: "Solo se admiten archivos PDF." },
        { status: 400 },
      );
    }

    const requested = parseRequestedKind(form.get("kind"));
    const notesValue = form.get("notes");
    const notes =
      typeof notesValue === "string" && notesValue.trim()
        ? notesValue.trim().slice(0, 500)
        : undefined;

    const extracted = await analyzePdf(new Uint8Array(bytes), file.name, requested);
    const linkedValue = form.get("linkedUserId");
    let linkedUserId =
      typeof linkedValue === "string" && linkedValue ? linkedValue : undefined;

    const users = await listProfiles();
    const hay = `${extracted.summary} ${notes ?? ""} ${file.name}`.toLowerCase();
    if (!linkedUserId) {
      const match = users.find((user) => {
        if (!user.name || user.name.length < 4) return false;
        if (!hay.includes(user.name.toLowerCase())) return false;
        if (extracted.kind === "pago") return user.role === "student";
        if (extracted.kind === "certificacion") return user.role === "teacher";
        return user.role === "student" || user.role === "teacher";
      });
      linkedUserId = match?.id;
    }

    const document = await saveDocument({
      bytes,
      originalName: file.name,
      mimeType: file.type || "application/pdf",
      kind: extracted.kind,
      notes,
      extracted,
      linkedUserId,
      uploadedBy: current.id,
      uploadedByName: current.name,
      uploadedByEmail: current.email,
      uploadedByRole: current.role,
    });

    if (extracted.kind === "pago") {
      const student =
        users.find((user) => user.id === linkedUserId) ??
        (current.role === "student" || current.role === "company"
          ? current
          : undefined);
      if (student) {
        const amount =
          extracted.fields.find((field) => field.label === "Importe")?.value ||
          "0";
        await createPayment({
          studentId: student.id,
          studentName: student.name,
          concept: notes || "Comprobante PDF",
          amount,
          method:
            extracted.fields.find((field) => field.label === "Banco")?.value ||
            "Transferencia",
          status:
            current.role === "student" || current.role === "company"
              ? "por_verificar"
              : "pagado",
          documentId: document.id,
          notes,
          createdBy: current.id,
          paidAt: new Date().toISOString().slice(0, 10),
        });
      }
    }

    return NextResponse.json({ ok: true, document: toPublicDocument(document) });
  } catch (error) {
    console.error("[documents]", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo analizar el PDF.",
      },
      { status: 500 },
    );
  }
}
