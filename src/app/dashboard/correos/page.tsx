import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { WelcomeEmailWorkspace } from "@/components/dashboard/WelcomeEmailWorkspace";
import { requireAdmin } from "@/lib/auth/profile";

export const metadata = { title: "Correos de bienvenida" };

export default async function WelcomeEmailsPage() {
  await requireAdmin();

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Comunicación"
        title="Correos de bienvenida"
        text="Dos flujos independientes: correo comercial al crear un lead, y correo académico solo cuando el alumno queda inscrito. El equipo (profesor, coordinación, empresa) sigue teniendo plantillas propias."
      />
      <WelcomeEmailWorkspace />
    </main>
  );
}
