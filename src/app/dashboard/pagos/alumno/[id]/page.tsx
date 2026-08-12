import { notFound } from "next/navigation";
import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { PaymentsBoard } from "@/components/dashboard/PaymentsBoard";
import {
  getProfileById,
  requireCoordinatorAccess,
} from "@/lib/auth/profile";
import { listPayments } from "@/lib/ops/payments";

export const metadata = { title: "Historial de pagos" };

type Props = { params: Promise<{ id: string }> };

export default async function StudentPaymentsPage({ params }: Props) {
  await requireCoordinatorAccess();
  const { id } = await params;
  const student = await getProfileById(id);
  if (!student || student.role !== "student") notFound();
  const payments = (await listPayments()).filter((item) => item.studentId === id);

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Historial de pagos"
        title={student.name}
        backHref="/dashboard/pagos"
        backLabel="← Pagos y facturación"
        text="Registrar pago, adjuntar comprobante, marcar como pagado y dar seguimiento a facturación."
      />
      <PaymentsBoard payments={payments} students={[student]} canManage />
    </main>
  );
}
