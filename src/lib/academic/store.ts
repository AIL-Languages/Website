import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { APP_DATA_DIR } from "@/lib/paths";

export type AcademicGroup = {
  id: string;
  name: string;
  language: string;
  level: string;
  teacher: string;
  teacherId?: string;
  studentIds: string[];
  schedule: string;
  weeklyHours?: string;
  createdAt: string;
  createdBy: string;
};

export type AcademicFollowUp = {
  id: string;
  studentName: string;
  studentId?: string;
  notes: string;
  createdAt: string;
  createdBy: string;
};

export type TeacherAssignment = {
  id: string;
  studentId: string;
  teacherId: string;
  groupId?: string;
  createdAt: string;
  createdBy: string;
};

export type ScheduleSlot = {
  id: string;
  day: string;
  start: string;
  end: string;
  teacherId?: string;
  studentId?: string;
  groupId?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
};

type AcademicStore = {
  groups: AcademicGroup[];
  followUps: AcademicFollowUp[];
  assignments: TeacherAssignment[];
  schedules: ScheduleSlot[];
};

const FILE = path.join(APP_DATA_DIR, "academic.json");

async function readStore(): Promise<AcademicStore> {
  await mkdir(APP_DATA_DIR, { recursive: true });
  try {
    const parsed = JSON.parse(await readFile(FILE, "utf8")) as Partial<AcademicStore>;
    return {
      groups: (parsed.groups ?? []).map((group) => ({
        ...group,
        studentIds: group.studentIds ?? [],
      })),
      followUps: parsed.followUps ?? [],
      assignments: parsed.assignments ?? [],
      schedules: parsed.schedules ?? [],
    };
  } catch {
    return { groups: [], followUps: [], assignments: [], schedules: [] };
  }
}

async function writeStore(store: AcademicStore) {
  await mkdir(APP_DATA_DIR, { recursive: true });
  await writeFile(FILE, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export async function listGroups() {
  return (await readStore()).groups;
}

export async function createGroup(
  input: Omit<AcademicGroup, "id" | "createdAt" | "studentIds"> & {
    studentIds?: string[];
  },
) {
  const store = await readStore();
  const group: AcademicGroup = {
    ...input,
    studentIds: input.studentIds ?? [],
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.groups.unshift(group);
  await writeStore(store);
  return group;
}

export async function updateGroup(id: string, patch: Partial<AcademicGroup>) {
  const store = await readStore();
  const index = store.groups.findIndex((item) => item.id === id);
  if (index < 0) return null;
  store.groups[index] = { ...store.groups[index], ...patch, id };
  await writeStore(store);
  return store.groups[index];
}

export async function listFollowUps() {
  return (await readStore()).followUps;
}

export async function createFollowUp(
  input: Omit<AcademicFollowUp, "id" | "createdAt">,
) {
  const store = await readStore();
  const item: AcademicFollowUp = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.followUps.unshift(item);
  await writeStore(store);
  return item;
}

export async function listAssignments() {
  return (await readStore()).assignments;
}

export async function createAssignment(
  input: Omit<TeacherAssignment, "id" | "createdAt">,
) {
  const store = await readStore();
  store.assignments = store.assignments.filter(
    (item) => item.studentId !== input.studentId,
  );
  const item: TeacherAssignment = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.assignments.unshift(item);
  await writeStore(store);
  return item;
}

export async function listSchedules() {
  return (await readStore()).schedules;
}

export async function createSchedule(
  input: Omit<ScheduleSlot, "id" | "createdAt">,
) {
  const store = await readStore();
  const item: ScheduleSlot = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.schedules.unshift(item);
  await writeStore(store);
  return item;
}

export async function getAcademicBundle() {
  return readStore();
}
