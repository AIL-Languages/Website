import { listProfiles } from "@/lib/auth/profile";
import type { PublicUser } from "@/lib/auth/types";
import { visibleStudentsFor } from "@/lib/reports/access";
import { getReportsStore } from "@/lib/reports/store";

export async function reportsContext(actor: PublicUser) {
  const users = await listProfiles();
  const students = await visibleStudentsFor(actor, users);
  const store = await getReportsStore();
  const allowed = new Set(students.map((item) => item.id));
  return {
    users,
    students,
    attendance: store.attendance.filter((item) => allowed.has(item.studentId)),
    progress: store.progress.filter((item) => allowed.has(item.studentId)),
    completions: store.completions.filter((item) => allowed.has(item.studentId)),
    diplomas: store.diplomas.filter((item) => allowed.has(item.studentId)),
  };
}
