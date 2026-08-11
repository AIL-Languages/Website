"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { canDeleteDocument } from "@/lib/documents/access";
import {
  DOCUMENT_KIND_OPTIONS,
  documentKindLabel,
  type DocumentKind,
} from "@/lib/documents/kinds";
import type { PublicDocument } from "@/lib/documents/store";
import type { PublicUser } from "@/lib/auth/types";

type Props = {
  user: PublicUser;
  documents: PublicDocument[];
  showIntro?: boolean;
  defaultKind?: DocumentKind | "auto";
  filterKinds?: DocumentKind[];
  linkableUsers?: PublicUser[];
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30";

function formatSize(size: number) {
  if (size >= 1_048_576) return `${(size / 1_048_576).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function DocumentsPanel({
  user,
  documents,
  showIntro = true,
  defaultKind = "auto",
  filterKinds,
  linkableUsers,
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState(documents);
  const kindOptions = filterKinds
    ? DOCUMENT_KIND_OPTIONS.filter(
        (item) => item.value === "auto" || filterKinds.includes(item.value),
      )
    : DOCUMENT_KIND_OPTIONS;
  const visibleItems = filterKinds
    ? items.filter((item) => filterKinds.includes(item.kind))
    : items;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<string | null>(documents[0]?.id ?? null);

  useEffect(() => {
    setItems(documents);
  }, [documents]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setError("Selecciona un archivo PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("El PDF no puede pesar más de 10 MB.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: data,
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        document?: PublicDocument;
      };
      if (!response.ok || !payload.ok || !payload.document) {
        throw new Error(payload.error || "No se pudo subir el PDF.");
      }

      setItems((current) => [payload.document!, ...current]);
      setOpenId(payload.document.id);
      setSuccess("PDF analizado. Revisa la información extraída.");
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir el PDF.");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar este PDF y su análisis?")) return;
    setError("");
    try {
      const response = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo eliminar.");
      }
      setItems((current) => current.filter((item) => item.id !== id));
      setOpenId((current) => (current === id ? null : current));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar.");
    }
  }

  return (
    <section id="documentos" className="mt-10 space-y-6">
      {showIntro ? (
        <div className="rounded-[1.75rem] bg-navy p-6 text-white sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
            Documentos PDF
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            Subir, leer y extraer información
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-white/75">
            Carga certificaciones, comprobantes de pago, depósitos, transferencias,
            CSF y otros PDF. El sistema lee el archivo y extrae datos clave para
            el expediente.
          </p>
        </div>
      ) : null}

      <div className="rounded-[1.75rem] bg-white p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-navy">
          Subir PDF
        </h3>
        <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-ink sm:col-span-2">
            Archivo PDF
            <input
              required
              type="file"
              name="file"
              accept="application/pdf,.pdf"
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium text-ink">
            Tipo de documento
            <select name="kind" defaultValue={defaultKind} className={fieldClass}>
              {kindOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-ink">
            Notas (opcional)
            <input
              name="notes"
              maxLength={500}
              placeholder="Ej. depósito de colegiatura mayo"
              className={fieldClass}
            />
          </label>
          {linkableUsers?.length ? (
            <label className="block text-sm font-medium text-ink sm:col-span-2">
              Vincular a usuario (opcional)
              <select name="linkedUserId" defaultValue="" className={fieldClass}>
                <option value="">Detectar por nombre en el PDF</option>
                {linkableUsers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.role === "teacher" ? "Profesor" : "Alumno"}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div className="sm:col-span-2">
            {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
            {success ? (
              <p className="mb-3 text-sm text-lime-deep">{success}</p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-navy-deep transition hover:bg-cyan-bright disabled:opacity-70"
            >
              {loading ? "Analizando PDF..." : "Subir y analizar"}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {visibleItems.length === 0 ? (
          <article className="rounded-[1.5rem] bg-white p-6 text-sm text-muted">
            Aún no hay PDF. Sube el primero para ver el análisis.
          </article>
        ) : (
          visibleItems.map((item) => {
            const open = openId === item.id;
            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_40px_rgba(0,26,61,0.06)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan">
                      {documentKindLabel(item.kind)}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-navy">
                      {item.originalName}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {formatDate(item.uploadedAt)} · {formatSize(item.size)} ·{" "}
                      {item.extracted.pageCount}{" "}
                      {item.extracted.pageCount === 1 ? "página" : "páginas"}
                      {item.uploadedBy !== user.id
                        ? ` · ${item.uploadedByName}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/api/documents/${item.id}/file`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
                    >
                      Ver PDF
                    </a>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : item.id)}
                      className="rounded-full border border-navy/15 px-4 py-2 text-sm font-semibold text-navy"
                    >
                      {open ? "Ocultar análisis" : "Ver análisis"}
                    </button>
                    {canDeleteDocument(user, item) ? (
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
                      >
                        Eliminar
                      </button>
                    ) : null}
                  </div>
                </div>

                {open ? (
                  <div className="border-t border-navy/8 px-6 py-5">
                    <p className="text-sm text-ink">{item.extracted.summary}</p>
                    {item.notes ? (
                      <p className="mt-2 text-sm text-muted">Nota: {item.notes}</p>
                    ) : null}
                    {item.linkedUserId ? (
                      <p className="mt-2 text-sm text-cyan">
                        Vinculado a{" "}
                        {linkableUsers?.find((person) => person.id === item.linkedUserId)
                          ?.name || "expediente"}
                      </p>
                    ) : null}

                    {item.extracted.fields.length ? (
                      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                        {item.extracted.fields.map((field) => (
                          <div key={`${field.label}-${field.value}`}>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                              {field.label}
                            </dt>
                            <dd className="mt-1 text-sm text-ink">{field.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}

                    {item.extracted.text ? (
                      <details className="mt-5 rounded-2xl bg-mist/70 p-4">
                        <summary className="cursor-pointer text-sm font-semibold text-navy">
                          Texto extraído del PDF
                        </summary>
                        <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted">
                          {item.extracted.text}
                        </pre>
                      </details>
                    ) : (
                      <p className="mt-4 text-sm text-muted">
                        No se pudo extraer texto. Si el PDF es un escaneo, ábrelo
                        para revisarlo visualmente.
                      </p>
                    )}
                  </div>
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
