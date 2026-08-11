import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { ProgressBoard } from "@/components/dashboard/ProgressBoard";
import { requireProfile } from "@/lib/auth/profile";
import { canAuthorizeDiploma, canCaptureAcademic } from "@/lib/reports/access";
import { reportsContext } from "@/lib/reports/page-data";

export const metadata = { title: "Progreso académico" };

export default async function ProgressReportPage() {
  const user = await requireProfile();
  const { students, progress, completions, attendance } = await reportsContext(user);

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Reportes"
        title="Progreso académico"
        text="Nivel, habilidades, evaluaciones y observaciones. Las métricas de Smrt se capturan de forma manual hasta contar con integración."
        backHref="/dashboard/reportes"
        backLabel="← Reportes"
      />
      <ProgressBoard
        students={students}
        progress={progress}
        completions={completions}
        attendance={attendance}
        canCapture={canCaptureAcademic(user)}
        canAuthorize={canAuthorizeDiploma(user)}
        defaultStudentId={user.role === "student" ? user.id : undefined}
      />
    </main>
  );
}
