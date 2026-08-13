"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RoleFields } from "@/components/auth/RoleFields";
import { WelcomeEmailModal } from "@/components/dashboard/WelcomeEmailModal";
import { detailsFromForm } from "@/lib/academic/details";
import {
  isSoleAdminEmail,
  roleLabel,
  type PublicProfileRole,
} from "@/lib/auth/admin";
import type { PublicUser } from "@/lib/auth/types";

const fieldClass =
  "mt-2 w-full rounded-xl border border-navy/10 px-4 py-3 outline-none focus:border-cyan";

type Props = {
  user: PublicUser;
  canDelete: boolean;
  canResetPassword: boolean;
};

export function UserAccountForm({ user, canDelete, canResetPassword }: Props) {
  const router = useRouter();
  const [role, setRole] = useState<PublicProfileRole>(
    user.role === "admin" ? "student" : user.role,
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const locked = isSoleAdminEmail(user.email);

  async function patch(body: Record<string, unknown>) {
    const response = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || "No se pudo guardar.");
    }
  }

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      await patch({
        name: form.get("name"),
        phone: form.get("phone"),
        role,
        accountStatus: form.get("accountStatus"),
        details: detailsFromForm(form, user.details),
      });
      setMessage("Cuenta actualizada.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    }
  }

  async function onPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    const response = await fetch(`/api/users/${user.id}/password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const payload = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !payload.ok) {
      setError(payload.error || "No se pudo cambiar la contraseña.");
      return;
    }
    setMessage("Contraseña restablecida.");
    event.currentTarget.reset();
  }

  async function onDelete() {
    if (!confirm("¿Eliminar esta cuenta de forma permanente?")) return;
    const response = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    const payload = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !payload.ok) {
      setError(payload.error || "No se pudo eliminar.");
      return;
    }
    router.push("/dashboard/usuarios");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSave} className="rounded-[1.75rem] bg-white p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-xl font-semibold text-navy">Editar cuenta</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Nombre
            <input name="name" defaultValue={user.name} required className={fieldClass} />
          </label>
          <label className="text-sm font-medium">
            Correo
            <input defaultValue={user.email} disabled className={`${fieldClass} opacity-70`} />
          </label>
          <label className="text-sm font-medium">
            Teléfono
            <input name="phone" defaultValue={user.phone ?? ""} className={fieldClass} />
          </label>
          <label className="text-sm font-medium">
            Perfil
            <select
              value={role}
              disabled={locked}
              onChange={(event) => setRole(event.target.value as PublicProfileRole)}
              className={fieldClass}
            >
              {(["student", "teacher", "coordinator", "company"] as const).map((item) => (
                <option key={item} value={item}>
                  {roleLabel(item)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Estatus de acceso
            <select
              name="accountStatus"
              defaultValue={user.accountStatus}
              disabled={locked}
              className={fieldClass}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Suspendido / inactivo</option>
            </select>
          </label>
        </div>
        {user.role !== "admin" ? (
          <div className="rounded-2xl border border-navy/10 p-4">
            <RoleFields key={role} role={role} details={user.details} />
          </div>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-lime-deep">{message}</p> : null}
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white">
            Guardar cambios
          </button>
          {user.role !== "admin" ? (
            <button
              type="button"
              onClick={() => setWelcomeOpen(true)}
              className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy"
            >
              Editar y enviar bienvenida
            </button>
          ) : null}
        </div>
      </form>

      {canResetPassword ? (
      <form onSubmit={onPassword} className="rounded-[1.75rem] bg-white p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-xl font-semibold text-navy">
          Restablecer contraseña
        </h2>
        <label className="block text-sm font-medium">
          Nueva contraseña temporal
          <input name="password" type="password" minLength={8} required className={fieldClass} />
        </label>
        <button className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy">
          Cambiar contraseña
        </button>
      </form>
      ) : null}

      <WelcomeEmailModal
        open={welcomeOpen}
        recipient={
          user.role === "admin"
            ? null
            : {
                name: user.name,
                email: user.email,
                role,
              }
        }
        onClose={() => setWelcomeOpen(false)}
      />

      {canDelete && !locked ? (
        <div className="rounded-[1.75rem] bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-navy">Eliminar</h2>
          <p className="mt-2 text-sm text-muted">
            Quita la cuenta de acceso. No borra historial académico o de pagos.
          </p>
          <button
            type="button"
            onClick={onDelete}
            className="mt-4 rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700"
          >
            Eliminar usuario
          </button>
        </div>
      ) : null}
    </div>
  );
}
