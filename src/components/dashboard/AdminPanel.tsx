import { ModuleGrid } from "@/components/dashboard/ModuleGrid";
import { adminModulesForUser } from "@/lib/auth/modules";
import type { UserRole } from "@/lib/auth/admin";

type Props = {
  role: UserRole;
  email?: string | null;
};

export function AdminPanel({ role, email }: Props) {
  const modules = adminModulesForUser(role, email);

  if (!modules.length) return null;

  return (
    <section className="mt-10 rounded-[1.75rem] bg-navy p-6 text-white sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
        Administrador
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold">
        Panel de administración
      </h2>
      <p className="mt-3 max-w-3xl text-sm text-white/75">
        Gestiona los módulos operativos de A‑Inman Languages según tus permisos
        de acceso.
      </p>
      <div className="mt-6">
        <ModuleGrid modules={modules} />
      </div>
    </section>
  );
}
