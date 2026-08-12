import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { AcademicMatchDesk } from "@/components/scheduling/AcademicMatchDesk";
import {
  listProfiles,
  requireCoordinatorAccess,
} from "@/lib/auth/profile";
import { findCompatibleTeachers } from "@/lib/scheduling/match";
import { listAvailability } from "@/lib/scheduling/store";

export const metadata = { title: "Asignación académica" };

export default async function AcademicAssignmentPage() {
  await requireCoordinatorAccess();
  const users = await listProfiles();
  const students = users.filter((item) => item.role === "student");
  const teachers = users.filter((item) => item.role === "teacher");

  const rows = [];
  for (const student of students) {
    const matches = await findCompatibleTeachers(student, teachers);
    const availability = await listAvailability(student.id, "student");
    rows.push({
      student,
      matches: matches.slice(0, 5).map((item) => ({
        teacherId: item.teacher.id,
        teacherName: item.teacher.name,
        score: item.score,
        reasons: item.reasons,
      })),
      availability: availability.map((slot) => ({
        weekday: slot.weekday,
        availableFrom: slot.availableFrom,
        availableTo: slot.availableTo,
        timezone: slot.timezone,
      })),
    });
  }

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Asignación académica"
        title="Match alumno ↔ profesor"
        backHref="/dashboard"
        backLabel="← Dashboard"
        text="Primera versión: sugerimos profesores compatibles; Administración confirma el match de forma manual."
      />
      <AcademicMatchDesk
        rows={rows}
        teachers={teachers.map((item) => ({ id: item.id, name: item.name }))}
      />
    </main>
  );
}
