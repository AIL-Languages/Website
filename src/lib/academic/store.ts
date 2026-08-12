import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { APP_DATA_DIR } from "@/lib/paths";
import type {
  AcademicFollowUp,
  AcademicGroup,
  ScheduleSlot,
  TeacherAssignment,
} from "@/lib/academic/types";

export type {
  AcademicFollowUp,
  AcademicGroup,
  ScheduleSlot,
  TeacherAssignment,
} from "@/lib/academic/types";

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
  const now = new Date().toISOString();
  const item: TeacherAssignment = {
    ...input,
    status: input.status ?? "active",
    assignedAt: input.assignedAt ?? now,
    id: crypto.randomUUID(),
    createdAt: now,
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
