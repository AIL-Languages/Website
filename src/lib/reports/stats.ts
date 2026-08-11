import type {
  AttendanceRecord,
  Diploma,
  LevelCompletion,
  ProgressSnapshot,
} from "@/lib/reports/store";

export function inPeriod(date: string, from?: string, to?: string) {
  const day = date.slice(0, 10);
  if (from && day < from) return false;
  if (to && day > to) return false;
  return true;
}

export function attendanceSummary(
  records: AttendanceRecord[],
  from?: string,
  to?: string,
) {
  const items = records.filter((item) => inPeriod(item.date, from, to));
  const programmed = items.length;
  const attended = items.filter((item) => item.status === "asistio").length;
  const absences = items.filter((item) => item.status === "falta").length;
  const cancelled = items.filter((item) => item.status === "cancelada").length;
  const rescheduled = items.filter((item) => item.status === "reprogramada").length;
  const percent = programmed ? Math.round((attended / programmed) * 1000) / 10 : 0;
  return { programmed, attended, absences, cancelled, rescheduled, percent, items };
}

export function latestProgress(items: ProgressSnapshot[]) {
  return items[0] ?? null;
}

export function skillAverage(skills: ProgressSnapshot["skills"]) {
  const values = [
    skills.listening,
    skills.speaking,
    skills.reading,
    skills.writing,
    skills.grammar,
  ].filter((item): item is number => typeof item === "number");
  if (!values.length) return null;
  return Math.round(values.reduce((sum, item) => sum + item, 0) / values.length);
}

export function completionChecklist(completion?: LevelCompletion | null) {
  return {
    progress: (completion?.progressPercent ?? 0) >= 100,
    finalExam: Boolean(completion?.finalExamPassed),
    speaking: Boolean(completion?.speakingPassed),
    completed: Boolean(completion?.levelCompleted),
    authorized: Boolean(completion?.academicAuthorized),
  };
}

export function diplomaForCompletion(
  diplomas: Diploma[],
  completion: LevelCompletion,
) {
  return (
    diplomas.find(
      (item) =>
        item.studentId === completion.studentId &&
        item.language === completion.language &&
        item.level === completion.level,
    ) ?? null
  );
}
