"use client";

import Image from "next/image";
import { useState } from "react";
import type { PaymentMethod } from "@/lib/billing/types";

type Props = { methods: PaymentMethod[] };

export function PaymentMethodsCard({ methods }: Props) {
  const [copied, setCopied] = useState("");

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("");
    }
  }

  return (
    <article className="rounded-[1.75rem] bg-white p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-cyan">
        Realizar pago
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold text-navy">
        Métodos habilitados
      </h2>
      <p className="mt-2 text-sm text-muted">
        Elige un método, copia los datos necesarios y conserva tu comprobante
        para subirlo en esta misma sección.
      </p>

      <div className="mt-6 space-y-5">
        {methods.map((method) => (
          <div
            key={method.id}
            className="rounded-2xl border border-navy/8 bg-mist/50 p-5"
          >
            <div className="flex flex-wrap items-center gap-3">
              {method.logoSrc ? (
                <Image
                  src={method.logoSrc}
                  alt={method.logoAlt || method.title}
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              ) : null}
              <h3 className="font-display text-lg font-semibold text-navy">
                {method.title}
              </h3>
            </div>
            <p className="mt-2 text-sm text-muted">{method.instructions}</p>
            {method.conceptHint ? (
              <p className="mt-2 text-sm text-ink">
                <span className="font-semibold">Concepto / referencia:</span>{" "}
                {method.conceptHint}
              </p>
            ) : null}
            <dl className="mt-4 space-y-3">
              {method.fields.map((field) => {
                const key = `${method.id}-${field.label}`;
                return (
                  <div
                    key={key}
                    className="flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {field.label}
                      </dt>
                      <dd className="mt-1 text-sm text-ink">{field.value}</dd>
                    </div>
                    {field.copyable !== false ? (
                      <button
                        type="button"
                        onClick={() => void copy(field.value, key)}
                        className="rounded-full border border-navy/15 px-3 py-1.5 text-xs font-semibold text-navy"
                      >
                        {copied === key ? "Copiado" : "Copiar"}
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>
    </article>
  );
}
