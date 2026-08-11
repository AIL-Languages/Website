import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { UserManager } from "@/components/dashboard/UserManager";
import { canManageSystem } from "@/lib/auth/admin";
import { listProfiles, requireCoordinatorAccess } from "@/lib/auth/profile";

export const metadata = { title: "Usuarios" };

export default async function UsersPage() {
  const current = await requireCoordinatorAccess();
  const isAdmin = canManageSystem(current.role, current.email);
  const users = await listProfiles();

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Usuarios"
        title="Cuentas de acceso"
        text="Alta, edición, consulta, suspensión y búsqueda. Aquí se administra quién puede entrar al sistema; la operación académica vive en Coordinación."
      />
      <UserManager
        users={users}
        allowedRoles={
          isAdmin ? undefined : ["student", "teacher"]
        }
      />
    </main>
  );
}
