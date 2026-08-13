import { cache } from "react";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { parseDetails } from "@/lib/academic/details";
import {
  ACCESS_DENIED_PATH,
  canCoordinate,
  canManageSystem,
  resolveRole,
} from "@/lib/auth/admin";
import { canAccessModule, findSystemModule } from "@/lib/auth/modules";
import { type Profile, toPublicUser } from "@/lib/auth/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export const getCurrentProfile = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;

  const requested =
    (typeof user.user_metadata?.role === "string"
      ? user.user_metadata.role
      : null) || data.role;

  return toPublicUser({
    ...(data as Profile),
    role: resolveRole(user.email ?? data.email, requested),
    details: parseDetails(user.user_metadata?.details ?? data.details),
    last_access: user.last_sign_in_at,
    account_status:
      user.user_metadata?.accountStatus === "inactivo" ? "inactivo" : "activo",
  });
});

export async function requireProfile() {
  const user = await getCurrentProfile();
  if (!user) redirect("/iniciar-sesion");
  return user;
}

export async function requireAdmin() {
  const user = await requireProfile();
  if (!canManageSystem(user.role, user.email)) redirect(ACCESS_DENIED_PATH);
  return user;
}

export async function requireCoordinatorAccess() {
  const user = await requireProfile();
  if (!canCoordinate(user.role, user.email)) redirect(ACCESS_DENIED_PATH);
  return user;
}

export async function requireModuleAccess(href: string) {
  const user = await requireProfile();
  const module = findSystemModule(href);
  if (!module || !canAccessModule(module, user.role, user.email)) {
    redirect(ACCESS_DENIED_PATH);
  }
  return user;
}

export async function getProfileById(id: string) {
  return (await listProfiles()).find((user) => user.id === id) ?? null;
}

export async function listProfiles() {
  let rows: Profile[] | null = null;

  try {
    const admin = createAdminClient();
    const result = await admin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (!result.error) {
      rows = (result.data as Profile[] | null) ?? [];
    }
  } catch {
    rows = null;
  }

  if (!rows) {
    const supabase = await createClient();
    const result = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    rows = (result.data as Profile[] | null) ?? [];
  }

  const metaById = new Map<
    string,
    {
      role?: string;
      details?: unknown;
      lastAccess?: string;
      banned?: boolean;
      accountStatus?: string;
    }
  >();
  try {
    const admin = createAdminClient();
    const { data: authUsers } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    for (const authUser of authUsers.users) {
      metaById.set(authUser.id, {
        role:
          typeof authUser.user_metadata?.role === "string"
            ? authUser.user_metadata.role
            : undefined,
        details: authUser.user_metadata?.details,
        lastAccess: authUser.last_sign_in_at,
        banned: Boolean(authUser.banned_until),
        accountStatus:
          typeof authUser.user_metadata?.accountStatus === "string"
            ? authUser.user_metadata.accountStatus
            : undefined,
      });
    }
  } catch {
    // Service role optional
  }

  return rows.map((profile) => {
    const meta = metaById.get(profile.id);
    const details = parseDetails(meta?.details ?? profile.details);
    const inactive =
      meta?.banned ||
      meta?.accountStatus === "inactivo" ||
      details.accountStatus === "inactivo";
    return toPublicUser({
      ...profile,
      role: resolveRole(profile.email, meta?.role ?? profile.role),
      details,
      last_access: meta?.lastAccess,
      account_status: inactive ? "inactivo" : "activo",
    });
  });
}
