import type { InstitutionSettings } from "@/lib/settings/types";
import { site } from "@/lib/site";

export type BankTransferDetails = {
  institution: string;
  beneficiary: string;
  clabe: string;
  dimoPhone: string;
  logoSrc: string;
  logoAlt: string;
};

/** Valores oficiales AIL — solo para respuestas autenticadas autorizadas. */
export const defaultBankTransfer = (): BankTransferDetails => ({
  institution: "Mercado Pago",
  beneficiary: "Denisse Arevalo Inman",
  clabe: "722969014849616086",
  dimoPhone: "614 603 7223",
  logoSrc: "/logo-mercadopago.png",
  logoAlt: "Mercado Pago",
});

function cleanBeneficiary(value?: string | null) {
  const trimmed = value?.trim() || "";
  if (!trimmed || trimmed === site.name || trimmed === "A-Inman Languages") {
    return defaultBankTransfer().beneficiary;
  }
  return trimmed;
}

function cleanClabe(value?: string | null) {
  const trimmed = value?.trim() || "";
  const digits = trimmed.replace(/\D/g, "");
  if (
    !trimmed ||
    /pendiente/i.test(trimmed) ||
    digits.length !== 18
  ) {
    return defaultBankTransfer().clabe;
  }
  return digits;
}

export function resolveBankTransfer(
  settings?: Pick<InstitutionSettings, "bankTransfer"> | null,
): BankTransferDetails {
  const base = defaultBankTransfer();
  const stored = settings?.bankTransfer;
  if (!stored) return base;
  return {
    institution: stored.institution?.trim() || base.institution,
    beneficiary: cleanBeneficiary(stored.beneficiary),
    clabe: cleanClabe(stored.clabe),
    dimoPhone: stored.dimoPhone?.trim() || base.dimoPhone,
    logoSrc: stored.logoSrc?.trim() || base.logoSrc,
    logoAlt: stored.logoAlt?.trim() || base.logoAlt,
  };
}

export function maskClabe(clabe: string) {
  const digits = clabe.replace(/\D/g, "");
  if (digits.length < 4) return "•••• •••• •••• ••••";
  const last = digits.slice(-4);
  return `•••• •••• •••• ••${last}`;
}

export function formatClabeGroups(clabe: string) {
  const digits = clabe.replace(/\D/g, "");
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export const paymentConceptExamples = [
  "Denisse · Agosto 2026",
  "Nombre del alumno · 12 clases",
] as const;
