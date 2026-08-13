"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RoleFields } from "@/components/auth/RoleFields";
import { AvailabilityEditor } from "@/components/scheduling/AvailabilityEditor";
import { detailsFromForm } from "@/lib/academic/details";
import type { SelfServeRole } from "@/lib/auth/admin";
import { roleLabel } from "@/lib/auth/admin";
import { TEACHER_APPLICATION_FORM_URL } from "@/lib/recruitment";

const profiles: { value: SelfServeRole; title: string; text: string }[] = [
  {
    value: "student",
    title: "Alumno",
    text: "Aprende un idioma con clases personalizadas y seguimiento académico.",
  },
  {
    value: "company",
    title: "Empresa / Corporativo",
    text: "Administra alumnos de tu empresa y consulta el servicio contratado.",
  },
];

type Props = {
  defaultRole?: SelfServeRole;
};

export function RegisterForm({ defaultRole = "student" }: Props) {
  const router = useRouter();
  const [role, setRole] = useState<SelfServeRole>(defaultRole);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const details = detailsFromForm(form);
    if (details.preferredStartDate && !details.startDate) {
      details.startDate = details.preferredStartDate;
    }
    details.timezone = details.timezone || "America/Chihuahua";
    details.enrollmentStatus = details.enrollmentStatus || "pending";

    let availabilitySlots: unknown[] = [];
    try {
      availabilitySlots = JSON.parse(
        String(form.get("availabilityPayload") || "[]"),
      ) as unknown[];
    } catch {
      availabilitySlots = [];
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
          phone: form.get("phone") || details.contactPhone,
          interest: details.language || details.program || undefined,
          role,
          details,
          availabilitySlots: role === "student" ? availabilitySlots : undefined,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        needsEmailConfirmation?: boolean;
        message?: string;
        user?: { id?: string };
      };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo crear la cuenta.");
      }

      if (payload.needsEmailConfirmation) {
        setSuccess(
          payload.message ||
            "Cuenta creada. Revisa tu correo para confirmarla e inicia sesión.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarte.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <fieldset>
        <legend className="text-sm font-medium text-ink">Tipo de perfil</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {profiles.map((item) => (
            <label
              key={item.value}
              className={`cursor-pointer rounded-2xl border px-4 py-4 transition ${
                role === item.value
                  ? "border-cyan bg-mist shadow-[0_8px_24px_rgba(0,184,230,0.18)]"
                  : "border-navy/10 bg-white hover:border-cyan/50"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={item.value}
                checked={role === item.value}
                onChange={() => setRole(item.value)}
                className="sr-only"
              />
              <span className="block font-display text-base font-semibold text-navy">
                {item.title}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">
                {item.text}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-4 rounded-2xl border border-ail-cyan/25 bg-ail-cyan/8 px-4 py-3 text-xs leading-relaxed text-ink/85">
          ¿Quieres ser profesor de AIL? La postulación inicia con un formulario de
          selección; no crea una cuenta docente automática.{" "}
          <Link
            href="/registro?perfil=profesor"
            className="font-semibold text-ail-cyan hover:text-navy"
          >
            Ver proceso de aplicación
          </Link>{" "}
          o{" "}
          <a
            href={TEACHER_APPLICATION_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ail-cyan hover:text-navy"
          >
            abrir Google Forms
          </a>
          .
        </p>
      </fieldset>

      <label className="block text-sm font-medium text-ink">
        Nombre completo
        <input
          required
          name="name"
          className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          placeholder="Tu nombre"
        />
      </label>

      <label className="block text-sm font-medium text-ink">
        Correo
        <input
          required
          type="email"
          name="email"
          className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          placeholder="correo@ejemplo.com"
        />
      </label>

      <label className="block text-sm font-medium text-ink">
        Contraseña
        <input
          required
          type="password"
          name="password"
          minLength={8}
          className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          placeholder="Mínimo 8 caracteres"
        />
      </label>

      {role !== "company" ? (
        <label className="block text-sm font-medium text-ink">
          Teléfono / WhatsApp
          <input
            name="phone"
            className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
            placeholder="+52 ..."
          />
        </label>
      ) : null}

      <div className="rounded-2xl border border-navy/10 bg-mist/40 p-4">
        <p className="mb-4 text-sm font-semibold text-navy">
          Información de {roleLabel(role).toLowerCase()}
        </p>
        <RoleFields key={role} role={role} />
      </div>

      {role === "student" ? (
        <AvailabilityEditor key={`availability-${role}`} />
      ) : null}

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm text-lime-deep" role="status">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-navy-deep transition hover:bg-cyan-bright disabled:opacity-70"
      >
        {loading ? "Creando cuenta..." : `Crear cuenta de ${roleLabel(role).toLowerCase()}`}
      </button>

      <p className="text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/iniciar-sesion" className="font-semibold text-cyan hover:text-navy">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
