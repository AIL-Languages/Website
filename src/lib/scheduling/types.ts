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
