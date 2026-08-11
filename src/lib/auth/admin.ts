export const SOLE_ADMIN_EMAIL = "ainman.languages@gmail.com";

export type UserRole =
  | "admin"
  | "coordinator"
  | "teacher"
  | "student"
  | "company";

export type PublicProfileRole = Exclude<UserRole, "admin">;

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
