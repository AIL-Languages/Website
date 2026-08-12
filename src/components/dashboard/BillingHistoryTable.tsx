"use client";

import Link from "next/link";
import type { Payment } from "@/lib/ops/payments";
import type { InvoiceRequest } from "@/lib/billing/store";
import {
  invoiceUserStatusFromAdmin,
  invoiceUserStatusLabel,
  receiptStatusLabel,
} from "@/lib/billing/store";

type Props = {
  payments: Payment[];
  requests: InvoiceRequest[];
  canManage?: boolean;
};

function paymentLabel(status: Payment["status"], receiptStatus?: Payment["receiptStatus"]) {
  if (receiptStatus === "requiere_aclaracion") return "Requiere aclaración";
  if (status === "pagado" || receiptStatus === "confirmado") return "Confirmado";
  if (status === "por_verificar" || receiptStatus === "pendiente_revision") {
    return "Pendiente";
  }
  if (status === "vencido") return "Vencido";
  return "Pendiente";
}

function invoiceLabel(payment: Payment, requests: InvoiceRequest[]) {
  if (payment.invoiceStatus) {
    return invoiceUserStatusLabel[payment.invoiceStatus];
  }
  const linked = requests.find((item) => item.id === payment.invoiceRequestId);
  if (linked) {
    return invoiceUserStatusLabel[invoiceUserStatusFromAdmin(linked.status)];
  }
  const byPayment = requests.find((item) => item.paymentId === payment.id);
  if (byPayment) {
    return invoiceUserStatusLabel[invoiceUserStatusFromAdmin(byPayment.status)];
  }
  return invoiceUserStatusLabel.no_solicitada;
}

export function BillingHistoryTable({ payments, requests, canManage }: Props) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] bg-white">
      <div className="border-b border-navy/8 px-6 py-5">
        <h2 className="font-display text-xl font-semibold text-navy">
          Historial de pagos
        </h2>
        <p className="mt-1 text-sm text-muted">
          Consulta estatus de pago, comprobante y facturación.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-mist text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Fecha</th>
              {canManage ? <th className="px-5 py-3 font-semibold">Alumno</th> : null}
              <th className="px-5 py-3 font-semibold">Concepto</th>
              <th className="px-5 py-3 font-semibold">Monto</th>
              <th className="px-5 py-3 font-semibold">Estado</th>
              <th className="px-5 py-3 font-semibold">Comprobante</th>
              <th className="px-5 py-3 font-semibold">Factura</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((item) => {
              const request =
                requests.find((req) => req.id === item.invoiceRequestId) ||
                requests.find((req) => req.paymentId === item.id);
              return (
                <tr key={item.id} className="border-t border-navy/8">
                  <td className="px-5 py-3 text-muted">
                    {item.paidAt || item.dueDate || item.createdAt.slice(0, 10)}
                  </td>
                  {canManage ? (
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/pagos/alumno/${item.studentId}`}
                        className="font-semibold text-navy hover:text-cyan"
                      >
                        {item.studentName}
                      </Link>
                    </td>
                  ) : null}
                  <td className="px-5 py-3">{item.concept}</td>
                  <td className="px-5 py-3">${item.amount}</td>
                  <td className="px-5 py-3">
                    {paymentLabel(item.status, item.receiptStatus)}
                    {item.receiptStatus ? (
                      <span className="mt-1 block text-xs text-muted">
                        {receiptStatusLabel[item.receiptStatus]}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-3">
                    {item.receiptStoredName || item.documentId ? (
                      <a
                        href={
                          item.receiptStoredName
                            ? `/api/billing/receipt?paymentId=${item.id}`
                            : `/api/documents/${item.documentId}/file`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-cyan"
                      >
                        Ver
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <p>{invoiceLabel(item, requests)}</p>
                    {request?.status === "facturada" ? (
                      <span className="mt-1 flex flex-wrap gap-2">
                        <a
                          href={`/api/billing/invoice/${request.id}/file?file=pdf`}
                          className="font-semibold text-cyan"
                        >
                          Descargar PDF
                        </a>
                        <a
                          href={`/api/billing/invoice/${request.id}/file?file=xml`}
                          className="font-semibold text-cyan"
                        >
                          Descargar XML
                        </a>
                      </span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
            {payments.length === 0 ? (
              <tr>
                <td
                  colSpan={canManage ? 7 : 6}
                  className="px-5 py-8 text-center text-muted"
                >
                  Aún no hay movimientos registrados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
