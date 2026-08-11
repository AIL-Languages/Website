"use client";

import type { PublicProfileRole } from "@/lib/auth/admin";
import type { ProfileDetails } from "@/lib/academic/details";
import {
  languages,
  levels,
  plans,
  programs,
  teacherStatuses,
} from "@/lib/academic/options";

const fieldClass =
  "mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30";

type Props = {
  role: PublicProfileRole;
  details?: ProfileDetails;
};

export function RoleFields({ role, details = {} }: Props) {
  if (role === "student") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Idioma
          <select name="language" defaultValue={details.language ?? ""} required className={fieldClass}>
            <option value="">Selecciona</option>
            {languages.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-ink">
          Nivel
          <select name="level" defaultValue={details.level ?? "diagnostico"} required className={fieldClass}>
            {levels.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-ink">
          Profesor (opcional)
          <input
            name="teacher"
            defaultValue={details.teacher ?? ""}
            className={fieldClass}
            placeholder="Nombre del profesor"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Plan
          <select name="plan" defaultValue={details.plan ?? ""} required className={fieldClass}>
            <option value="">Selecciona</option>
            {plans.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-ink sm:col-span-2">
          Fecha de inicio
          <input
            type="date"
            name="startDate"
            defaultValue={details.startDate ?? ""}
            required
            className={fieldClass}
          />
        </label>
      </div>
    );
  }

  if (role === "teacher") {
    const selected = (details.languagesTaught ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return (
      <div className="space-y-4">
        <fieldset>
          <legend className="text-sm font-medium text-ink">Idioma(s) que imparte</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {languages.map((item) => (
              <label key={item.value} className="inline-flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  name="languagesTaught"
                  value={item.value}
                  defaultChecked={selected.includes(item.value)}
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-medium text-ink">
          Disponibilidad
          <input
            name="availability"
            defaultValue={details.availability ?? ""}
            required
            className={fieldClass}
            placeholder="Ej. Lunes a viernes, 8:00–14:00"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Certificación(es)
          <input
            name="certifications"
            defaultValue={details.certifications ?? ""}
            className={fieldClass}
            placeholder="IELTS, TOEFL, CELPE-BRAS..."
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Estatus
          <select name="status" defaultValue={details.status ?? "activo"} className={fieldClass}>
            {teacherStatuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  if (role === "company") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink sm:col-span-2">
          Razón social / Empresa
          <input
            name="companyLegalName"
            defaultValue={details.companyLegalName ?? ""}
            required
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Contacto responsable
          <input
            name="contactName"
            defaultValue={details.contactName ?? ""}
            required
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Correo de contacto
          <input
            type="email"
            name="contactEmail"
            defaultValue={details.contactEmail ?? ""}
            required
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Teléfono
          <input
            name="contactPhone"
            defaultValue={details.contactPhone ?? ""}
            required
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Programa contratado
          <select name="program" defaultValue={details.program ?? ""} required className={fieldClass}>
            <option value="">Selecciona</option>
            {programs.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-ink sm:col-span-2">
          Número de alumnos
          <input
            type="number"
            min={1}
            name="studentCount"
            defaultValue={details.studentCount ?? ""}
            required
            className={fieldClass}
          />
        </label>
      </div>
    );
  }

  const selected = (details.coordinatedLanguages ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="text-sm font-medium text-ink">Idiomas que coordina</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {languages.map((item) => (
            <label key={item.value} className="inline-flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="coordinatedLanguages"
                value={item.value}
                defaultChecked={selected.includes(item.value)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm font-medium text-ink">
        Enfoque operativo
        <input
          name="coordinationFocus"
          defaultValue={details.coordinationFocus ?? "Grupos, horarios y seguimiento académico"}
          className={fieldClass}
        />
      </label>
    </div>
  );
}
