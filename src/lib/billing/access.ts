import type { UserRole } from "@/lib/auth/admin";
import { canManageSystem } from "@/lib/auth/admin";

/** Roles autorizados a ver CLABE / beneficiario / Dimo® */
export const BANK_TRANSFER_VIEW_ROLES: UserRole[] = [
  "student",
  "company",
  "admin",
];

export function canViewBankTransferDetails(
  role: UserRole,
  email?: string | null,
): boolean {
  if (canManageSystem(role, email)) return true;
  return role === "student" || role === "company";
}
