import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { canCoordinate, canManageSystem } from "@/lib/auth/admin";
import { getCurrentProfile, listProfiles } from "@/lib/auth/profile";
import {
  billingFilePath,
  createNotification,
  saveBillingFile,
  type ReceiptStatus,
} from "@/lib/billing/store";
import {
  createPayment,
  getPayment,
  listPayments,
  updatePayment,
} from "@/lib/ops/payments";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

function allowedFile(name: string, mime: string) {
  const lower = name.toLowerCase();
  return (
    ALLOWED.includes(mime) ||
    lower.endsWith(".pdf") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png")
  );
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  if (
    current.role !== "student" &&
    current.role !== "company" &&
    !canCoordinate(current.role, current.email)
  ) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { ok: false, error: "Selecciona un comprobante (PDF, JPG o PNG)." },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "El archivo no puede pesar más de 8 MB." },
        { status: 400 },
      );
    }
    if (!allowedFile(file.name, file.type)) {
      return NextResponse.json(
        { ok: false, error: "Formatos permitidos: PDF, JPG, JPEG y PNG." },
        { status: 400 },
      );
    }

    const notes = String(form.get("notes") ?? "").trim() || undefined;
    const paymentId = String(form.get("paymentId") ?? "").trim() || undefined;
    const concept = String(form.get("concept") ?? "").trim() || "Comprobante de pago";
    const amount = String(form.get("amount") ?? "").trim() || "0";
    const paidAt =
      String(form.get("paidAt") ?? "").trim() ||
      new Date().toISOString().slice(0, 10);
    const bytes = Buffer.from(await file.arrayBuffer());
    const saved = await saveBillingFile(bytes, file.name, "receipt");

    let payment = paymentId ? await getPayment(paymentId) : null;
    if (payment && payment.studentId !== current.id && !canCoordinate(current.role, current.email)) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
    }

    if (payment) {
      payment = await updatePayment(payment.id, {
        receiptStoredName: saved.storedName,
        receiptOriginalName: saved.originalName,
        receiptMimeType: file.type || "application/octet-stream",
        receiptStatus: "pendiente_revision",
        receiptNotes: notes,
        receiptSubmittedAt: new Date().toISOString(),
        status: "por_verificar",
        notes: notes || payment.notes,
        paidAt,
        concept: concept || payment.concept,
        amount: amount !== "0" ? amount : payment.amount,
        method: payment.method || "mercadopago",
      });
    } else {
      payment = await createPayment({
        studentId: current.id,
        studentName: current.name,
        concept,
        amount,
        method: "mercadopago",
        status: "por_verificar",
        notes,
        createdBy: current.id,
        paidAt,
        receiptStoredName: saved.storedName,
        receiptOriginalName: saved.originalName,
        receiptMimeType: file.type || "application/octet-stream",
        receiptStatus: "pendiente_revision",
        receiptNotes: notes,
        receiptSubmittedAt: new Date().toISOString(),
        invoiceStatus: "no_solicitada",
        scope: current.role === "company" ? "company" : "individual",
        companyId: current.role === "company" ? current.id : undefined,
      });
    }

    const admins = (await listProfiles()).filter(
      (item) => item.role === "admin" || canManageSystem(item.role, item.email),
    );
    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        title: "Comprobante por verificar",
        body: `${current.name} subió un comprobante de “${payment?.concept || concept}”.`,
        href: "/dashboard/pagos",
      });
    }

    return NextResponse.json({ ok: true, payment });
  } catch (error) {
    console.error("[billing/receipt]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo subir el comprobante." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current || !canCoordinate(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  const body = (await request.json()) as {
    paymentId?: string;
    receiptStatus?: ReceiptStatus;
  };
  if (!body.paymentId || !body.receiptStatus) {
    return NextResponse.json({ ok: false, error: "Datos incompletos." }, { status: 400 });
  }
  const payment = await getPayment(body.paymentId);
  if (!payment) {
    return NextResponse.json({ ok: false, error: "Pago no encontrado." }, { status: 404 });
  }

  const updated = await updatePayment(payment.id, {
    receiptStatus: body.receiptStatus,
    status:
      body.receiptStatus === "confirmado"
        ? "pagado"
        : body.receiptStatus === "requiere_aclaracion"
          ? "por_verificar"
          : payment.status,
    paidAt:
      body.receiptStatus === "confirmado"
        ? payment.paidAt || new Date().toISOString().slice(0, 10)
        : payment.paidAt,
  });

  if (body.receiptStatus === "confirmado") {
    await createNotification({
      userId: payment.studentId,
      title: "Pago confirmado",
      body: `Tu comprobante de “${payment.concept}” fue confirmado.`,
      href: "/dashboard/pagos",
    });
  }
  if (body.receiptStatus === "requiere_aclaracion") {
    await createNotification({
      userId: payment.studentId,
      title: "Comprobante requiere aclaración",
      body: `Revisa tu comprobante de “${payment.concept}” en Pagos y facturación.`,
      href: "/dashboard/pagos",
    });
  }

  return NextResponse.json({ ok: true, payment: updated });
}

export async function GET(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  const paymentId = request.nextUrl.searchParams.get("paymentId");
  if (!paymentId) {
    return NextResponse.json({ ok: false, error: "Falta paymentId." }, { status: 400 });
  }
  const payment = (await listPayments()).find((item) => item.id === paymentId);
  if (!payment || !payment.receiptStoredName) {
    return NextResponse.json({ ok: false, error: "Comprobante no encontrado." }, { status: 404 });
  }
  if (
    payment.studentId !== current.id &&
    !canCoordinate(current.role, current.email)
  ) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  try {
    const bytes = await readFile(billingFilePath(payment.receiptStoredName));
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": payment.receiptMimeType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${encodeURIComponent(payment.receiptOriginalName || "comprobante")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Archivo no encontrado." }, { status: 404 });
  }
}
