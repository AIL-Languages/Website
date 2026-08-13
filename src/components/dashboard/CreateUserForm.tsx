"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RoleFields } from "@/components/auth/RoleFields";
import { detailsFromForm } from "@/lib/academic/details";
import type { PublicProfileRole } from "@/lib/auth/admin";
import { roleLabel } from "@/lib/auth/admin";

const roles: PublicProfileRole[] = [
  "student",
  "teacher",
  "coordinator",
  "company",
];

type CreatedUser = {
  id?: string;
  name: string;
  email: string;
  role: PublicProfileRole;
  password?: string;
};

type Props = {
  allowedRoles?: PublicProfileRole[];
  onCreated?: (user: CreatedUser) => void;
};

export function CreateUserForm({
  allowedRoles = roles,
  onCreated,
}: Props) {
  const router = useRouter();
  const [role, setRole] = useState<PublicProfileRole>(allowedRoles[0] ?? "student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const details = detailsFromForm(data);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
          phone: data.get("phone") || details.contactPhone,
          interest: details.language || details.program || undefined,
          role,
          details,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        user?: { id?: string; name?: string; email?: string; role?: PublicProfileRole };
        studentWelcomeEmail?: string;
      };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo crear el usuario.");
      }

      const created: CreatedUser = {
        id: payload.user?.id,
        name: payload.user?.name || String(data.get("name") ?? ""),
        email: payload.user?.email || String(data.get("email") ?? ""),
        role: payload.user?.role || role,
        password: String(data.get("password") ?? ""),
      };

      setSuccess(
        role === "student"
          ? payload.studentWelcomeEmail === "sent"
            ? "Alumno inscrito. Se envió el correo académico de onboarding."
            : "Alumno inscrito. El correo académico quedó pendiente o falló; puedes reenviarlo."
          : "Usuario creado. Puedes enviar el correo de bienvenida de equipo.",
      );
      form.reset();
      onCreated?.(created);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear usuario.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Nombre
          <input
            required
            name="name"
            className="mt-2 w-full rounded-xl border border-navy/10 bg-white px-4 py-3 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Correo
          <input
            required
            type="email"
            name="email"
            className="mt-2 w-full rounded-xl border border-navy/10 bg-white px-4 py-3 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Contraseña temporal
          <input
            required
            type="password"
            name="password"
            minLength={8}
            className="mt-2 w-full rounded-xl border border-navy/10 bg-white px-4 py-3 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Perfil
          <select
            name="role"
            value={role}
            onChange={(event) => setRole(event.target.value as PublicProfileRole)}
            className="mt-2 w-full rounded-xl border border-navy/10 bg-white px-4 py-3 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          >
            {allowedRoles.map((item) => (
              <option key={item} value={item}>
                {roleLabel(item)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {role !== "company" ? (
        <label className="block text-sm font-medium text-ink">
          Teléfono
          <input
            name="phone"
            className="mt-2 w-full rounded-xl border border-navy/10 bg-white px-4 py-3 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          />
        </label>
      ) : null}

      <div className="rounded-2xl border border-navy/10 bg-mist/40 p-4">
        <RoleFields key={role} role={role} />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-lime-deep">{success}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-mid disabled:opacity-70"
      >
        {loading ? "Creando..." : "Agregar usuario"}
      </button>
    </form>
  );
}
