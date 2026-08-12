"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Payment } from "@/lib/ops/payment-types";
import { CFDI_USES, TAX_REGIMES } from "@/lib/billing/types";

type Props = {
  payments: Payment[];
  canRequest: boolean;
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none focus:border-cyan";

export function InvoiceRequestCard({ payments, canRequest }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/billing/invoice", {
        method: "POST",
        body: new FormData(form),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo enviar la solicitud.");
      }
      setSuccess(true);
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded-[1.75rem] bg-white p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-cyan">
        Facturación
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold text-navy">
        A-Inman Languages emite factura por sus servicios.
      </h2>
      <p className="mt-3 text-sm text-muted">
        Si requieres factura, podrás solicitarla proporcionando tus datos
        fiscales y la información correspondiente al pago realizado.
      </p>
      {canRequest ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setSuccess(false);
            setError("");
          }}
          className="mt-5 rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep"
        >
          Solicitar factura
        </button>
      ) : (
        <p className="mt-4 text-sm text-muted">
          La facturación la gestiona el alumno o la empresa contratante.
        </p>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-modal-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] bg-white p-6 shadow-xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <h3
                id="invoice-modal-title"
                className="font-display text-xl font-semibold text-navy"
              >
                Solicitar factura
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-muted"
              >
                Cerrar
              </button>
            </div>

            {success ? (
              <div className="mt-6 rounded-2xl bg-mist p-5">
                <p className="font-semibold text-navy">
                  Solicitud recibida correctamente.
                </p>
                <p className="mt-2 text-sm text-muted">
                  Revisaremos la información proporcionada para procesar tu
                  factura.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-4 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Listo
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium sm:col-span-2">
                  Nombre o razón social
                  <input name="legalName" required className={fieldClass} />
                </label>
                <label className="text-sm font-medium">
                  RFC
                  <input name="rfc" required maxLength={13} className={fieldClass} />
                </label>
                <label className="text-sm font-medium">
                  Código postal fiscal
                  <input name="postalCode" required maxLength={5} className={fieldClass} />
                </label>
                <label className="text-sm font-medium sm:col-span-2">
                  Régimen fiscal del receptor
                  <select name="taxRegime" required className={fieldClass}>
                    <option value="">Selecciona</option>
                    {TAX_REGIMES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium sm:col-span-2">
                  Uso de CFDI
                  <select name="cfdiUse" required className={fieldClass}>
                    <option value="">Selecciona</option>
                    {CFDI_USES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium sm:col-span-2">
                  Correo para envío de factura
                  <input
                    type="email"
                    name="invoiceEmail"
                    required
                    className={fieldClass}
                  />
                </label>
                <label className="text-sm font-medium sm:col-span-2">
                  Pago relacionado
                  <select name="paymentId" className={fieldClass}>
                    <option value="">Sin vincular / otro pago</option>
                    {payments.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.concept} · ${item.amount} ·{" "}
                        {item.paidAt || item.dueDate || "sin fecha"}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  Fecha del pago
                  <input type="date" name="paymentDate" required className={fieldClass} />
                </label>
                <label className="text-sm font-medium">
                  Monto pagado
                  <input name="amount" required placeholder="2600" className={fieldClass} />
                </label>
                <label className="text-sm font-medium sm:col-span-2">
                  Constancia de Situación Fiscal (opcional)
                  <input
                    type="file"
                    name="csf"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    className={fieldClass}
                  />
                </label>
                <label className="text-sm font-medium sm:col-span-2">
                  Observaciones adicionales
                  <textarea name="notes" rows={3} className={fieldClass} />
                </label>
                <label className="inline-flex items-start gap-2 text-sm sm:col-span-2">
                  <input type="checkbox" name="confirmed" value="true" required className="mt-1" />
                  Confirmo que los datos fiscales proporcionados son correctos.
                </label>
                {error ? (
                  <p className="text-sm text-red-600 sm:col-span-2">{error}</p>
                ) : null}
                <button
                  disabled={loading}
                  className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70 sm:col-span-2"
                >
                  {loading ? "Enviando..." : "Enviar solicitud de factura"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </article>
  );
}
