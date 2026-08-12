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
