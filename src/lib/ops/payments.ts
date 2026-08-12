import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { APP_DATA_DIR } from "@/lib/paths";
import type { Payment, PaymentStatus } from "@/lib/ops/payment-types";
import { resolvePaymentStatus } from "@/lib/ops/payment-types";

export type { Payment, PaymentStatus } from "@/lib/ops/payment-types";
export { PAYMENT_STATUSES, resolvePaymentStatus } from "@/lib/ops/payment-types";

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
