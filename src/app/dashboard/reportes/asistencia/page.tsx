import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { AttendanceBoard } from "@/components/dashboard/AttendanceBoard";
import { canCaptureAcademic } from "@/lib/reports/access";
import { reportsContext } from "@/lib/reports/page-data";
import { requireProfile } from "@/lib/auth/profile";

export const metadata = { title: "Asistencia" };

export default async function AttendanceReportPage() {
  const user = await requireProfile();
  const { students, attendance } = await reportsContext(user);

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Reportes"
        title="Asistencia"
        text="Clases programadas, asistidas, canceladas, reprogramadas y porcentaje de asistencia. Descarga el PDF con membrete AIL."
        backHref="/dashboard/reportes"
        backLabel="← Reportes"
      />
      <AttendanceBoard
        students={students}
        records={attendance}
        canCapture={canCaptureAcademic(user)}
        defaultStudentId={user.role === "student" ? user.id : undefined}
      />
    </main>
  );
}
