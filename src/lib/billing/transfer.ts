import type { InstitutionSettings } from "@/lib/settings/store";
import { site } from "@/lib/site";

export type BankTransferDetails = {
  institution: string;
  beneficiary: string;
  clabe: string;
  dimoPhone: string;
  logoSrc: string;
  logoAlt: string;
};

export const defaultBankTransfer = (): BankTransferDetails => ({
  institution: "Mercado Pago",
  beneficiary: site.name,
  clabe: "",
  dimoPhone: site.phoneDisplay.replace(/^\+52\s*/, "").trim(),
  logoSrc: "/logo-mercadopago.png",
  logoAlt: "Mercado Pago",
});

export function resolveBankTransfer(
  settings?: Pick<InstitutionSettings, "bankTransfer"> | null,
): BankTransferDetails {
  const base = defaultBankTransfer();
  const stored = settings?.bankTransfer;
  if (!stored) return base;
  return {
    institution: stored.institution?.trim() || base.institution,
    beneficiary: stored.beneficiary?.trim() || base.beneficiary,
    clabe: stored.clabe?.trim() || base.clabe,
    dimoPhone: stored.dimoPhone?.trim() || base.dimoPhone,
    logoSrc: stored.logoSrc?.trim() || base.logoSrc,
    logoAlt: stored.logoAlt?.trim() || base.logoAlt,
  };
}

export const paymentConceptExamples = [
  "María López – Agosto 2026",
  "Juan Pérez – 12 clases",
  "Empresa XYZ – Capacitación agosto",
  "Traducción – Nombre del cliente",
] as const;
