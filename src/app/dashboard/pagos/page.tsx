import { AdminInvoicePanel } from "@/components/dashboard/AdminInvoicePanel";
import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { BillingHistoryTable } from "@/components/dashboard/BillingHistoryTable";
import { BillingNotifications } from "@/components/dashboard/BillingNotifications";
import { PaymentTransferFlow } from "@/components/dashboard/PaymentTransferFlow";
import { PaymentsBoard } from "@/components/dashboard/PaymentsBoard";
import { canCoordinate, canManageSystem } from "@/lib/auth/admin";
import { canViewBankTransferDetails } from "@/lib/billing/access";
import { resolveBankTransfer } from "@/lib/billing/transfer";
import { listInvoiceRequests } from "@/lib/billing/store";
import { listProfiles, requireProfile } from "@/lib/auth/profile";
import { listPayments } from "@/lib/ops/payments";
import { getSettings } from "@/lib/settings/store";
import Link from "next/link";

export const metadata = { title: "Pagos y facturación" };

export default async function PaymentsPage() {
  const user = await requireProfile();
  const isStaff = canCoordinate(user.role, user.email);
  const isAdmin = canManageSystem(user.role, user.email);
  const canViewTransfer = canViewBankTransferDetails(user.role, user.email);
  const settings = canViewTransfer ? await getSettings() : null;
  const transfer = canViewTransfer ? resolveBankTransfer(settings) : null;
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
            item.studentId === user.id ||
            item.companyId === user.id,
        )
      : allPayments.filter((item) => item.studentId === user.id);
  const students = isStaff
    ? directory.filter((item) => item.role === "student")
    : [];
  const canUpload =
    isStaff || user.role === "student" || user.role === "company";
  const canRequestInvoice =
    user.role === "student" || user.role === "company" || isAdmin;
  const requests = isAdmin
    ? await listInvoiceRequests()
    : await listInvoiceRequests(user.id);

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Pagos y facturación"
        title="Pagos y facturación"
        text="Consulta la información relacionada con tus pagos, comprobantes y facturación de los servicios contratados con A-Inman Languages."
      />

      <BillingNotifications />

      {user.role === "company" ? (
        <nav className="flex flex-wrap gap-2 text-sm font-semibold">
          {[
            ["#transferencia", "Pagos"],
            ["#facturacion", "Facturación"],
            ["#comprobantes", "Comprobantes"],
            ["#historial", "Estado de cuenta"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full bg-white px-4 py-2 text-navy"
            >
              {label}
            </a>
          ))}
        </nav>
      ) : null}

      <PaymentTransferFlow
        details={transfer}
        canViewTransfer={canViewTransfer}
        payments={payments}
        user={user}
        canUpload={canUpload}
        canRequestInvoice={canRequestInvoice}
      />

      <div id="historial">
        <BillingHistoryTable
          payments={payments}
          requests={requests}
          canManage={isStaff}
        />
      </div>

      {isStaff ? (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-navy">
            Control operativo
          </h2>
          <p className="text-sm text-muted">
            Registro interno, filtros y confirmación de pagos.
          </p>
          <PaymentsBoard
            payments={payments}
            students={students}
            canManage={isStaff}
          />
          {isAdmin ? (
            <Link
              href="/dashboard/pagos/facturacion"
              className="inline-flex text-sm font-semibold text-cyan"
            >
              Abrir panel de solicitudes de factura →
            </Link>
          ) : null}
        </section>
      ) : null}

      {isAdmin ? <AdminInvoicePanel requests={requests} /> : null}
    </main>
  );
}
