import type { InvoiceUserStatus, ReceiptStatus } from "@/lib/billing/types";

export const PAYMENT_STATUSES = [
  "pagado",
  "pendiente",
  "vencido",
  "por_verificar",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export type Payment = {
  id: string;
  studentId: string;
  studentName: string;
  concept: string;
  amount: string;
  dueDate?: string;
  paidAt?: string;
  method?: string;
  status: PaymentStatus;
  documentId?: string;
  receiptStoredName?: string;
  receiptOriginalName?: string;
  receiptMimeType?: string;
  receiptStatus?: ReceiptStatus;
  receiptNotes?: string;
  receiptSubmittedAt?: string;
  invoiceStatus?: InvoiceUserStatus;
  invoiceRequestId?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
  /** Reserved for Empresa / Corporativo account statements */
  companyId?: string;
  scope?: "individual" | "company";
};

export function resolvePaymentStatus(payment: Payment): PaymentStatus {
  if (payment.status === "pagado" || payment.status === "por_verificar") {
    return payment.status;
  }
  if (payment.dueDate && new Date(payment.dueDate) < new Date()) {
    return "vencido";
  }
  return payment.status;
}
