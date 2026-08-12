import { mkdir, readFile, writeFile, unlink } from "fs/promises";
import path from "path";
import { APP_DATA_DIR } from "@/lib/paths";
import { site } from "@/lib/site";
import type {
  BillingNotification,
  InvoiceAdminStatus,
  InvoiceRequest,
  PaymentMethod,
} from "@/lib/billing/types";

export type {
  BillingNotification,
  InvoiceAdminStatus,
  InvoiceRequest,
  InvoiceUserStatus,
  PaymentMethod,
  PaymentMethodField,
  ReceiptStatus,
} from "@/lib/billing/types";

export {
  CFDI_USES,
  INVOICE_ADMIN_STATUSES,
  INVOICE_USER_STATUSES,
  RECEIPT_STATUSES,
  TAX_REGIMES,
  invoiceAdminStatusLabel,
  invoiceUserStatusFromAdmin,
  invoiceUserStatusLabel,
  receiptStatusLabel,
} from "@/lib/billing/types";

type BillingStore = {
  paymentMethods: PaymentMethod[];
  invoiceRequests: InvoiceRequest[];
  notifications: BillingNotification[];
};

const FILE = path.join(APP_DATA_DIR, "billing.json");
export const BILLING_FILES_DIR = path.join(APP_DATA_DIR, "billing-files");

export function defaultPaymentMethods(): PaymentMethod[] {
  return [
    {
      id: "mercadopago",
      title: "Mercado Pago",
      logoSrc: "/logo-mercadopago.png",
      logoAlt: "Mercado Pago",
      instructions:
        "Paga con tarjeta, transferencia o saldo Mercado Pago. Cuando completes el pago, sube tu comprobante en esta misma sección.",
      conceptHint: "Nombre completo + paquete o mes",
      fields: [
        {
          label: "Plataforma",
          value: "Mercado Pago",
          copyable: true,
        },
        {
          label: "Link o alias",
          value: "Solicítalo a administración por WhatsApp o correo",
          copyable: false,
        },
        { label: "Correo de confirmación", value: site.email, copyable: true },
      ],
    },
    {
      id: "transferencia",
      title: "Transferencia bancaria (SPEI)",
      instructions:
        "Realiza la transferencia con el concepto indicado. Luego sube tu comprobante en esta misma sección.",
      conceptHint: "Nombre completo + paquete o mes",
      fields: [
        { label: "Banco", value: "BBVA", copyable: true },
        { label: "Titular", value: site.name, copyable: true },
        {
          label: "CLABE",
          value: "Solicítala a administración por WhatsApp o correo",
          copyable: false,
        },
        { label: "Correo de confirmación", value: site.email, copyable: true },
      ],
    },
    {
      id: "deposito",
      title: "Depósito en ventanilla",
      instructions:
        "Conserva el ticket del depósito y cárgalo como comprobante. Incluye tu nombre en la referencia cuando el banco lo permita.",
      conceptHint: "Nombre del alumno",
      fields: [
        { label: "Banco", value: "BBVA", copyable: true },
        {
          label: "Referencia",
          value: "Tu nombre completo",
          copyable: true,
        },
        { label: "Contacto AIL", value: site.phoneDisplay, copyable: true },
      ],
    },
  ];
}

async function ensureDirs() {
  await mkdir(APP_DATA_DIR, { recursive: true });
  await mkdir(BILLING_FILES_DIR, { recursive: true });
}

async function readStore(): Promise<BillingStore> {
  await ensureDirs();
  try {
    const parsed = JSON.parse(await readFile(FILE, "utf8")) as Partial<BillingStore>;
    return {
      paymentMethods:
        parsed.paymentMethods?.length ? parsed.paymentMethods : defaultPaymentMethods(),
      invoiceRequests: parsed.invoiceRequests ?? [],
      notifications: parsed.notifications ?? [],
    };
  } catch {
    return {
      paymentMethods: defaultPaymentMethods(),
      invoiceRequests: [],
      notifications: [],
    };
  }
}

async function writeStore(store: BillingStore) {
  await ensureDirs();
  await writeFile(FILE, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export async function getPaymentMethods() {
  const stored = (await readStore()).paymentMethods;
  const defaults = defaultPaymentMethods();
  const byId = new Map(stored.map((item) => [item.id, item]));
  for (const method of defaults) {
    const existing = byId.get(method.id);
    if (!existing) {
      byId.set(method.id, method);
      continue;
    }
    byId.set(method.id, {
      ...method,
      ...existing,
      logoSrc: existing.logoSrc || method.logoSrc,
      logoAlt: existing.logoAlt || method.logoAlt,
    });
  }
  const order = defaults.map((item) => item.id);
  const ordered = order
    .map((id) => byId.get(id))
    .filter((item): item is PaymentMethod => Boolean(item));
  for (const item of byId.values()) {
    if (!order.includes(item.id)) ordered.push(item);
  }
  return ordered;
}

export async function listInvoiceRequests(userId?: string) {
  const { invoiceRequests } = await readStore();
  return userId
    ? invoiceRequests.filter((item) => item.userId === userId)
    : invoiceRequests;
}

export async function getInvoiceRequest(id: string) {
  return (await listInvoiceRequests()).find((item) => item.id === id) ?? null;
}

export async function createInvoiceRequest(
  input: Omit<InvoiceRequest, "id" | "createdAt" | "updatedAt" | "status"> & {
    status?: InvoiceAdminStatus;
  },
) {
  const store = await readStore();
  const item: InvoiceRequest = {
    ...input,
    id: crypto.randomUUID(),
    status: input.status ?? "recibida",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.invoiceRequests.unshift(item);
  await writeStore(store);
  return item;
}

export async function updateInvoiceRequest(
  id: string,
  patch: Partial<InvoiceRequest>,
) {
  const store = await readStore();
  const index = store.invoiceRequests.findIndex((item) => item.id === id);
  if (index < 0) return null;
  store.invoiceRequests[index] = {
    ...store.invoiceRequests[index],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(store);
  return store.invoiceRequests[index];
}

export async function saveBillingFile(
  bytes: Buffer,
  originalName: string,
  prefix: string,
) {
  await ensureDirs();
  const safe = originalName.replace(/[^\w.\-]+/g, "_").slice(0, 80);
  const storedName = `${prefix}-${crypto.randomUUID()}-${safe}`;
  await writeFile(path.join(BILLING_FILES_DIR, storedName), bytes);
  return { storedName, originalName };
}

export function billingFilePath(storedName: string) {
  return path.join(BILLING_FILES_DIR, storedName);
}

export async function deleteBillingFile(storedName?: string) {
  if (!storedName) return;
  try {
    await unlink(billingFilePath(storedName));
  } catch {
    // ignore
  }
}

export async function createNotification(
  input: Omit<BillingNotification, "id" | "createdAt" | "read">,
) {
  const store = await readStore();
  const item: BillingNotification = {
    ...input,
    id: crypto.randomUUID(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  store.notifications.unshift(item);
  await writeStore(store);
  return item;
}

export async function listNotifications(userId: string) {
  return (await readStore()).notifications.filter((item) => item.userId === userId);
}

export async function markNotificationRead(id: string, userId: string) {
  const store = await readStore();
  store.notifications = store.notifications.map((item) =>
    item.id === id && item.userId === userId ? { ...item, read: true } : item,
  );
  await writeStore(store);
}
