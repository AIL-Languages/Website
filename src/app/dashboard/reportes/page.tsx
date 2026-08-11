import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { ReportsHub } from "@/components/dashboard/ReportsHub";
import { requireProfile } from "@/lib/auth/profile";

export const metadata = { title: "Reportes" };

export default async function ReportsPage() {
  const user = await requireProfile();

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Próximamente"
        title="Reportes"
        text="Generación y exportación de reportes académicos, administrativos, financieros y corporativos, incluyendo asistencia, progreso académico, diplomas y constancias."
      />
      <ReportsHub role={user.role} />
    </main>
  );
}
