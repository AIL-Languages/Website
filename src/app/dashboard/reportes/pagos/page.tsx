import { redirect } from "next/navigation";
import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { requireProfile } from "@/lib/auth/profile";
import { listPayments } from "@/lib/ops/payments";
import { canViewPaymentsReport, visibleStudentsFor } from "@/lib/reports/access";
import { listProfiles } from "@/lib/auth/profile";

export const metadata = { title: "Reporte de pagos" };

export default async function PaymentsReportPage() {
  const user = await requireProfile();
  if (!canViewPaymentsReport(user)) redirect("/dashboard/reportes");
  const payments = await listPayments();
  const students = await visibleStudentsFor(user, await listProfiles());
  const ids = new Set(students.map((item) => item.id));
  const visible =
    user.role === "student"
      ? payments.filter((item) => item.studentId === user.id)
      : payments.filter((item) => ids.has(item.studentId));

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Reportes"
        title="Reporte de pagos"
        text="Pagos realizados, pendientes, fechas, conceptos y comprobantes. Este PDF sale del sistema; los archivos subidos viven en Documentos PDF."
        backHref="/dashboard/reportes"
        backLabel="← Reportes"
      />
      <a
        href="/api/reports/export?kind=pagos"
        className="inline-flex rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep"
      >
        Descargar reporte PDF
      </a>
      <div className="overflow-hidden rounded-[1.75rem] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-mist text-muted">
            <tr>
              <th className="px-5 py-3">Alumno</th>
              <th className="px-5 py-3">Concepto</th>
              <th className="px-5 py-3">Monto</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id} className="border-t border-navy/8">
                <td className="px-5 py-3">{item.studentName}</td>
                <td className="px-5 py-3">{item.concept}</td>
                <td className="px-5 py-3">${item.amount}</td>
                <td className="px-5 py-3">{item.paidAt || item.dueDate || "—"}</td>
                <td className="px-5 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
