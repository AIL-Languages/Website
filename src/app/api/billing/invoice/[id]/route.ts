import { NextRequest, NextResponse } from "next/server";
import { canManageSystem } from "@/lib/auth/admin";
import { getCurrentProfile } from "@/lib/auth/profile";
import {
  createNotification,
  getInvoiceRequest,
  invoiceUserStatusFromAdmin,
  updateInvoiceRequest,
  saveBillingFile,
  type InvoiceAdminStatus,
  INVOICE_ADMIN_STATUSES,
} from "@/lib/billing/store";
import { updatePayment } from "@/lib/ops/payments";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };
const MAX_BYTES = 8 * 1024 * 1024;

export async function GET(_request: NextRequest, context: Context) {
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
  return NextResponse.json({ ok: true, request: item });
}

export async function PATCH(request: NextRequest, context: Context) {
  const current = await getCurrentProfile();
  if (!current || !canManageSystem(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const { id } = await context.params;
  const existing = await getInvoiceRequest(id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Solicitud no encontrada." }, { status: 404 });
  }

  const contentType = request.headers.get("content-type") || "";
  let status = existing.status;
  let invoicePdfStoredName = existing.invoicePdfStoredName;
  let invoicePdfOriginalName = existing.invoicePdfOriginalName;
  let invoiceXmlStoredName = existing.invoiceXmlStoredName;
  let invoiceXmlOriginalName = existing.invoiceXmlOriginalName;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const nextStatus = String(form.get("status") ?? "");
    if (INVOICE_ADMIN_STATUSES.includes(nextStatus as InvoiceAdminStatus)) {
      status = nextStatus as InvoiceAdminStatus;
    }
    const pdf = form.get("pdf");
    if (pdf instanceof File && pdf.size > 0) {
      if (pdf.size > MAX_BYTES) {
        return NextResponse.json({ ok: false, error: "PDF demasiado grande." }, { status: 400 });
      }
      const saved = await saveBillingFile(
        Buffer.from(await pdf.arrayBuffer()),
        pdf.name,
        "invoice-pdf",
      );
      invoicePdfStoredName = saved.storedName;
      invoicePdfOriginalName = saved.originalName;
    }
    const xml = form.get("xml");
    if (xml instanceof File && xml.size > 0) {
      if (xml.size > MAX_BYTES) {
        return NextResponse.json({ ok: false, error: "XML demasiado grande." }, { status: 400 });
      }
      const saved = await saveBillingFile(
        Buffer.from(await xml.arrayBuffer()),
        xml.name,
        "invoice-xml",
      );
      invoiceXmlStoredName = saved.storedName;
      invoiceXmlOriginalName = saved.originalName;
    }
  } else {
    const body = (await request.json()) as { status?: InvoiceAdminStatus };
    if (body.status && INVOICE_ADMIN_STATUSES.includes(body.status)) {
      status = body.status;
    }
  }

  if (
    status === "facturada" &&
    (!invoicePdfStoredName || !invoiceXmlStoredName)
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Para marcar como facturada, carga el PDF y el XML de la factura.",
      },
      { status: 400 },
    );
  }

  const updated = await updateInvoiceRequest(id, {
    status,
    invoicePdfStoredName,
    invoicePdfOriginalName,
    invoiceXmlStoredName,
    invoiceXmlOriginalName,
  });

  if (existing.paymentId) {
    await updatePayment(existing.paymentId, {
      invoiceStatus: invoiceUserStatusFromAdmin(status),
      invoiceRequestId: existing.id,
    });
  }

  if (status === "facturada" && existing.status !== "facturada") {
    await createNotification({
      userId: existing.userId,
      title: "Tu factura está disponible",
      body: "Ya puedes consultar y descargar los archivos correspondientes desde Pagos y facturación.",
      href: "/dashboard/pagos",
    });
  }

  return NextResponse.json({ ok: true, request: updated });
}
