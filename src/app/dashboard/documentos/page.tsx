import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { DocumentsPanel } from "@/components/dashboard/DocumentsPanel";
import { listProfiles, requireCoordinatorAccess } from "@/lib/auth/profile";
import { visibleDocuments } from "@/lib/documents/access";
import { listDocuments, toPublicDocument } from "@/lib/documents/store";

export const metadata = { title: "Documentos PDF" };

export default async function DocumentsPage() {
  const user = await requireCoordinatorAccess();
  const documents = visibleDocuments(user, await listDocuments()).map(
    toPublicDocument,
  );
  const people = (await listProfiles()).filter(
    (item) => item.role === "student" || item.role === "teacher",
  );

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Documentos PDF"
        title="Repositorio transversal"
        text="Documentos que entran al sistema: certificaciones, CSF, depósitos y transferencias. Los PDF que AIL genera (asistencia, progreso, diplomas) viven en Reportes."
      />
      <DocumentsPanel user={user} documents={documents} linkableUsers={people} />
    </main>
  );
}
