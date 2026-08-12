"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Payment } from "@/lib/ops/payment-types";
import { receiptStatusLabel, type ReceiptStatus } from "@/lib/billing/types";

type Props = {
  payments: Payment[];
  canUpload: boolean;
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none focus:border-cyan";

const badge: Record<ReceiptStatus, string> = {
  pendiente_revision: "bg-amber-100 text-amber-900",
  confirmado: "bg-lime/40 text-navy-deep",
  requiere_aclaracion: "bg-red-100 text-red-800",
};

export function ReceiptUploadCard({ payments, canUpload }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const withReceipt = payments.filter((item) => item.receiptStoredName);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/billing/receipt", {
        method: "POST",
        body: new FormData(form),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo subir el comprobante.");
      }
      setSuccess("Comprobante enviado. Quedó pendiente de revisión.");
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded-[1.75rem] bg-white p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-cyan">
        Comprobante de pago
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold text-navy">
        Registrar comprobante
      </h2>
      <p className="mt-2 text-sm text-muted">
        Después de pagar, carga tu comprobante. Formatos: PDF, JPG, JPEG y PNG.
      </p>

      {canUpload ? (
        <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium sm:col-span-2">
            Archivo
            <input
              required
              type="file"
              name="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-medium">
            Pago relacionado (opcional)
            <select name="paymentId" defaultValue="" className={fieldClass}>
              <option value="">Nuevo registro</option>
              {payments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.concept} · ${item.amount}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Monto (si es nuevo)
            <input name="amount" placeholder="2600" className={fieldClass} />
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            Concepto (si es nuevo)
            <input
              name="concept"
              placeholder="Paquete 12 clases"
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            Observaciones (opcional)
            <input name="notes" className={fieldClass} />
          </label>
          {error ? <p className="text-sm text-red-600 sm:col-span-2">{error}</p> : null}
          {success ? (
            <p className="text-sm text-lime-deep sm:col-span-2">{success}</p>
          ) : null}
          <button
            disabled={loading}
            className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70 sm:col-span-2"
          >
            {loading ? "Enviando..." : "Subir comprobante"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-muted">
          Los comprobantes los revisa administración.
        </p>
      )}

      {withReceipt.length ? (
        <ul className="mt-6 space-y-3">
          {withReceipt.map((item) => {
            const status = item.receiptStatus || "pendiente_revision";
            return (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-mist/70 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-ink">{item.concept}</p>
                  <p className="text-muted">
                    Enviado:{" "}
                    {item.receiptSubmittedAt
                      ? new Date(item.receiptSubmittedAt).toLocaleString("es-MX")
                      : "—"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${badge[status]}`}
                >
                  {receiptStatusLabel[status]}
                </span>
                <a
                  href={`/api/billing/receipt?paymentId=${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cyan"
                >
                  Ver archivo
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </article>
  );
}
