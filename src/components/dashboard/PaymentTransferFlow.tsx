"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BankTransferCard } from "@/components/billing/BankTransferCard";
import { InvoiceRequestCard } from "@/components/dashboard/InvoiceRequestCard";
import type { BankTransferDetails } from "@/lib/billing/transfer";
import type { Payment } from "@/lib/ops/payments";
import type { PublicUser } from "@/lib/auth/types";

type Props = {
  details: BankTransferDetails;
  payments: Payment[];
  user: PublicUser;
  canUpload: boolean;
  canRequestInvoice: boolean;
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none focus:border-cyan";

type Step = "transfer" | "receipt" | "invoice-ask" | "invoice" | "done";

export function PaymentTransferFlow({
  details,
  payments,
  user,
  canUpload,
  canRequestInvoice,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("transfer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPayment, setLastPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#comprobantes") {
      setStep("receipt");
    }
  }, []);

  async function onSubmitReceipt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canUpload) return;
    setLoading(true);
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/billing/receipt", {
        method: "POST",
        body: data,
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        payment?: Payment;
      };
      if (!response.ok || !payload.ok || !payload.payment) {
        throw new Error(payload.error || "No se pudo subir el comprobante.");
      }
      setLastPayment(payload.payment);
      form.reset();
      router.refresh();
      setStep(canRequestInvoice ? "invoice-ask" : "done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <BankTransferCard
        details={details}
        showPaidButton={step === "transfer" && canUpload}
        onPaidClick={() => {
          setStep("receipt");
          requestAnimationFrame(() => {
            document.getElementById("comprobantes")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          });
        }}
      />

      {step === "receipt" || step === "invoice-ask" || step === "invoice" || step === "done" ? (
        <article
          id="comprobantes"
          className="rounded-[1.75rem] bg-white p-6 sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan">
            Subir comprobante
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-navy">
            Registra tu pago
          </h2>
          <p className="mt-2 text-sm text-muted">
            Formatos: PDF, JPG, JPEG y PNG. El comprobante se asocia a tu
            perfil ({user.name}).
          </p>

          {step === "receipt" && canUpload ? (
            <form onSubmit={onSubmitReceipt} className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium sm:col-span-2">
                Concepto del pago
                <input
                  name="concept"
                  required
                  defaultValue=""
                  placeholder="Ej. María López – Agosto 2026"
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-medium">
                Monto pagado
                <input name="amount" required placeholder="2600" className={fieldClass} />
              </label>
              <label className="text-sm font-medium">
                Fecha del pago
                <input
                  type="date"
                  name="paidAt"
                  required
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-medium sm:col-span-2">
                Comprobante
                <input
                  required
                  type="file"
                  name="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-medium sm:col-span-2">
                Observaciones (opcional)
                <input name="notes" className={fieldClass} />
              </label>
              {error ? (
                <p className="text-sm text-red-600 sm:col-span-2">{error}</p>
              ) : null}
              <button
                disabled={loading}
                className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70 sm:col-span-2"
              >
                {loading ? "Enviando..." : "Enviar comprobante"}
              </button>
            </form>
          ) : null}

          {step === "invoice-ask" ? (
            <div className="mt-6 space-y-4">
              <p className="font-semibold text-navy">¿Requieres factura?</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setStep("invoice")}
                  className="rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep"
                >
                  Sí, solicitar factura
                </button>
                <button
                  type="button"
                  onClick={() => setStep("done")}
                  className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy"
                >
                  No requiero factura
                </button>
              </div>
            </div>
          ) : null}

          {step === "done" ? (
            <div className="mt-6 rounded-2xl bg-mist p-5">
              <p className="font-semibold text-navy">
                Comprobante enviado correctamente.
              </p>
              <p className="mt-2 text-sm text-muted">
                Tu pago será revisado y aparecerá como confirmado una vez
                validado por A-Inman Languages.
              </p>
              <button
                type="button"
                onClick={() => setStep("transfer")}
                className="mt-4 text-sm font-semibold text-cyan"
              >
                Registrar otro pago
              </button>
            </div>
          ) : null}
        </article>
      ) : null}

      {step === "invoice" && canRequestInvoice ? (
        <div id="facturacion">
          <InvoiceRequestCard
            payments={lastPayment ? [lastPayment, ...payments] : payments}
            canRequest
          />
        </div>
      ) : null}
    </div>
  );
}
