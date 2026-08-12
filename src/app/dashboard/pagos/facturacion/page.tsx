import { AdminInvoicePanel } from "@/components/dashboard/AdminInvoicePanel";
import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { requireAdmin } from "@/lib/auth/profile";
import { listInvoiceRequests } from "@/lib/billing/store";

export const metadata = { title: "Solicitudes de factura" };

export default async function AdminBillingPage() {
  await requireAdmin();
  const requests = await listInvoiceRequests();

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Pagos y facturación"
        title="Solicitudes de factura"
        text="Consulta, actualiza estatus y carga PDF/XML emitidos manualmente."
        backHref="/dashboard/pagos"
        backLabel="← Pagos y facturación"
      />
      <AdminInvoicePanel requests={requests} />
    </main>
  );
}
