import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { APP_DATA_DIR } from "@/lib/paths";
import { languageCodes } from "@/lib/academic/options";

export const ATTENDANCE_STATUSES = [
  "asistio",
  "falta",
  "cancelada",
  "reprogramada",
] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export type AttendanceRecord = {
  id: string;
  studentId: string;
  studentName: string;
  teacherId?: string;
  groupId?: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
  createdBy: string;
};

export type SkillScores = {
  listening?: number;
  speaking?: number;
  reading?: number;
  writing?: number;
  grammar?: number;
};

export type ProgressSnapshot = {
  id: string;
  studentId: string;
  studentName: string;
  language: string;
  level: string;
  teacherId?: string;
  teacherName?: string;
  periodStart?: string;
  periodEnd?: string;
  progressPercent: number;
  skills: SkillScores;
  teacherObservations?: string;
  academicRecommendation?: string;
  source: "manual" | "smrt";
  createdAt: string;
  createdBy: string;
};

export type LevelCompletion = {
  id: string;
  studentId: string;
  studentName: string;
  language: string;
  level: string;
  progressPercent: number;
  finalExamPassed: boolean;
  speakingPassed: boolean;
  levelCompleted: boolean;
  academicAuthorized: boolean;
  authorizedBy?: string;
  authorizedByName?: string;
  authorizedAt?: string;
  hoursCompleted?: number;
  completedAt?: string;
  updatedAt: string;
};

export type Diploma = {
  id: string;
  folio: string;
  studentId: string;
  studentName: string;
  language: string;
  level: string;
  issuedAt: string;
  hours?: number;
  issuedBy: string;
  issuedByName: string;
  completionId: string;
};

type ReportsStore = {
  attendance: AttendanceRecord[];
  progress: ProgressSnapshot[];
  completions: LevelCompletion[];
  diplomas: Diploma[];
};

const FILE = path.join(APP_DATA_DIR, "reports.json");

async function readStore(): Promise<ReportsStore> {
  await mkdir(APP_DATA_DIR, { recursive: true });
  try {
    const parsed = JSON.parse(await readFile(FILE, "utf8")) as Partial<ReportsStore>;
    return {
      attendance: parsed.attendance ?? [],
      progress: parsed.progress ?? [],
      completions: parsed.completions ?? [],
      diplomas: parsed.diplomas ?? [],
    };
  } catch {
    return { attendance: [], progress: [], completions: [], diplomas: [] };
  }
}

async function writeStore(store: ReportsStore) {
  await mkdir(APP_DATA_DIR, { recursive: true });
  await writeFile(FILE, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export async function getReportsStore() {
  return readStore();
}

export async function listAttendance(studentId?: string) {
  const { attendance } = await readStore();
  return studentId
    ? attendance.filter((item) => item.studentId === studentId)
    : attendance;
}

export async function createAttendance(
  input: Omit<AttendanceRecord, "id" | "createdAt">,
) {
  const store = await readStore();
  const item: AttendanceRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.attendance.unshift(item);
  await writeStore(store);
  return item;
}

export async function listProgress(studentId?: string) {
  const { progress } = await readStore();
  return studentId
    ? progress.filter((item) => item.studentId === studentId)
    : progress;
}

export async function createProgress(
  input: Omit<ProgressSnapshot, "id" | "createdAt">,
) {
  const store = await readStore();
  const item: ProgressSnapshot = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.progress.unshift(item);
  await writeStore(store);
  return item;
}

export async function listCompletions(studentId?: string) {
  const { completions } = await readStore();
  return studentId
    ? completions.filter((item) => item.studentId === studentId)
    : completions;
}

export async function upsertCompletion(
  input: Omit<LevelCompletion, "id" | "updatedAt"> & { id?: string },
) {
  const store = await readStore();
  const existing = store.completions.find(
    (item) =>
      item.id === input.id ||
      (item.studentId === input.studentId &&
        item.language === input.language &&
        item.level === input.level),
  );
  const next: LevelCompletion = {
    ...(existing ?? {
      id: crypto.randomUUID(),
      studentId: input.studentId,
      studentName: input.studentName,
      language: input.language,
      level: input.level,
      progressPercent: 0,
      finalExamPassed: false,
      speakingPassed: false,
      levelCompleted: false,
      academicAuthorized: false,
    }),
    ...input,
    id: existing?.id ?? crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  };
  if (existing) {
    store.completions = store.completions.map((item) =>
      item.id === existing.id ? next : item,
    );
  } else {
    store.completions.unshift(next);
  }
  await writeStore(store);
  return next;
}

export async function listDiplomas(studentId?: string) {
  const { diplomas } = await readStore();
  return studentId
    ? diplomas.filter((item) => item.studentId === studentId)
    : diplomas;
}

export async function getDiplomaByFolio(folio: string) {
  const { diplomas } = await readStore();
  const normalized = folio.trim().toUpperCase();
  return diplomas.find((item) => item.folio.toUpperCase() === normalized) ?? null;
}

export function isDiplomaEligible(completion: LevelCompletion) {
  return (
    completion.progressPercent >= 100 &&
    completion.finalExamPassed &&
    completion.speakingPassed &&
    completion.levelCompleted &&
    completion.academicAuthorized
  );
}

export async function nextFolio(language: string, level: string, year: number) {
  const code = languageCodes[language] || "XX";
  const prefix = `AIL-${code}-${level}-${year}-`;
  const { diplomas } = await readStore();
  const seq =
    diplomas.filter((item) => item.folio.startsWith(prefix)).length + 1;
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

export async function issueDiploma(input: {
  completion: LevelCompletion;
  issuedBy: string;
  issuedByName: string;
}) {
  if (!isDiplomaEligible(input.completion)) {
    throw new Error(
      "El diploma no está disponible. Se requiere nivel al 100 %, evaluación final aprobada, speaking aprobado, nivel completado y autorización académica.",
    );
  }

  const store = await readStore();
  const already = store.diplomas.find(
    (item) =>
      item.studentId === input.completion.studentId &&
      item.language === input.completion.language &&
      item.level === input.completion.level,
  );
  if (already) return already;

  const year = new Date().getFullYear();
  const diploma: Diploma = {
    id: crypto.randomUUID(),
    folio: await nextFolio(input.completion.language, input.completion.level, year),
    studentId: input.completion.studentId,
    studentName: input.completion.studentName,
    language: input.completion.language,
    level: input.completion.level,
    issuedAt: new Date().toISOString(),
    hours: input.completion.hoursCompleted,
    issuedBy: input.issuedBy,
    issuedByName: input.issuedByName,
    completionId: input.completion.id,
  };
  store.diplomas.unshift(diploma);
  await writeStore(store);
  return diploma;
}
