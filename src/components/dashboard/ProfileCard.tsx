"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RoleFields } from "@/components/auth/RoleFields";
import { detailRows, detailsFromForm } from "@/lib/academic/details";
import { roleLabel, type PublicProfileRole } from "@/lib/auth/admin";
import type { PublicUser } from "@/lib/auth/types";

type Props = {
  user: PublicUser;
};

export function ProfileCard({ user }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const academic = detailRows(user.role, user.details);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const details = detailsFromForm(form, {
      companyId: user.details.companyId,
      companyName: user.details.companyName,
    });

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone") || details.contactPhone,
          interest: details.language || details.program || user.interest,
          details,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudieron guardar los cambios.");
      }

      setSuccess("Datos actualizados correctamente.");
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,26,61,0.06)] lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-navy">Tu perfil</h2>
        {!editing ? (
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setError("");
              setSuccess("");
            }}
            className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white transition hover:bg-navy-mid"
          >
            Modificar mis datos
          </button>
        ) : null}
      </div>

      {editing ? (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-ink">
              Nombre
              <input
                required
                name="name"
                defaultValue={user.name}
                className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/30"
              />
            </label>
            {user.role !== "company" ? (
              <label className="block text-sm font-medium text-ink">
                Teléfono / WhatsApp
                <input
                  name="phone"
                  defaultValue={user.phone ?? ""}
                  className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/30"
                />
              </label>
            ) : null}
          </div>

          {user.role !== "admin" ? (
            <div className="rounded-2xl border border-navy/10 bg-mist/40 p-4">
              <RoleFields
                key={user.role}
                role={user.role as PublicProfileRole}
                details={user.details}
              />
            </div>
          ) : null}

          <p className="text-xs text-muted">
            El correo y el rol no se modifican desde aquí.
          </p>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep transition hover:bg-cyan-bright disabled:opacity-70"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setEditing(false);
                setError("");
              }}
              className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy transition hover:border-cyan"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Nombre
              </dt>
              <dd className="mt-1 text-sm text-ink">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Correo
              </dt>
              <dd className="mt-1 text-sm text-ink">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Teléfono
              </dt>
              <dd className="mt-1 text-sm text-ink">
                {user.phone || user.details.contactPhone || "Sin registrar"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Rol
              </dt>
              <dd className="mt-1 text-sm text-ink">{roleLabel(user.role)}</dd>
            </div>
            {academic.map((row) => (
              <div key={row.label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {row.label}
                </dt>
                <dd className="mt-1 text-sm text-ink">{row.value}</dd>
              </div>
            ))}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Miembro desde
              </dt>
              <dd className="mt-1 text-sm text-ink">
                {new Date(user.createdAt).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
          </dl>
          {success ? (
            <p className="mt-4 text-sm text-lime-deep">{success}</p>
          ) : null}
        </>
      )}
    </article>
  );
}
