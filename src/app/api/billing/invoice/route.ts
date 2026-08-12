import { NextRequest, NextResponse } from "next/server";
import { canManageSystem } from "@/lib/auth/admin";
import { getCurrentProfile, listProfiles } from "@/lib/auth/profile";
import {
  CFDI_USES,
  TAX_REGIMES,
  createInvoiceRequest,
  createNotification,
  getPaymentMethods,
  listInvoiceRequests,
  saveBillingFile,
} from "@/lib/billing/store";
import { getPayment, updatePayment } from "@/lib/ops/payments";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;

export async function GET() {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const methods = await getPaymentMethods();
  if (canManageSystem(current.role, current.email)) {
    return NextResponse.json({
      ok: true,
      methods,
      requests: await listInvoiceRequests(),
      taxRegimes: TAX_REGIMES,
      cfdiUses: CFDI_USES,
    });
  }

  return NextResponse.json({
    ok: true,
    methods,
    requests: await listInvoiceRequests(current.id),
    taxRegimes: TAX_REGIMES,
    cfdiUses: CFDI_USES,
  });
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  if (
    current.role !== "student" &&
    current.role !== "company" &&
    !canManageSystem(current.role, current.email)
  ) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  try {
    const form = await request.formData();
    const legalName = String(form.get("legalName") ?? "").trim();
    const rfc = String(form.get("rfc") ?? "").trim().toUpperCase();
    const postalCode = String(form.get("postalCode") ?? "").trim();
    const taxRegime = String(form.get("taxRegime") ?? "").trim();
    const cfdiUse = String(form.get("cfdiUse") ?? "").trim();
    const invoiceEmail = String(form.get("invoiceEmail") ?? "").trim();
    const paymentDate = String(form.get("paymentDate") ?? "").trim();
    const amount = String(form.get("amount") ?? "").trim();
    const paymentId = String(form.get("paymentId") ?? "").trim() || undefined;
    const notes = String(form.get("notes") ?? "").trim() || undefined;
    const confirmed = form.get("confirmed") === "on" || form.get("confirmed") === "true";

    if (
      !legalName ||
      !rfc ||
      !postalCode ||
      !taxRegime ||
      !cfdiUse ||
      !invoiceEmail ||
      !paymentDate ||
      !amount ||
      !confirmed
    ) {
      return NextResponse.json(
        { ok: false, error: "Completa los datos fiscales y confirma que son correctos." },
        { status: 400 },
      );
    }

    let paymentConcept: string | undefined;
    if (paymentId) {
      const payment = await getPayment(paymentId);
      if (
        payment &&
        (payment.studentId === current.id || canManageSystem(current.role, current.email))
      ) {
        paymentConcept = payment.concept;
      }
    }

    let csfStoredName: string | undefined;
    let csfOriginalName: string | undefined;
    const csf = form.get("csf");
    if (csf instanceof File && csf.size > 0) {
      if (csf.size > MAX_BYTES) {
        return NextResponse.json(
          { ok: false, error: "La CSF no puede pesar más de 8 MB." },
          { status: 400 },
        );
      }
      const bytes = Buffer.from(await csf.arrayBuffer());
      const saved = await saveBillingFile(bytes, csf.name, "csf");
      csfStoredName = saved.storedName;
      csfOriginalName = saved.originalName;
    }

    const requestItem = await createInvoiceRequest({
      userId: current.id,
      userName: current.name,
      userEmail: current.email,
      userRole: current.role,
      legalName,
      rfc,
      postalCode,
      taxRegime,
      cfdiUse,
      invoiceEmail,
      paymentId,
      paymentConcept,
      paymentDate,
      amount,
      csfStoredName,
      csfOriginalName,
      notes,
      scope: current.role === "company" ? "company" : "individual",
    });

    if (paymentId) {
      await updatePayment(paymentId, {
        invoiceStatus: "solicitada",
        invoiceRequestId: requestItem.id,
      });
    }

    const admins = (await listProfiles()).filter((item) => item.role === "admin");
    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        title: "Nueva solicitud de factura",
        body: `${current.name} solicitó factura por $${amount}${paymentConcept ? ` · ${paymentConcept}` : ""}.`,
        href: "/dashboard/pagos/facturacion",
      });
    }

    await createNotification({
      userId: current.id,
      title: "Solicitud de factura recibida",
      body: "Revisaremos la información proporcionada para procesar tu factura.",
      href: "/dashboard/pagos",
    });

    return NextResponse.json({ ok: true, request: requestItem });
  } catch (error) {
    console.error("[billing/invoice]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo registrar la solicitud." },
      { status: 500 },
    );
  }
}
