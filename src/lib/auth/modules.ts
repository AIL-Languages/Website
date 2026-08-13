import {
  canAccessCoordination,
  canCoordinate,
  canManageSystem,
  type UserRole,
} from "@/lib/auth/admin";

export type ModuleIconName =
  | "cms"
  | "mail"
  | "users"
  | "settings"
  | "panel"
  | "billing"
  | "documents"
  | "teachers"
  | "coordination"
  | "assignment"
  | "reports";

export type SystemModuleAccess = "admin" | "coordinate";

export type SystemModule = {
  id: string;
  href: string;
  title: string;
  text: string;
  icon: ModuleIconName;
  access: SystemModuleAccess;
  badge?: string;
};

export const SYSTEM_MODULES: SystemModule[] = [
  {
    id: "cms",
    href: "/dashboard/cms",
    title: "CMS · Landing",
    text: "Edita el contenido público del sitio.",
    icon: "cms",
    access: "admin",
  },
  {
    id: "correos",
    href: "/dashboard/correos",
    title: "Correos de bienvenida",
    text: "Administra las comunicaciones de nuevos usuarios.",
    icon: "mail",
    access: "admin",
  },
  {
    id: "usuarios",
    href: "/dashboard/usuarios",
    title: "Usuarios",
    text: "Gestiona perfiles, accesos y permisos.",
    icon: "users",
    access: "coordinate",
  },
  {
    id: "configuracion",
    href: "/dashboard/configuracion",
    title: "Configuración",
    text: "Modifica los ajustes generales del sistema.",
    icon: "settings",
    access: "admin",
  },
  {
    id: "panel",
    href: "/dashboard/panel",
    title: "Panel administrativo",
    text: "Consulta la operación general de AIL.",
    icon: "panel",
    access: "admin",
  },
  {
    id: "pagos",
    href: "/dashboard/pagos",
    title: "Pagos y facturación",
    text: "Revisa pagos, comprobantes y facturas.",
    icon: "billing",
    access: "coordinate",
  },
  {
    id: "documentos",
    href: "/dashboard/documentos",
    title: "Documentos PDF",
    text: "Consulta y administra documentos institucionales.",
    icon: "documents",
    access: "coordinate",
  },
  {
    id: "profesores",
    href: "/dashboard/profesores",
    title: "Profesores",
    text: "Gestiona perfiles, disponibilidad y seguimiento docente.",
    icon: "teachers",
    access: "coordinate",
  },
  {
    id: "coordinacion",
    href: "/dashboard/coordinacion",
    title: "Coordinación académica",
    text: "Grupos, asignaciones, horarios y seguimiento.",
    icon: "coordination",
    access: "coordinate",
  },
  {
    id: "asignacion",
    href: "/dashboard/asignacion",
    title: "Asignación académica",
    text: "Empareja alumnos y profesores según disponibilidad.",
    icon: "assignment",
    access: "coordinate",
  },
  {
    id: "reportes",
    href: "/dashboard/reportes",
    title: "Reportes",
    text: "Consulta asistencia, avances, diplomas y exportaciones.",
    icon: "reports",
    access: "coordinate",
    badge: "Próximamente",
  },
];

const COORDINATOR_HOME_IDS = [
  "usuarios",
  "pagos",
  "profesores",
  "coordinacion",
  "asignacion",
  "reportes",
] as const;

export function canAccessModule(
  module: SystemModule,
  role: UserRole,
  email?: string | null,
) {
  if (module.id === "coordinacion") {
    return canAccessCoordination(role, email);
  }
  if (module.access === "admin") {
    return canManageSystem(role, email);
  }
  return canCoordinate(role, email);
}

export function findSystemModule(href: string) {
  const normalized =
    href.length > 1 && href.endsWith("/") ? href.slice(0, -1) : href;
  return SYSTEM_MODULES.find(
    (item) =>
      normalized === item.href || normalized.startsWith(`${item.href}/`),
  );
}

export function modulesForUser(
  role: UserRole,
  email?: string | null,
  ids?: readonly string[],
) {
  const source = ids
    ? SYSTEM_MODULES.filter((item) => ids.includes(item.id))
    : SYSTEM_MODULES;
  return source.filter((item) => canAccessModule(item, role, email));
}

export function adminModulesForUser(role: UserRole, email?: string | null) {
  return modulesForUser(role, email);
}

export function coordinatorModulesForUser(
  role: UserRole,
  email?: string | null,
) {
  return modulesForUser(role, email, COORDINATOR_HOME_IDS);
}
