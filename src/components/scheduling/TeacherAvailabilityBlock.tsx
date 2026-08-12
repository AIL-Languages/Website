"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AvailabilityEditor,
  type DraftSlot,
} from "@/components/scheduling/AvailabilityEditor";

type Props = {
  teacherId: string;
  initial: DraftSlot[];
  calendlyUrl?: string;
  calendlyUserId?: string;
  calendlyEventTypeId?: string;
  zoomUserId?: string;
};

export function TeacherAvailabilityBlock({
  teacherId,
  initial,
  calendlyUrl = "",
  calendlyUserId = "",
  calendlyEventTypeId = "",
  zoomUserId = "",
}: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    let slots: DraftSlot[] = [];
    try {
      slots = JSON.parse(String(form.get("availabilityPayload") || "[]")) as DraftSlot[];
    } catch {
      slots = [];
    }

    try {
      const availabilityRes = await fetch("/api/scheduling/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: teacherId,
          role: "teacher",
          slots,
        }),
      });
      const availabilityPayload = (await availabilityRes.json()) as {
        ok?: boolean;
        error?: string;
      };
      if (!availabilityRes.ok || !availabilityPayload.ok) {
        throw new Error(
          availabilityPayload.error || "No se pudo guardar la disponibilidad.",
        );
      }

      const detailsRes = await fetch(`/api/users/${teacherId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          details: {
            calendlyUrl: String(form.get("calendlyUrl") || ""),
            calendlyUserId: String(form.get("calendlyUserId") || ""),
            calendlyEventTypeId: String(form.get("calendlyEventTypeId") || ""),
            zoomUserId: String(form.get("zoomUserId") || ""),
          },
        }),
      });
      const detailsPayload = (await detailsRes.json()) as {
        ok?: boolean;
        error?: string;
      };
      if (!detailsRes.ok || !detailsPayload.ok) {
        throw new Error(detailsPayload.error || "No se pudo guardar Calendly/Zoom.");
      }

      setMessage("Disponibilidad docente actualizada.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-[1.75rem] bg-white p-6 sm:p-8"
    >
      <div>
        <h2 className="font-display text-xl font-semibold text-navy">
          Disponibilidad docente
        </h2>
        <p className="mt-2 text-sm text-muted">
          Estructura reutilizable para el match Alumno ↔ Profesor. La asignación
          sigue siendo manual en esta fase.
        </p>
      </div>

      <AvailabilityEditor
        title="Franjas horarias del profesor"
        hint="Define días y rangos en America/Chihuahua. Esta misma estructura alimentará el matching automático."
        initial={initial}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium sm:col-span-2">
          URL de Calendly
          <input
            name="calendlyUrl"
            defaultValue={calendlyUrl}
            placeholder="https://calendly.com/..."
            className="mt-2 w-full rounded-xl border border-navy/10 px-4 py-3"
          />
        </label>
        <label className="text-sm font-medium">
          Calendly user id
          <input
            name="calendlyUserId"
            defaultValue={calendlyUserId}
            className="mt-2 w-full rounded-xl border border-navy/10 px-4 py-3"
          />
        </label>
        <label className="text-sm font-medium">
          Calendly event type id
          <input
            name="calendlyEventTypeId"
            defaultValue={calendlyEventTypeId}
            className="mt-2 w-full rounded-xl border border-navy/10 px-4 py-3"
          />
        </label>
        <label className="text-sm font-medium sm:col-span-2">
          Zoom user id (fase 2)
          <input
            name="zoomUserId"
            defaultValue={zoomUserId}
            className="mt-2 w-full rounded-xl border border-navy/10 px-4 py-3"
          />
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-lime-deep">{message}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Guardando…" : "Guardar disponibilidad docente"}
      </button>
    </form>
  );
}
