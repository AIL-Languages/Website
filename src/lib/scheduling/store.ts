import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { APP_DATA_DIR } from "@/lib/paths";

export const WEEKDAYS = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
};

export const CLASS_STATUSES = [
  "scheduled",
  "completed",
  "cancelled",
  "rescheduled",
  "no_show_student",
  "cancelled_teacher",
] as const;

export type ClassStatus = (typeof CLASS_STATUSES)[number];

export const classStatusLabel: Record<ClassStatus, string> = {
  scheduled: "Agendada",
  completed: "Impartida",
  cancelled: "Cancelada",
  rescheduled: "Reprogramada",
  no_show_student: "Inasistencia",
  cancelled_teacher: "Cancelada (profesor)",
};

export const ENROLLMENT_STATUSES = [
  "pending",
  "reviewing",
  "approved",
  "active",
  "paused",
  "completed",
] as const;

export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

export type AvailabilitySlot = {
  id: string;
  personId: string;
  role: "student" | "teacher";
  weekday: Weekday;
  availableFrom: string;
  availableTo: string;
  timezone: string;
};

export type ScheduledClass = {
  id: string;
  studentId: string;
  teacherId?: string;
  groupId?: string;
  calendlyEventId?: string;
  calendlyInviteeId?: string;
  startDatetime: string;
  endDatetime: string;
  status: ClassStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type VirtualRoom = {
  id: string;
  studentId?: string;
  groupId?: string;
  provider: "zoom";
  meetingId: string;
  joinUrl: string;
  password?: string;
  /** Never expose to students */
  encryptedHostUrl?: string;
  topic?: string;
  status: "active" | "inactive";
  createdAt: string;
};

export type SchedulingPolicies = {
  cancellationLimitHours: number;
  rescheduleLimitHours: number;
  noShowPolicy: string;
  defaultCalendlyUrl: string;
  defaultTimezone: string;
};

type SchedulingStore = {
  availability: AvailabilitySlot[];
  classes: ScheduledClass[];
  rooms: VirtualRoom[];
  policies: SchedulingPolicies;
};

const FILE = path.join(APP_DATA_DIR, "scheduling.json");

export function defaultPolicies(): SchedulingPolicies {
  return {
    cancellationLimitHours: 12,
    rescheduleLimitHours: 12,
    noShowPolicy:
      "La inasistencia sin aviso puede descontar la sesión del paquete contratado.",
    defaultCalendlyUrl: "https://calendly.com/ailanguages",
    defaultTimezone: "America/Chihuahua",
  };
}

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

export function upcomingClasses(classes: ScheduledClass[]) {
  const now = Date.now();
  return classes.filter(
    (item) =>
      item.status === "scheduled" &&
      new Date(item.startDatetime).getTime() >= now,
  );
}

export function pastClasses(classes: ScheduledClass[]) {
  const now = Date.now();
  return classes.filter(
    (item) =>
      item.status !== "scheduled" ||
      new Date(item.startDatetime).getTime() < now,
  );
}

export function timeToMinutes(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

export function rangesOverlap(
  aFrom: string,
  aTo: string,
  bFrom: string,
  bTo: string,
) {
  const a1 = timeToMinutes(aFrom);
  const a2 = timeToMinutes(aTo);
  const b1 = timeToMinutes(bFrom);
  const b2 = timeToMinutes(bTo);
  return a1 < b2 && b1 < a2;
}
