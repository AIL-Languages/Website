import { NextRequest, NextResponse } from "next/server";
import { canCoordinate, canManageSystem } from "@/lib/auth/admin";
import { getCurrentProfile } from "@/lib/auth/profile";
import { getPayment, updatePayment, type PaymentStatus } from "@/lib/ops/payments";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  const current = await getCurrentProfile();
  if (
    !current ||
    (!canManageSystem(current.role, current.email) &&
      !canCoordinate(current.role, current.email))
  ) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const { id } = await context.params;
  const existing = await getPayment(id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Pago no encontrado." }, { status: 404 });
  }

  const body = (await request.json()) as Record<string, string>;
  const status = body.status as PaymentStatus | undefined;
  const payment = await updatePayment(id, {
    concept: body.concept || existing.concept,
    amount: body.amount || existing.amount,
    dueDate: body.dueDate || existing.dueDate,
    paidAt:
      status === "pagado"
        ? body.paidAt || existing.paidAt || new Date().toISOString().slice(0, 10)
        : existing.paidAt,
    method: body.method || existing.method,
    status: status || existing.status,
    notes: body.notes ?? existing.notes,
    documentId: body.documentId || existing.documentId,
  });

  return NextResponse.json({ ok: true, payment });
}
