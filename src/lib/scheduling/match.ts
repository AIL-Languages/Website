import type { PublicUser } from "@/lib/auth/types";
import {
  listAvailability,
  type AvailabilitySlot,
} from "@/lib/scheduling/store";
import { rangesOverlap } from "@/lib/scheduling/types";
import { parseHours } from "@/lib/ops/load";
import { listGroups } from "@/lib/academic/store";

export type MatchResult = {
  teacher: PublicUser;
  score: number;
  overlappingSlots: AvailabilitySlot[];
  reasons: string[];
};

export async function findCompatibleTeachers(
  student: PublicUser,
  teachers: PublicUser[],
) {
  const studentSlots = await listAvailability(student.id, "student");
  const language = student.details.language;
  const level = student.details.level;
  const groups = await listGroups();
  const results: MatchResult[] = [];

  for (const teacher of teachers) {
    if (teacher.role !== "teacher") continue;
    if (teacher.accountStatus === "inactivo") continue;
    if (teacher.details.status === "inactivo") continue;

    const reasons: string[] = [];
    let score = 0;

    const taught = (teacher.details.languagesTaught ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (language && taught.includes(language)) {
      score += 40;
      reasons.push("Idioma compatible");
    } else if (language) {
      continue;
    }

    if (level && teacher.details.proficiencyLevel) {
      score += 10;
      reasons.push(`Nivel docente ${teacher.details.proficiencyLevel}`);
    }

    const teacherSlots = await listAvailability(teacher.id, "teacher");
    const overlapping: AvailabilitySlot[] = [];
    for (const studentSlot of studentSlots) {
      for (const teacherSlot of teacherSlots) {
        if (studentSlot.weekday !== teacherSlot.weekday) continue;
        if (
          rangesOverlap(
            studentSlot.availableFrom,
            studentSlot.availableTo,
            teacherSlot.availableFrom,
            teacherSlot.availableTo,
          )
        ) {
          overlapping.push(teacherSlot);
        }
      }
    }
    if (overlapping.length) {
      score += Math.min(40, overlapping.length * 10);
      reasons.push(`${overlapping.length} franja(s) en común`);
    } else if (studentSlots.length && teacherSlots.length) {
      reasons.push("Sin traslape horario todavía");
    }

    const max = parseHours(teacher.details.weeklyHoursMax);
    const assigned = parseHours(teacher.details.weeklyHoursAssigned);
    if (max && assigned >= max) {
      reasons.push("Carga completa");
      score -= 20;
    } else if (max) {
      score += 10;
      reasons.push(`Carga ${assigned}/${max} h`);
    }

    const groupLoad = groups.filter((item) => item.teacherId === teacher.id).length;
    if (groupLoad) reasons.push(`${groupLoad} grupo(s)`);

    results.push({ teacher, score, overlappingSlots: overlapping, reasons });
  }

  return results.sort((a, b) => b.score - a.score);
}
