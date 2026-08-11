import type { AcademicGroup } from "@/lib/academic/store";
import type { PublicUser } from "@/lib/auth/types";

export function parseHours(value?: string) {
  const n = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function teacherLoad(teacher: PublicUser, groups: AcademicGroup[]) {
  const max = parseHours(teacher.details.weeklyHoursMax);
  const fromGroups = groups
    .filter((group) => group.teacherId === teacher.id)
    .reduce((sum, group) => sum + parseHours(group.weeklyHours), 0);
  const assigned = parseHours(teacher.details.weeklyHoursAssigned) || fromGroups;
  return {
    max,
    assigned,
    available: Math.max(0, max - assigned),
  };
}
