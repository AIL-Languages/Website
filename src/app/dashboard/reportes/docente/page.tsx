import { redirect } from "next/navigation";
import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { getAcademicBundle } from "@/lib/academic/store";
import { listProfiles, requireProfile } from "@/lib/auth/profile";
import { teacherLoad } from "@/lib/ops/load";
import { canViewTeacherReport } from "@/lib/reports/access";

export const metadata = { title: "Reporte docente" };

export default async function TeacherReportPage() {
  const user = await requireProfile();
  if (!canViewTeacherReport(user)) redirect("/dashboard/reportes");
  const users = await listProfiles();
  const teachers =
    user.role === "teacher"
      ? users.filter((item) => item.id === user.id)
      : users.filter((item) => item.role === "teacher");
  const academic = await getAcademicBundle();

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Reportes"
        title="Reporte docente"
        text="Alumnos y grupos asignados, carga académica, horas y seguimiento."
        backHref="/dashboard/reportes"
        backLabel="← Reportes"
      />
      {teachers.map((teacher) => {
        const load = teacherLoad(teacher, academic.groups);
        const groups = academic.groups.filter((item) => item.teacherId === teacher.id);
        const assigned = academic.assignments.filter((item) => item.teacherId === teacher.id);
        return (
          <section key={teacher.id} className="rounded-[1.75rem] bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold text-navy">
                  {teacher.name}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {load.max || "—"} h disponibles · {load.assigned} h asignadas · {load.available} h libres
                </p>
              </div>
              <a
                href={`/api/reports/export?kind=docente&teacherId=${teacher.id}`}
                className="text-sm font-semibold text-cyan"
              >
                Descargar PDF
              </a>
            </div>
            <p className="mt-4 text-sm text-muted">
              Grupos: {groups.map((item) => item.name).join(", ") || "ninguno"}
            </p>
            <p className="mt-2 text-sm text-muted">
              Alumnos:{" "}
              {assigned
                .map((item) => users.find((person) => person.id === item.studentId)?.name)
                .filter(Boolean)
                .join(", ") || "sin asignaciones"}
            </p>
          </section>
        );
      })}
    </main>
  );
}
