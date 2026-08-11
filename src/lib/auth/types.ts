import { isSoleAdminEmail, parsePublicRole, type UserRole } from "@/lib/auth/admin";
import { parseDetails, type ProfileDetails } from "@/lib/academic/details";

export type { UserRole };

export type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interest: string | null;
  role: UserRole;
  details?: ProfileDetails | null;
  created_at: string;
  created_by: string | null;
  last_access?: string | null;
  account_status?: AccountStatus | null;
};

export type AccountStatus = "activo" | "inactivo";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  role: UserRole;
  details: ProfileDetails;
  createdAt: string;
  createdBy?: string;
  lastAccess?: string;
  accountStatus: AccountStatus;
};

export function toPublicUser(profile: Profile): PublicUser {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? undefined,
    interest: profile.interest ?? undefined,
    role: isSoleAdminEmail(profile.email)
      ? "admin"
      : parsePublicRole(profile.role),
    details: parseDetails(profile.details),
    createdAt: profile.created_at,
    createdBy: profile.created_by ?? undefined,
    lastAccess: profile.last_access ?? undefined,
    accountStatus:
      profile.account_status === "inactivo" ||
      parseDetails(profile.details).accountStatus === "inactivo"
        ? "inactivo"
        : "activo",
  };
}
