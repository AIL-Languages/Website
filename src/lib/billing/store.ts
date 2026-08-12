import { mkdir, readFile, writeFile, unlink } from "fs/promises";
import path from "path";
import { APP_DATA_DIR } from "@/lib/paths";
import { site } from "@/lib/site";

export const RECEIPT_STATUSES = [
  "pendiente_revision",
  "confirmado",
  "requiere_aclaracion",
] as const;

export type ReceiptStatus = (typeof RECEIPT_STATUSES)[number];

export const INVOICE_USER_STATUSES = [
  "no_solicitada",
  "solicitada",
  "en_proceso",
  "emitida",
] as const;

export type InvoiceUserStatus = (typeof INVOICE_USER_STATUSES)[number];

export const INVOICE_ADMIN_STATUSES = [
  "recibida",
  "en_revision",
  "en_proceso",
  "facturada",
] as const;

export type InvoiceAdminStatus = (typeof INVOICE_ADMIN_STATUSES)[number];

export type PaymentMethodField = {
  label: string;
  value: string;
  copyable?: boolean;
};

export type PaymentMethod = {
  id: string;
  title: string;
  instructions: string;
  conceptHint?: string;
  logoSrc?: string;
  logoAlt?: string;
  fields: PaymentMethodField[];
};

export type InvoiceRequest = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  legalName: string;
  rfc: string;
  postalCode: string;
  taxRegime: string;
  cfdiUse: string;
  invoiceEmail: string;
  paymentId?: string;
  paymentConcept?: string;
  paymentDate: string;
  amount: string;
  csfStoredName?: string;
  csfOriginalName?: string;
  notes?: string;
  status: InvoiceAdminStatus;
  invoicePdfStoredName?: string;
  invoicePdfOriginalName?: string;
  invoiceXmlStoredName?: string;
  invoiceXmlOriginalName?: string;
  createdAt: string;
  updatedAt: string;
  scope: "individual" | "company";
};

export type BillingNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  href?: string;
  read: boolean;
  createdAt: string;
};

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

export function invoiceUserStatusFromAdmin(
  status?: InvoiceAdminStatus,
): InvoiceUserStatus {
  if (!status) return "no_solicitada";
  if (status === "recibida" || status === "en_revision") return "solicitada";
  if (status === "en_proceso") return "en_proceso";
  return "emitida";
}

export const receiptStatusLabel: Record<ReceiptStatus, string> = {
  pendiente_revision: "Pendiente de revisión",
  confirmado: "Pago confirmado",
  requiere_aclaracion: "Requiere aclaración",
};

export const invoiceUserStatusLabel: Record<InvoiceUserStatus, string> = {
  no_solicitada: "No solicitada",
  solicitada: "Solicitada",
  en_proceso: "En proceso",
  emitida: "Emitida",
};

export const invoiceAdminStatusLabel: Record<InvoiceAdminStatus, string> = {
  recibida: "Recibida",
  en_revision: "En revisión",
  en_proceso: "En proceso",
  facturada: "Facturada",
};

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

export const TAX_REGIMES = [
  "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios",
  "612 - Personas Físicas con Actividades Empresariales y Profesionales",
  "626 - Régimen Simplificado de Confianza",
  "601 - General de Ley Personas Morales",
  "603 - Personas Morales con Fines no Lucrativos",
  "616 - Sin obligaciones fiscales",
  "Otro",
];

export const CFDI_USES = [
  "G03 - Gastos en general",
  "D10 - Pagos por servicios educativos",
  "S01 - Sin efectos fiscales",
  "G01 - Adquisición de mercancías",
  "P01 - Por definir",
  "Otro",
];
