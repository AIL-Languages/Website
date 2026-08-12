import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { canManageSystem } from "@/lib/auth/admin";
import { getCurrentProfile } from "@/lib/auth/profile";
import { billingFilePath, getInvoiceRequest } from "@/lib/billing/store";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const item = await getInvoiceRequest(id);
  if (!item) {
    return NextResponse.json({ ok: false, error: "Solicitud no encontrada." }, { status: 404 });
  }
  if (item.userId !== current.id && !canManageSystem(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const kind = request.nextUrl.searchParams.get("file") || "pdf";
  const stored =
    kind === "xml"
      ? item.invoiceXmlStoredName
      : kind === "csf"
        ? item.csfStoredName
        : item.invoicePdfStoredName;
  const original =
    kind === "xml"
      ? item.invoiceXmlOriginalName
      : kind === "csf"
        ? item.csfOriginalName
        : item.invoicePdfOriginalName;

  if (!stored) {
    return NextResponse.json({ ok: false, error: "Archivo no disponible." }, { status: 404 });
  }

  try {
    const bytes = await readFile(billingFilePath(stored));
    const lower = (original || stored).toLowerCase();
    const mime =
      kind === "xml" || lower.endsWith(".xml")
        ? "application/xml"
        : lower.endsWith(".png")
          ? "image/png"
          : lower.endsWith(".jpg") || lower.endsWith(".jpeg")
            ? "image/jpeg"
            : "application/pdf";
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(original || stored)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Archivo no encontrado." }, { status: 404 });
  }
}
