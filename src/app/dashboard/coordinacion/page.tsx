import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { CoordinationDesk } from "@/components/dashboard/CoordinationDesk";
import { getAcademicBundle } from "@/lib/academic/store";
import { listProfiles, requireModuleAccess } from "@/lib/auth/profile";

export const metadata = { title: "Coordinación académica" };

export default async function CoordinationPage() {
  await requireModuleAccess("/dashboard/coordinacion");
  const users = await listProfiles();
  const academic = await getAcademicBundle();

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Coordinación académica"
        title="Quién estudia qué, con quién y cómo avanza"
        text="Alumnos, grupos, horarios, asignaciones y seguimiento académico. Incluye registro manual de Smrt English cuando no hay dato automático."
      />
      <CoordinationDesk
        students={users.filter((item) => item.role === "student")}
        teachers={users.filter((item) => item.role === "teacher")}
        groups={academic.groups}
        assignments={academic.assignments}
        schedules={academic.schedules}
        followUps={academic.followUps}
      />
    </main>
  );
}
