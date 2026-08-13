export const SOLE_ADMIN_EMAIL = "ainman.languages@gmail.com";

export type UserRole =
  | "admin"
  | "coordinator"
  | "teacher"
  | "student"
  | "company";

export type PublicProfileRole = Exclude<UserRole, "admin">;

/** Perfiles que una persona puede elegir en registro público. */
export const SELF_SERVE_ROLES = ["student", "company"] as const;
export type SelfServeRole = (typeof SELF_SERVE_ROLES)[number];

export const ACCESS_DENIED_QUERY = "sin-permiso";
export const ACCESS_DENIED_MESSAGE =
  "No tienes permisos para acceder a este módulo";

export const ACCESS_DENIED_PATH = `/dashboard?aviso=${ACCESS_DENIED_QUERY}`;

export function isSoleAdminEmail(email?: string | null) {
  return email?.trim().toLowerCase() === SOLE_ADMIN_EMAIL;
}

export function parsePublicRole(value?: string | null): PublicProfileRole {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (normalized === "teacher" || normalized === "profesor") return "teacher";
  if (
    normalized === "coordinator" ||
    normalized === "coordinacion" ||
    normalized === "coordinacion academica"
  ) {
    return "coordinator";
  }
  if (
    normalized === "company" ||
    normalized === "empresa" ||
    normalized === "corporativo"
  ) {
    return "company";
  }
  return "student";
}

export function isSelfServeRole(role: string): role is SelfServeRole {
  return role === "student" || role === "company";
}

/** Nunca expone coordinación ni docente como perfil de autoservicio. */
export function parseSelfServeRole(value?: string | null): SelfServeRole {
  return parsePublicRole(value) === "company" ? "company" : "student";
}

export function resolveRole(
  email: string,
  requested?: string | null,
): UserRole {
  if (isSoleAdminEmail(email)) return "admin";
  return parsePublicRole(requested);
}

export function roleLabel(role: UserRole) {
  if (role === "admin") return "Administrador";
  if (role === "coordinator") return "Coordinación académica";
  if (role === "teacher") return "Profesor";
  if (role === "company") return "Empresa / Corporativo";
  return "Alumno";
}

export function canManageSystem(role: UserRole, email?: string | null) {
  return role === "admin" && isSoleAdminEmail(email);
}

export function canCoordinate(role: UserRole, email?: string | null) {
  return canManageSystem(role, email) || role === "coordinator";
}

/** Coordinación académica: coordinadores autorizados y administradora. */
export function canAccessCoordination(role: UserRole, email?: string | null) {
  return canCoordinate(role, email);
}

export function canCreateRole(actor: UserRole, target: UserRole, email?: string | null) {
  if (canManageSystem(actor, email)) {
    return target !== "admin";
  }
  if (actor === "coordinator") {
    return target === "student" || target === "teacher";
  }
  if (actor === "company") {
    return target === "student";
  }
  return false;
}
