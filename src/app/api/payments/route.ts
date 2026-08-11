import { NextRequest, NextResponse } from "next/server";
import { canCoordinate, canManageSystem } from "@/lib/auth/admin";
import { getCurrentProfile, listProfiles } from "@/lib/auth/profile";
import { createPayment, listPayments } from "@/lib/ops/payments";

export const runtime = "nodejs";

export async function GET() {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const payments = await listPayments();
  if (canManageSystem(current.role, current.email) || canCoordinate(current.role, current.email)) {
    return NextResponse.json({ ok: true, payments });
  }
  if (current.role === "company") {
    const students = (await listProfiles()).filter(
      (user) =>
        user.role === "student" &&
        (user.details.companyId === current.id || user.createdBy === current.id),
    );
    const ids = new Set(students.map((item) => item.id));
    return NextResponse.json({
      ok: true,
      payments: payments.filter((item) => ids.has(item.studentId)),
    });
  }
  return NextResponse.json({
    ok: true,
    payments: payments.filter((item) => item.studentId === current.id),
  });
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, string>;
  const isStaff =
    canManageSystem(current.role, current.email) ||
    canCoordinate(current.role, current.email);

  const studentId = isStaff ? body.studentId : current.id;
  const studentName = isStaff ? body.studentName || current.name : current.name;
  if (!studentId || !body.concept || !body.amount) {
    return NextResponse.json(
      { ok: false, error: "Completa alumno, concepto y monto." },
      { status: 400 },
    );
  }

  const payment = await createPayment({
    studentId,
    studentName,
    concept: body.concept,
    amount: body.amount,
    dueDate: body.dueDate || undefined,
    paidAt: body.paidAt || undefined,
    method: body.method || undefined,
    status: isStaff ? (body.status as "pagado" | "pendiente" | "por_verificar") || "pendiente" : "por_verificar",
    documentId: body.documentId || undefined,
    notes: body.notes || undefined,
    createdBy: current.id,
  });

  return NextResponse.json({ ok: true, payment });
}
