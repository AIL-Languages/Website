"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { InvoiceRequest } from "@/lib/billing/types";
import {
  INVOICE_ADMIN_STATUSES,
  invoiceAdminStatusLabel,
} from "@/lib/billing/types";

type Props = { requests: InvoiceRequest[] };

const fieldClass =
  "mt-2 w-full rounded-xl border border-navy/10 px-4 py-3 outline-none focus:border-cyan";

export function AdminInvoicePanel({ requests }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState("");

  async function onUpdate(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    setLoadingId(id);
    setError("");
    try {
      const response = await fetch(`/api/billing/invoice/${id}`, {
        method: "PATCH",
        body: new FormData(event.currentTarget),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo actualizar.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setLoadingId("");
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[1.75rem] bg-navy p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
          Administración
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Solicitudes de factura
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-white/75">
          Revisa datos fiscales, comprueba el pago y carga PDF/XML cuando la
          factura esté lista. Al marcar como facturada, el alumno recibe aviso.
        </p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {requests.length === 0 ? (
        <p className="rounded-[1.5rem] bg-white p-6 text-sm text-muted">
          No hay solicitudes de factura por ahora.
        </p>
      ) : null}

      {requests.map((item) => (
        <article key={item.id} className="rounded-[1.75rem] bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-navy">
                {item.userName}
              </h3>
              <p className="text-sm text-muted">
                {item.userEmail} · {item.createdAt.slice(0, 10)}
              </p>
            </div>
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-navy">
              {invoiceAdminStatusLabel[item.status]}
            </span>
          </div>

          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Razón social</dt>
              <dd className="font-medium text-ink">{item.legalName}</dd>
            </div>
            <div>
              <dt className="text-muted">RFC</dt>
              <dd className="font-medium text-ink">{item.rfc}</dd>
            </div>
            <div>
              <dt className="text-muted">C.P. fiscal</dt>
              <dd>{item.postalCode}</dd>
            </div>
            <div>
              <dt className="text-muted">Régimen / Uso CFDI</dt>
              <dd>
                {item.taxRegime}
                <br />
                {item.cfdiUse}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Pago</dt>
              <dd>
                {item.paymentDate} · ${item.amount}
                {item.paymentConcept ? ` · ${item.paymentConcept}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Correo factura</dt>
              <dd>{item.invoiceEmail}</dd>
            </div>
            {item.notes ? (
              <div className="sm:col-span-2">
                <dt className="text-muted">Observaciones</dt>
                <dd>{item.notes}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {item.csfStoredName ? (
              <a
                href={`/api/billing/invoice/${item.id}/file?file=csf`}
                className="font-semibold text-cyan"
              >
                Descargar CSF
              </a>
            ) : null}
            {item.invoicePdfStoredName ? (
              <a
                href={`/api/billing/invoice/${item.id}/file?file=pdf`}
                className="font-semibold text-cyan"
              >
                PDF cargado
              </a>
            ) : null}
            {item.invoiceXmlStoredName ? (
              <a
                href={`/api/billing/invoice/${item.id}/file?file=xml`}
                className="font-semibold text-cyan"
              >
                XML cargado
              </a>
            ) : null}
          </div>

          <form
            onSubmit={(event) => void onUpdate(event, item.id)}
            className="mt-5 grid gap-3 border-t border-navy/8 pt-5 sm:grid-cols-2"
          >
            <label className="text-sm font-medium">
              Estado
              <select
                name="status"
                defaultValue={item.status}
                className={fieldClass}
              >
                {INVOICE_ADMIN_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {invoiceAdminStatusLabel[status]}
                  </option>
                ))}
              </select>
            </label>
            <div className="text-sm text-muted sm:pt-8">
              Recibida → En revisión → En proceso → Facturada
            </div>
            <label className="text-sm font-medium">
              Factura PDF
              <input type="file" name="pdf" accept=".pdf,application/pdf" className={fieldClass} />
            </label>
            <label className="text-sm font-medium">
              Factura XML
              <input type="file" name="xml" accept=".xml,text/xml,application/xml" className={fieldClass} />
            </label>
            <button
              disabled={loadingId === item.id}
              className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70 sm:col-span-2"
            >
              {loadingId === item.id ? "Guardando..." : "Actualizar solicitud"}
            </button>
          </form>
        </article>
      ))}
    </section>
  );
}
