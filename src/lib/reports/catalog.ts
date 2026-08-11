import type { UserRole } from "@/lib/auth/admin";

export type ReportKind =
  | "diplomas"
  | "asistencia"
  | "progreso"
  | "historial"
  | "pagos"
  | "docente"
  | "corporativo"
  | "evaluaciones"
  | "grupos";

export type ReportCard = {
  kind: ReportKind;
  title: string;
  text: string;
  href: string;
};

const all: Record<ReportKind, ReportCard> = {
  diplomas: {
    kind: "diplomas",
    title: "Diplomas / constancias",
    text: "Generación al completar un nivel, con folio único y verificación pública.",
    href: "/dashboard/reportes/diplomas",
  },
  asistencia: {
    kind: "asistencia",
    title: "Reporte de asistencia",
    text: "Clases programadas, asistidas, canceladas, reprogramadas y porcentaje.",
    href: "/dashboard/reportes/asistencia",
  },
  progreso: {
    kind: "progreso",
    title: "Progreso académico",
    text: "Nivel, habilidades, evaluaciones, observaciones y avance del alumno.",
    href: "/dashboard/reportes/progreso",
  },
  historial: {
    kind: "historial",
    title: "Historial académico",
    text: "Niveles cursados, fechas, profesores, resultados y estatus.",
    href: "/dashboard/reportes/historial",
  },
  pagos: {
    kind: "pagos",
    title: "Reporte de pagos",
    text: "Pagos realizados, pendientes, fechas, conceptos y comprobantes.",
    href: "/dashboard/reportes/pagos",
  },
  docente: {
    kind: "docente",
    title: "Reporte docente",
    text: "Alumnos y grupos asignados, carga académica, horas y seguimiento.",
    href: "/dashboard/reportes/docente",
  },
  corporativo: {
    kind: "corporativo",
    title: "Reporte corporativo",
    text: "Progreso, asistencia y resultados de colaboradores inscritos.",
    href: "/dashboard/reportes/corporativo",
  },
  evaluaciones: {
    kind: "evaluaciones",
    title: "Evaluaciones",
    text: "Evaluación final, speaking y registro manual de resultados.",
    href: "/dashboard/reportes/progreso",
  },
  grupos: {
    kind: "grupos",
    title: "Reportes de grupos",
    text: "Asistencia y avance por grupo a cargo del profesor.",
    href: "/dashboard/reportes/docente",
  },
};

const byRole: Record<UserRole, ReportKind[]> = {
  student: ["diplomas", "asistencia", "progreso", "historial"],
  teacher: ["asistencia", "progreso", "evaluaciones", "grupos"],
  company: ["asistencia", "progreso", "corporativo", "diplomas", "historial"],
  coordinator: [
    "diplomas",
    "asistencia",
    "progreso",
    "evaluaciones",
    "historial",
    "docente",
  ],
  admin: [
    "diplomas",
    "asistencia",
    "progreso",
    "historial",
    "pagos",
    "docente",
    "corporativo",
  ],
};

export function reportsForRole(role: UserRole): ReportCard[] {
  return byRole[role].map((kind) => all[kind]);
}

export function introForRole(role: UserRole) {
  if (role === "student") {
    return "Mis diplomas, asistencia, progreso e historial académico.";
  }
  if (role === "teacher") {
    return "Asistencia de alumnos, progreso académico, evaluaciones y reportes de grupos.";
  }
  if (role === "company") {
    return "Asistencia y progreso de colaboradores, panorama del grupo, niveles completados y diplomas.";
  }
  if (role === "coordinator") {
    return "Reportes académicos, asistencia, avances, evaluaciones y diplomas emitidos.";
  }
  return "Reportes académicos, administrativos, financieros, docentes, corporativos, diplomas y constancias.";
}
