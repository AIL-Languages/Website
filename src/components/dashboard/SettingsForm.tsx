"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { roleLabel, type PublicProfileRole } from "@/lib/auth/admin";
import type { InstitutionSettings } from "@/lib/settings/store";

const profiles: PublicProfileRole[] = [
  "student",
  "teacher",
  "coordinator",
  "company",
];

const fieldClass =
  "mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none focus:border-cyan";

type Props = { settings: InstitutionSettings };

export function SettingsForm({ settings }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState<PublicProfileRole[]>(
    settings.enabledProfiles,
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionName: form.get("institutionName"),
          slogan: form.get("slogan"),
          email: form.get("email"),
          phone: form.get("phone"),
          coordinationPhone: form.get("coordinationPhone"),
          location: form.get("location"),
          weeklySmrtHours: Number(form.get("weeklySmrtHours")),
          maxGroupSize: Number(form.get("maxGroupSize")),
          classDurationMinutes: Number(form.get("classDurationMinutes")),
          allowPublicRegistration: form.get("allowPublicRegistration") === "on",
          enabledProfiles: enabled,
          classModalities: form.get("classModalities"),
          classTypes: form.get("classTypes"),
          timezone: form.get("timezone"),
          notifyPayments: form.get("notifyPayments") === "on",
          notifyClasses: form.get("notifyClasses") === "on",
          notifySchedule: form.get("notifySchedule") === "on",
          notifyAdmin: form.get("notifyAdmin") === "on",
          notifyAcademic: form.get("notifyAcademic") === "on",
          bankTransfer: {
            institution: String(form.get("bankInstitution") ?? ""),
            beneficiary: String(form.get("bankBeneficiary") ?? ""),
            clabe: String(form.get("bankClabe") ?? ""),
            dimoPhone: String(form.get("bankDimo") ?? ""),
            logoSrc: String(form.get("bankLogoSrc") ?? "/logo-mercadopago.png"),
            logoAlt: String(form.get("bankLogoAlt") ?? "Mercado Pago"),
          },
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo guardar.");
      }
      setSuccess("Configuración actualizada.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section id="institucional" className="rounded-[1.75rem] bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy">
          🏢 Datos institucionales
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Nombre de la academia
            <input name="institutionName" required defaultValue={settings.institutionName} className={fieldClass} />
          </label>
          <label className="text-sm font-medium">
            Slogan
            <input name="slogan" defaultValue={settings.slogan} className={fieldClass} />
          </label>
          <label className="text-sm font-medium">
            Correo
            <input type="email" name="email" required defaultValue={settings.email} className={fieldClass} />
          </label>
          <label className="text-sm font-medium">
            Teléfono
            <input name="phone" defaultValue={settings.phone} className={fieldClass} />
          </label>
          <label className="text-sm font-medium">
            Coordinación académica
            <input name="coordinationPhone" defaultValue={settings.coordinationPhone} className={fieldClass} />
          </label>
          <label className="text-sm font-medium">
            Ubicación
            <input name="location" defaultValue={settings.location} className={fieldClass} />
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            Zona horaria
            <input name="timezone" defaultValue={settings.timezone} className={fieldClass} />
          </label>
        </div>
      </section>

      <section id="academica" className="rounded-[1.75rem] bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy">
          🎓 Configuración académica
        </h2>
        <p className="mt-2 text-sm text-muted">
          Idiomas disponibles: Inglés, Portugués y Español para extranjeros.
          Niveles A1–C2.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-medium">
            Horas mínimas Smrt / semana
            <input type="number" min={1} name="weeklySmrtHours" defaultValue={settings.weeklySmrtHours} className={fieldClass} />
          </label>
          <label className="text-sm font-medium">
            Tamaño máximo de grupo
            <input type="number" min={1} name="maxGroupSize" defaultValue={settings.maxGroupSize} className={fieldClass} />
          </label>
          <label className="text-sm font-medium">
            Duración estándar (min)
            <input type="number" min={30} name="classDurationMinutes" defaultValue={settings.classDurationMinutes} className={fieldClass} />
          </label>
        </div>
        <label className="mt-4 block text-sm font-medium">
          Modalidades
          <textarea name="classModalities" rows={2} defaultValue={settings.classModalities} className={fieldClass} />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Tipos de clase
          <textarea name="classTypes" rows={2} defaultValue={settings.classTypes} className={fieldClass} />
        </label>
      </section>

      <section id="roles" className="rounded-[1.75rem] bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy">
          👤 Roles y permisos
        </h2>
        <label className="mt-4 inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="allowPublicRegistration" defaultChecked={settings.allowPublicRegistration} />
          Permitir registro público
        </label>
        <div className="mt-4 flex flex-wrap gap-3">
          {profiles.map((item) => (
            <label key={item} className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={enabled.includes(item)}
                onChange={(event) =>
                  setEnabled((current) =>
                    event.target.checked
                      ? [...current, item]
                      : current.filter((role) => role !== item),
                  )
                }
              />
              {roleLabel(item)}
            </label>
          ))}
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-mist text-muted">
              <tr>
                <th className="px-4 py-2">Funcionalidad</th>
                <th className="px-4 py-2">Admin</th>
                <th className="px-4 py-2">Coordinación</th>
                <th className="px-4 py-2">Profesor</th>
                <th className="px-4 py-2">Alumno</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Usuarios", "✓", "Parcial", "—", "—"],
                ["Pagos", "✓", "Parcial", "—", "Propios"],
                ["Profesores", "✓", "✓", "—", "—"],
                ["Académico", "✓", "✓", "Propio", "Propio"],
                ["Configuración", "✓", "—", "—", "—"],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-navy/8">
                  {row.map((cell) => (
                    <td key={cell} className="px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="metodos-pago" className="rounded-[1.75rem] bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy">
          Métodos de pago
        </h2>
        <p className="mt-2 text-sm text-muted">
          Fuente única para la landing y el dashboard. Si cambias institución,
          CLABE o DiMo®, se actualiza en toda la plataforma.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Institución
            <input
              name="bankInstitution"
              defaultValue={settings.bankTransfer.institution}
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-medium">
            Beneficiario
            <input
              name="bankBeneficiary"
              defaultValue={settings.bankTransfer.beneficiary}
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            CLABE
            <input
              name="bankClabe"
              defaultValue={settings.bankTransfer.clabe}
              placeholder="18 dígitos"
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-medium">
            Celular vinculado a DiMo®
            <input
              name="bankDimo"
              defaultValue={settings.bankTransfer.dimoPhone}
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-medium">
            Logo (ruta pública)
            <input
              name="bankLogoSrc"
              defaultValue={settings.bankTransfer.logoSrc}
              className={fieldClass}
            />
          </label>
          <input
            type="hidden"
            name="bankLogoAlt"
            defaultValue={settings.bankTransfer.logoAlt}
          />
        </div>
      </section>

      <section id="notificaciones" className="rounded-[1.75rem] bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy">🔔 Notificaciones</h2>
        <p className="mt-2 text-sm text-muted">
          Preferencias del sistema. El envío automático puede activarse más adelante.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["notifyPayments", "Avisos de pago", settings.notifyPayments],
            ["notifyClasses", "Clases próximas", settings.notifyClasses],
            ["notifySchedule", "Cambios de horario", settings.notifySchedule],
            ["notifyAdmin", "Avisos administrativos (próximamente)", settings.notifyAdmin],
            ["notifyAcademic", "Comunicaciones académicas", settings.notifyAcademic],
          ].map(([name, label, checked]) => (
            <label key={String(name)} className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name={String(name)} defaultChecked={Boolean(checked)} />
              {label}
            </label>
          ))}
        </div>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-lime-deep">{success}</p> : null}
      <button
        disabled={loading}
        className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white disabled:opacity-70"
      >
        {loading ? "Guardando..." : "Guardar configuración"}
      </button>
    </form>
  );
}
