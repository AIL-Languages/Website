"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminLogEntry } from "@/lib/settings/types";

type Props = {
  entries: AdminLogEntry[];
};

export function AdminLogForm({ entries }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.get("title"),
          body: data.get("body"),
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo guardar la nota.");
      }
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[1.75rem] bg-white p-6 sm:p-8">
      <h3 className="font-display text-xl font-semibold text-navy">
        Bitácora interna
      </h3>
      <p className="mt-2 text-sm text-muted">
        Registra acuerdos, incidencias o control operativo (solo administración).
      </p>
      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <input
          name="title"
          required
          placeholder="Título"
          className="w-full rounded-xl border border-navy/10 px-4 py-3"
        />
        <textarea
          name="body"
          required
          rows={4}
          placeholder="Nota de control interno"
          className="w-full rounded-xl border border-navy/10 px-4 py-3"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          disabled={loading}
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          {loading ? "Guardando..." : "Agregar nota"}
        </button>
      </form>
      <ul className="mt-6 space-y-4">
        {entries.map((item) => (
          <li key={item.id} className="rounded-2xl bg-mist/80 p-4">
            <p className="font-semibold text-navy">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.body}</p>
            <p className="mt-2 text-xs text-muted">
              {item.createdByName} ·{" "}
              {new Date(item.createdAt).toLocaleString("es-MX")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
