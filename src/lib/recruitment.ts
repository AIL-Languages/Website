/**
 * Reclutamiento docente AIL.
 * Flujo actual: Landing → Google Forms → revisión manual.
 * Estados preparados para un futuro portal de candidatos (sin automatizar aún).
 */

export type TeacherApplicantStatus =
  | "interested"
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "demo_class"
  | "approved"
  | "rejected";

/** Conceptual: candidato ≠ profesor activo (`role = teacher`). */
export type TeacherApplicantRole = "teacherApplicant";

export const TEACHER_APPLICATION_FORM_URL =
  "https://forms.gle/tEhvbgf4utLPzWR6A";

export const teacherApplicationRequirements = [
  {
    id: "cv",
    title: "Currículum Vitae actualizado",
    text: "Preferentemente PDF, con nombre identificable, experiencia docente, formación, idiomas y certificaciones.",
    icon: "file" as const,
  },
  {
    id: "certs",
    title: "Certificaciones del idioma",
    text: "Si cuentas con ellas, inclúyelas (IELTS, TOEFL, Cambridge, CELPE-BRAS, ELE, u otras comprobables).",
    icon: "award" as const,
  },
  {
    id: "education",
    title: "Formación académica",
    text: "Información sobre tu trayectoria académica relevante para la enseñanza.",
    icon: "graduation" as const,
  },
  {
    id: "experience",
    title: "Experiencia docente",
    text: "Experiencia impartiendo clases, tutorías o formación lingüística.",
    icon: "userCheck" as const,
  },
  {
    id: "availability",
    title: "Disponibilidad para impartir clases",
    text: "Días y horarios en los que podrías colaborar con AIL.",
    icon: "calendar" as const,
  },
  {
    id: "languages",
    title: "Idioma(s) que puedes impartir",
    text: "Inglés, portugués, español para extranjeros u otros según tu dominio.",
    icon: "languages" as const,
  },
] as const;

export const teacherSelectionSteps = [
  {
    step: "01",
    title: "Aplicación",
    text: "Completa el formulario y comparte la información solicitada.",
  },
  {
    step: "02",
    title: "Revisión de perfil",
    text: "El equipo académico de AIL revisará tu experiencia, formación y documentación.",
  },
  {
    step: "03",
    title: "Preselección",
    text: "Los perfiles que se ajusten a las necesidades académicas de AIL podrán ser contactados para continuar.",
  },
  {
    step: "04",
    title: "Entrevista y/o clase muestra",
    text: "Los candidatos preseleccionados podrán ser invitados a una entrevista y/o demostración docente de 30 minutos.",
  },
  {
    step: "05",
    title: "Incorporación",
    text: "Solo los candidatos aprobados podrán ser dados de alta posteriormente como profesores en la plataforma AIL.",
  },
] as const;

export function trackTeacherApplicationClick() {
  if (typeof window === "undefined") return;
  const detail = { event: "teacher_application_click" };
  window.dispatchEvent(new CustomEvent("ail:analytics", { detail }));
  const w = window as Window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer?.push(detail);
  w.gtag?.("event", "teacher_application_click");
}
