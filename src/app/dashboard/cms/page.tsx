import type { Metadata } from "next";
import { CmsWorkspace } from "@/components/cms/CmsWorkspace";
import { requireAdmin } from "@/lib/auth/profile";
import { SOLE_ADMIN_EMAIL } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "CMS · Gestor de contenido",
  description: "Edición de la landing page de A-Inman Languages.",
};

export default async function CmsPage() {
  await requireAdmin();

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
          Administración
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">
          Gestor de contenido (CMS)
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Solo disponible para <strong>{SOLE_ADMIN_EMAIL}</strong>. Protegido con
          contraseña exclusiva del CMS, independiente del acceso al dashboard.
        </p>
      </div>
      <CmsWorkspace />
    </section>
  );
}
