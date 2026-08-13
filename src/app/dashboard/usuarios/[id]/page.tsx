import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { UserAccountForm } from "@/components/dashboard/UserAccountForm";
import { canManageSystem, roleLabel } from "@/lib/auth/admin";
import {
  getProfileById,
  requireCoordinatorAccess,
} from "@/lib/auth/profile";

export const metadata = { title: "Cuenta de usuario" };

type Props = { params: Promise<{ id: string }> };

export default async function UserAccountPage({ params }: Props) {
  const current = await requireCoordinatorAccess();
  const { id } = await params;
  const user = await getProfileById(id);
  if (!user) notFound();

  const isAdmin = canManageSystem(current.role, current.email);

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker={roleLabel(user.role)}
        title={user.name}
        backHref="/dashboard/usuarios"
        backLabel="← Usuarios"
        text={`${user.email} · ${user.accountStatus === "activo" ? "Activo" : "Inactivo"} · último acceso ${
          user.lastAccess
            ? new Date(user.lastAccess).toLocaleDateString("es-MX")
            : "sin registro"
        }`}
      />
      <div className="flex flex-wrap gap-3 text-sm font-semibold">
        {user.role === "teacher" ? (
          <Link href={`/dashboard/profesores/${user.id}`} className="text-cyan">
            Ver expediente docente →
          </Link>
        ) : null}
        {user.role === "student" ? (
          <Link href={`/dashboard/pagos/alumno/${user.id}`} className="text-cyan">
            Ver historial de pagos →
          </Link>
        ) : null}
        <Link href="/dashboard/usuarios" className="text-muted">
          Volver al directorio
        </Link>
      </div>
      <UserAccountForm
        user={user}
        canDelete={isAdmin}
        canResetPassword
        canAssignInternalRoles={isAdmin}
      />
    </main>
  );
}
