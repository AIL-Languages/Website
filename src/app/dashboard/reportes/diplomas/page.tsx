import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { DiplomaBoard } from "@/components/dashboard/DiplomaBoard";
import { requireProfile } from "@/lib/auth/profile";
import { canAuthorizeDiploma } from "@/lib/reports/access";
import { reportsContext } from "@/lib/reports/page-data";

export const metadata = { title: "Diplomas" };

export default async function DiplomasPage() {
  const user = await requireProfile();
  const { students, completions, diplomas } = await reportsContext(user);

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Reportes"
        title="Diplomas y constancias"
        text="El diploma se emite solo con nivel al 100 %, evaluación final aprobada, speaking aprobado, nivel completado y autorización académica. Cada folio es verificable en línea."
        backHref="/dashboard/reportes"
        backLabel="← Reportes"
      />
      <DiplomaBoard
        students={students}
        completions={completions}
        diplomas={diplomas}
        canIssue={canAuthorizeDiploma(user)}
        defaultStudentId={user.role === "student" ? user.id : undefined}
      />
    </main>
  );
}
