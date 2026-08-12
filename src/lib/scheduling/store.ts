import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { APP_DATA_DIR } from "@/lib/paths";
import type {
  AvailabilitySlot,
  ClassStatus,
  ScheduledClass,
  SchedulingPolicies,
  VirtualRoom,
} from "@/lib/scheduling/types";
import { defaultPolicies } from "@/lib/scheduling/types";

export type {
  AvailabilitySlot,
  ClassStatus,
  EnrollmentStatus,
  ScheduledClass,
  SchedulingPolicies,
  VirtualRoom,
  Weekday,
} from "@/lib/scheduling/types";

export {
  CLASS_STATUSES,
  ENROLLMENT_STATUSES,
  WEEKDAYS,
  WEEKDAY_LABELS,
  classStatusLabel,
  defaultPolicies,
  pastClasses,
  rangesOverlap,
  timeToMinutes,
  upcomingClasses,
} from "@/lib/scheduling/types";

type SchedulingStore = {
  availability: AvailabilitySlot[];
  classes: ScheduledClass[];
  rooms: VirtualRoom[];
  policies: SchedulingPolicies;
};

const FILE = path.join(APP_DATA_DIR, "scheduling.json");

async function readStore(): Promise<SchedulingStore> {
  await mkdir(APP_DATA_DIR, { recursive: true });
  try {
    const parsed = JSON.parse(await readFile(FILE, "utf8")) as Partial<SchedulingStore>;
    return {
      availability: parsed.availability ?? [],
      classes: parsed.classes ?? [],
      rooms: parsed.rooms ?? [],
      policies: { ...defaultPolicies(), ...(parsed.policies ?? {}) },
    };
  } catch {
    return {
      availability: [],
      classes: [],
      rooms: [],
      policies: defaultPolicies(),
    };
  }
}

async function writeStore(store: SchedulingStore) {
  await mkdir(APP_DATA_DIR, { recursive: true });
  await writeFile(FILE, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export async function getSchedulingStore() {
  return readStore();
}

export async function getPolicies() {
  return (await readStore()).policies;
}

export async function updatePolicies(patch: Partial<SchedulingPolicies>) {
  const store = await readStore();
  store.policies = { ...store.policies, ...patch };
  await writeStore(store);
  return store.policies;
}

export async function listAvailability(personId: string, role?: "student" | "teacher") {
  return (await readStore()).availability.filter(
    (item) =>
      item.personId === personId && (!role || item.role === role),
  );
}

export async function replaceAvailability(
  personId: string,
  role: "student" | "teacher",
  slots: Omit<AvailabilitySlot, "id" | "personId" | "role">[],
) {
  const store = await readStore();
  store.availability = store.availability.filter(
    (item) => !(item.personId === personId && item.role === role),
  );
  const next = slots.map((slot) => ({
    ...slot,
    id: crypto.randomUUID(),
    personId,
    role,
  }));
  store.availability.push(...next);
  await writeStore(store);
  return next;
}

export async function listClasses(filter?: {
  studentId?: string;
  teacherId?: string;
}) {
  let items = (await readStore()).classes;
  if (filter?.studentId) {
    items = items.filter((item) => item.studentId === filter.studentId);
  }
  if (filter?.teacherId) {
    items = items.filter((item) => item.teacherId === filter.teacherId);
  }
  return items.sort(
    (a, b) =>
      new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime(),
  );
}

export async function upsertClass(
  input: Omit<ScheduledClass, "id" | "createdAt" | "updatedAt"> & { id?: string },
) {
  const store = await readStore();
  const now = new Date().toISOString();
  if (input.id) {
    const index = store.classes.findIndex((item) => item.id === input.id);
    if (index >= 0) {
      store.classes[index] = {
        ...store.classes[index],
        ...input,
        id: input.id,
        updatedAt: now,
      };
      await writeStore(store);
      return store.classes[index];
    }
  }
  const item: ScheduledClass = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  store.classes.unshift(item);
  await writeStore(store);
  return item;
}

export async function updateClassStatus(id: string, status: ClassStatus) {
  const store = await readStore();
  const index = store.classes.findIndex((item) => item.id === id);
  if (index < 0) return null;
  store.classes[index] = {
    ...store.classes[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(store);
  return store.classes[index];
}

export async function getRoomForStudent(studentId: string) {
  return (
    (await readStore()).rooms.find(
      (item) => item.studentId === studentId && item.status === "active",
    ) ?? null
  );
}

export async function getRoomForGroup(groupId: string) {
  return (
    (await readStore()).rooms.find(
      (item) => item.groupId === groupId && item.status === "active",
    ) ?? null
  );
}

export async function saveVirtualRoom(
  input: Omit<VirtualRoom, "id" | "createdAt"> & { id?: string },
) {
  const store = await readStore();
  if (input.studentId) {
    store.rooms = store.rooms.map((item) =>
      item.studentId === input.studentId
        ? { ...item, status: "inactive" as const }
        : item,
    );
  }
  if (input.groupId) {
    store.rooms = store.rooms.map((item) =>
      item.groupId === input.groupId
        ? { ...item, status: "inactive" as const }
        : item,
    );
  }
  const room: VirtualRoom = {
    ...input,
    id: input.id ?? crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.rooms.unshift(room);
  await writeStore(store);
  return room;
}
