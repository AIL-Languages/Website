"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RoleFields } from "@/components/auth/RoleFields";
import { detailsFromForm } from "@/lib/academic/details";
import type { PublicUser } from "@/lib/auth/types";

const fieldClass =
  "mt-2 w-full rounded-xl border border-navy/10 px-4 py-3 outline-none focus:border-cyan";

type Props = { teacher: PublicUser };

export function TeacherFileForm({ teacher }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/users/${teacher.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        details: detailsFromForm(form, teacher.details),
      }),
    });
    const payload = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !payload.ok) {
      setError(payload.error || "No se pudo guardar el expediente.");
      return;
    }
    setMessage("Expediente actualizado.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-[1.75rem] bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Nombre
          <input name="name" required defaultValue={teacher.name} className={fieldClass} />
        </label>
        <label className="text-sm font-medium">
          Correo
          <input defaultValue={teacher.email} disabled className={`${fieldClass} opacity-70`} />
        </label>
        <label className="text-sm font-medium">
          Teléfono
          <input name="phone" defaultValue={teacher.phone ?? ""} className={fieldClass} />
        </label>
        <label className="text-sm font-medium">
          Fecha de ingreso
          <input
            type="date"
            name="hireDate"
            defaultValue={teacher.details.hireDate ?? ""}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="rounded-2xl border border-navy/10 p-4">
        <h3 className="font-display text-lg font-semibold text-navy">Perfil académico</h3>
        <div className="mt-4">
          <RoleFields role="teacher" details={teacher.details} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Nivel de dominio
            <input
              name="proficiencyLevel"
              defaultValue={teacher.details.proficiencyLevel ?? ""}
              placeholder="Ej. C1"
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-medium">
            Formación académica
            <input
              name="education"
              defaultValue={teacher.details.education ?? ""}
              className={fieldClass}
            />
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium">
          Días disponibles
          <input
            name="daysAvailable"
            defaultValue={teacher.details.daysAvailable ?? ""}
            placeholder="Lun–Vie"
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-medium">
          Horas máximas / semana
          <input
            name="weeklyHoursMax"
            defaultValue={teacher.details.weeklyHoursMax ?? ""}
            placeholder="20"
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-medium">
          Horas asignadas / semana
          <input
            name="weeklyHoursAssigned"
            defaultValue={teacher.details.weeklyHoursAssigned ?? ""}
            placeholder="14"
            className={fieldClass}
          />
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-lime-deep">{message}</p> : null}
      <button className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white">
        Guardar expediente
      </button>
    </form>
  );
}
