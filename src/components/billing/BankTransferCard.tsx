"use client";

import Image from "next/image";
import { useState } from "react";
import type { BankTransferDetails } from "@/lib/billing/transfer";
import {
  formatClabeGroups,
  maskClabe,
  paymentConceptExamples,
} from "@/lib/billing/transfer";

type Props = {
  details: BankTransferDetails;
  onPaidClick?: () => void;
  paidHref?: string;
  showPaidButton?: boolean;
  compact?: boolean;
};

function IconEye({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconEyeOff({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.8M9.9 5.1A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-4.2 4.8M6.1 6.1C3.8 7.8 2 12 2 12a18 18 0 0 0 6.3 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCopy({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5 15V5a2 2 0 0 1 2-2h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function actionBtnClass(active?: boolean) {
  return `inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition ${
    active
      ? "border-ail-green/50 bg-ail-green/15 text-ail-navy"
      : "border-navy/15 bg-white text-navy hover:border-ail-cyan"
  }`;
}

function CopyButton({
  value,
  successLabel,
}: {
  value: string;
  successLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    const text = value.replace(/\s+/g, "");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className={actionBtnClass(copied)}
      aria-label={copied ? successLabel : "Copiar"}
    >
      {copied ? (
        <span>✓ {successLabel}</span>
      ) : (
        <>
          <IconCopy />
          <span>Copiar</span>
        </>
      )}
    </button>
  );
}

export function BankTransferCard({
  details,
  onPaidClick,
  paidHref,
  showPaidButton = true,
  compact = false,
}: Props) {
  const [showClabe, setShowClabe] = useState(false);
  const clabeDisplay = showClabe
    ? formatClabeGroups(details.clabe)
    : maskClabe(details.clabe);

  return (
    <article
      id="transferencia"
      className={`rounded-[1.5rem] bg-white shadow-[0_12px_40px_rgba(0,26,61,0.06)] ${
        compact ? "p-4 sm:p-5" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Image
          src={details.logoSrc}
          alt={details.logoAlt}
          width={160}
          height={48}
          className="h-9 w-auto object-contain sm:h-10"
          priority
        />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan">
            Transferencia bancaria
          </p>
          <h2 className="font-display text-lg font-semibold text-navy sm:text-xl">
            Datos para transferencia
          </h2>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-navy/8 bg-mist/40 px-4">
        <div className="border-b border-navy/8 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Institución
          </p>
          <p className="mt-1 text-base font-semibold text-navy">
            {details.institution}
          </p>
        </div>

        <div className="border-b border-navy/8 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Beneficiario
          </p>
          <p className="mt-1 text-base font-semibold text-navy">
            {details.beneficiary}
          </p>
        </div>

        <div className="border-b border-navy/8 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            CLABE
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="min-w-0 flex-1 break-all font-mono text-base font-semibold tracking-wide text-navy">
              {clabeDisplay}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowClabe((value) => !value)}
                className={actionBtnClass()}
                aria-label={showClabe ? "Ocultar CLABE" : "Mostrar CLABE"}
              >
                {showClabe ? <IconEyeOff /> : <IconEye />}
                <span>{showClabe ? "Ocultar" : "Mostrar"}</span>
              </button>
              <CopyButton value={details.clabe} successLabel="CLABE copiada" />
            </div>
          </div>
        </div>

        <div className="py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Celular vinculado a Dimo®
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="min-w-0 flex-1 text-base font-semibold text-navy">
              {details.dimoPhone}
            </p>
            <CopyButton value={details.dimoPhone} successLabel="Número copiado" />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-cyan/25 bg-cyan/5 p-4">
        <h3 className="font-display text-base font-semibold text-navy">
          Concepto de pago
        </h3>
        <p className="mt-2 text-sm text-muted">
          Al realizar tu transferencia, indica en el concepto tu nombre y el mes o
          concepto correspondiente al pago.
        </p>
        <ul className="mt-3 space-y-1.5 text-sm font-medium text-ink">
          {paymentConceptExamples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Antes de realizar una transferencia, verifica que los datos mostrados
        correspondan a los datos oficiales disponibles dentro de tu cuenta AIL. No
        compartas estos datos en páginas públicas.
      </p>

      {showPaidButton ? (
        paidHref ? (
          <a
            href={paidHref}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep transition hover:bg-cyan-bright sm:w-auto"
          >
            Ya realicé mi pago
          </a>
        ) : (
          <button
            type="button"
            onClick={onPaidClick}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep transition hover:bg-cyan-bright sm:w-auto"
          >
            Ya realicé mi pago
          </button>
        )
      ) : null}
    </article>
  );
}
