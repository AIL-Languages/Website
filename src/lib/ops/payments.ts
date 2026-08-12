import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { APP_DATA_DIR } from "@/lib/paths";
import type { InvoiceUserStatus, ReceiptStatus } from "@/lib/billing/store";

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

const FILE = path.join(APP_DATA_DIR, "payments.json");

async function readAll(): Promise<Payment[]> {
  await mkdir(APP_DATA_DIR, { recursive: true });
  try {
    const parsed = JSON.parse(await readFile(FILE, "utf8")) as Payment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(payments: Payment[]) {
  await mkdir(APP_DATA_DIR, { recursive: true });
  await writeFile(FILE, `${JSON.stringify(payments, null, 2)}\n`, "utf8");
}

export function resolvePaymentStatus(payment: Payment): PaymentStatus {
  if (payment.status === "pagado" || payment.status === "por_verificar") {
    return payment.status;
  }
  if (payment.dueDate && new Date(payment.dueDate) < new Date()) {
    return "vencido";
  }
  return payment.status;
}

export async function listPayments() {
  return (await readAll()).map((item) => ({
    ...item,
    status: resolvePaymentStatus(item),
  }));
}

export async function getPayment(id: string) {
  return (await listPayments()).find((item) => item.id === id) ?? null;
}

export async function createPayment(
  input: Omit<Payment, "id" | "createdAt" | "status"> & { status?: PaymentStatus },
) {
  const payments = await readAll();
  const payment: Payment = {
    ...input,
    id: crypto.randomUUID(),
    status: input.status ?? "pendiente",
    createdAt: new Date().toISOString(),
  };
  payments.unshift(payment);
  await writeAll(payments);
  return { ...payment, status: resolvePaymentStatus(payment) };
}

export async function updatePayment(id: string, patch: Partial<Payment>) {
  const payments = await readAll();
  const index = payments.findIndex((item) => item.id === id);
  if (index < 0) return null;
  payments[index] = { ...payments[index], ...patch, id };
  await writeAll(payments);
  return { ...payments[index], status: resolvePaymentStatus(payments[index]) };
}
