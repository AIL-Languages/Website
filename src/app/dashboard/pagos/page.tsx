import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { DocumentsPanel } from "@/components/dashboard/DocumentsPanel";
import { PaymentsBoard } from "@/components/dashboard/PaymentsBoard";
import { canCoordinate, canManageSystem } from "@/lib/auth/admin";
import { listProfiles, requireProfile } from "@/lib/auth/profile";
import { visibleDocuments } from "@/lib/documents/access";
import { listDocuments, toPublicDocument } from "@/lib/documents/store";
import { listPayments } from "@/lib/ops/payments";

export const metadata = { title: "Pagos" };

export default async function PaymentsPage() {
  const user = await requireProfile();
  const isStaff = canCoordinate(user.role, user.email);
  const isAdmin = canManageSystem(user.role, user.email);
  const allPayments = await listPayments();
  const directory =
    isStaff || user.role === "company" ? await listProfiles() : [];
  const companyStudentIds = directory
    .filter(
      (item) =>
        item.role === "student" &&
        (item.details.companyId === user.id ||
          item.createdBy === user.id ||
          Boolean(
            user.details.companyLegalName &&
              item.details.companyName === user.details.companyLegalName,
          )),
    )
    .map((item) => item.id);
  const payments = isStaff
    ? allPayments
    : user.role === "company"
      ? allPayments.filter(
          (item) =>
            companyStudentIds.includes(item.studentId) ||
            item.studentId === user.id,
        )
      : allPayments.filter((item) => item.studentId === user.id);
  const students = isStaff
    ? directory.filter((item) => item.role === "student")
    : [];
  const canUpload =
    isStaff || user.role === "student" || user.role === "company";
  const documents = visibleDocuments(user, await listDocuments())
    .filter((item) => item.kind === "pago" || item.kind === "csf")
    .map(toPublicDocument);

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Pagos"
        title="Control de pagos"
        text={
          isStaff
            ? "Registro, vencimientos, comprobantes, historial por alumno y reportes financieros básicos."
            : "Consulta tu historial y, si aplica, sube un comprobante para verificación."
        }
      />
      <PaymentsBoard
        payments={payments}
        students={students}
        canManage={isStaff}
      />
      {canUpload ? (
        <DocumentsPanel
          user={user}
          documents={documents}
          showIntro={false}
          defaultKind="pago"
          filterKinds={["pago", "csf"]}
          linkableUsers={isStaff ? students : undefined}
        />
      ) : null}
      {isAdmin ? (
        <p className="text-sm text-muted">
          Los PDF de certificación y otros documentos viven en el módulo Documentos.
        </p>
      ) : null}
    </main>
  );
}
