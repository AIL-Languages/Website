import Link from "next/link";
import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { getAcademicBundle } from "@/lib/academic/store";
import { languages, optionLabel } from "@/lib/academic/options";
import { listProfiles, requireCoordinatorAccess } from "@/lib/auth/profile";
import { teacherLoad } from "@/lib/ops/load";

export const metadata = { title: "Profesores" };

export default async function TeachersPage() {
  await requireCoordinatorAccess();
  const teachers = (await listProfiles()).filter((item) => item.role === "teacher");
  const { groups, assignments } = await getAcademicBundle();
  const students = (await listProfiles()).filter((item) => item.role === "student");

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Profesores"
        title="Plantilla docente"
        text="Expediente profesional, disponibilidad y carga académica. La cuenta de acceso se administra en Usuarios."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {teachers.map((teacher) => {
          const load = teacherLoad(teacher, groups);
          const assignedStudents = assignments.filter(
            (item) => item.teacherId === teacher.id,
          );
          const ownGroups = groups.filter((item) => item.teacherId === teacher.id);
          return (
            <Link
              key={teacher.id}
              href={`/dashboard/profesores/${teacher.id}`}
              className="rounded-[1.75rem] bg-white p-6 transition hover:ring-2 hover:ring-cyan/40"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan">
                {teacher.accountStatus === "activo" ? "🟢 Activa" : "⚪ Inactiva"}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-navy">
                {teacher.name}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {teacher.details.languagesTaught
                  ? teacher.details.languagesTaught
                      .split(",")
                      .map((item) => optionLabel(languages, item.trim()))
                      .join(" / ")
                  : "Idioma por definir"}
                {teacher.details.proficiencyLevel
                  ? ` — ${teacher.details.proficiencyLevel}`
                  : ""}
              </p>
              <p className="mt-4 text-sm text-ink">
                Disponibilidad: {load.max || "—"} h/semana
                <br />
                Asignadas: {load.assigned} h · Disponibles: {load.available} h
              </p>
              <p className="mt-3 text-sm text-muted">
                {assignedStudents.length} alumnos · {ownGroups.length} grupos
                {assignedStudents.length
                  ? ` · ${assignedStudents
                      .map(
                        (item) =>
                          students.find((student) => student.id === item.studentId)
                            ?.name,
                      )
                      .filter(Boolean)
                      .slice(0, 3)
                      .join(", ")}`
                  : ""}
              </p>
              <p className="mt-4 text-sm font-semibold text-cyan">
                Abrir expediente →
              </p>
            </Link>
          );
        })}
      </div>
      {teachers.length === 0 ? (
        <p className="rounded-[1.5rem] bg-white p-6 text-sm text-muted">
          Aún no hay profesores. Crea la cuenta en Usuarios y completa aquí el
          expediente.
        </p>
      ) : null}
    </main>
  );
}
