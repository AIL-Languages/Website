export const DOCUMENT_KINDS = [
  "certificacion",
  "pago",
  "csf",
  "identificacion",
  "contrato",
  "otro",
] as const;

export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

export const DOCUMENT_KIND_OPTIONS: { value: DocumentKind | "auto"; label: string }[] =
  [
    { value: "auto", label: "Detectar automáticamente" },
    { value: "certificacion", label: "Certificación" },
    { value: "pago", label: "Pago / depósito / transferencia" },
    { value: "csf", label: "CSF (Constancia de Situación Fiscal)" },
    { value: "identificacion", label: "Identificación" },
    { value: "contrato", label: "Contrato" },
    { value: "otro", label: "Otro documento" },
  ];

export function isDocumentKind(value: string): value is DocumentKind {
  return DOCUMENT_KINDS.includes(value as DocumentKind);
}

export function documentKindLabel(kind: DocumentKind) {
  return (
    DOCUMENT_KIND_OPTIONS.find((item) => item.value === kind)?.label ?? kind
  );
}

export function parseRequestedKind(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "auto" as const;
  if (value === "auto" || isDocumentKind(value)) return value;
  return "auto" as const;
}
