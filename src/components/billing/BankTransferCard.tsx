"use client";

import Image from "next/image";
import { useState } from "react";
import type { BankTransferDetails } from "@/lib/billing/transfer";
import { paymentConceptExamples } from "@/lib/billing/transfer";

type Props = {
  details: BankTransferDetails;
  /** When set, shows CTA that scrolls/navigates after payment */
  onPaidClick?: () => void;
  paidHref?: string;
  showPaidButton?: boolean;
  compact?: boolean;
};

function CopyRow({
  label,
  value,
  copyable,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value.replace(/\s+/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {
        setCopied(false);
      }
    }
  }

  return (
    <div className="flex items-start justify-between gap-3 border-b border-navy/8 py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
        </p>
        <p className="mt-1 break-all text-base font-semibold text-navy">
          {value || "Pendiente de configurar"}
        </p>
      </div>
      {copyable && value ? (
        <button
          type="button"
          onClick={() => void copy()}
          className="shrink-0 rounded-full border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy"
        >
          {copied ? "✓ Copiado" : "Copiar"}
        </button>
      ) : null}
    </div>
  );
}

export function BankTransferCard({
  details,
  onPaidClick,
  paidHref,
  showPaidButton = true,
  compact = false,
}: Props) {
  return (
    <article
      id="transferencia"
      className={`rounded-[1.75rem] bg-white ${compact ? "p-5" : "p-6 sm:p-8"} shadow-[0_12px_40px_rgba(0,26,61,0.06)]`}
    >
      <div className="flex flex-wrap items-center gap-4">
        <Image
          src={details.logoSrc}
          alt={details.logoAlt}
          width={180}
          height={54}
          className="h-11 w-auto object-contain sm:h-12"
          priority
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan">
            Transferencia bancaria
          </p>
          <h2 className="font-display text-xl font-semibold text-navy sm:text-2xl">
            Datos para transferencia
          </h2>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-navy/8 bg-mist/40 px-4 sm:px-5">
        <CopyRow label="Institución" value={details.institution} />
        <CopyRow label="Beneficiario" value={details.beneficiary} />
        <CopyRow label="CLABE" value={details.clabe} copyable />
        <CopyRow
          label="Celular vinculado a DiMo®"
          value={details.dimoPhone}
          copyable
        />
      </div>

      <div className="mt-6 rounded-2xl border border-cyan/25 bg-cyan/5 p-5">
        <h3 className="font-display text-lg font-semibold text-navy">
          Importante: identifica tu pago
        </h3>
        <p className="mt-2 text-sm text-muted">
          Al realizar tu transferencia, escribe en el concepto o referencia tu
          nombre y el mes o servicio que estás pagando.
        </p>
        <ul className="mt-4 space-y-2 text-sm font-medium text-ink">
          {paymentConceptExamples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          Esto nos permitirá identificar y validar tu pago más rápidamente.
        </p>
      </div>

      {showPaidButton ? (
        paidHref ? (
          <a
            href={paidHref}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-navy-deep transition hover:bg-cyan-bright sm:w-auto"
          >
            Ya realicé mi pago
          </a>
        ) : (
          <button
            type="button"
            onClick={onPaidClick}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-navy-deep transition hover:bg-cyan-bright sm:w-auto"
          >
            Ya realicé mi pago
          </button>
        )
      ) : null}
    </article>
  );
}
