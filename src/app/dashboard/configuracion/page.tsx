import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { requireAdmin } from "@/lib/auth/profile";
import { getSettings } from "@/lib/settings/store";

export const metadata = { title: "Configuración" };

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Configuración"
        title="Cómo funciona AIL"
        text="Datos institucionales, parámetros académicos, perfiles, permisos y preferencias de notificación. Esta sección controla el sistema."
      />
      <SettingsForm settings={settings} />
    </main>
  );
}
