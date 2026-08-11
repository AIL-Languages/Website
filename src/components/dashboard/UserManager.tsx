"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CreateUserForm } from "@/components/dashboard/CreateUserForm";
import { roleLabel, type PublicProfileRole, type UserRole } from "@/lib/auth/admin";
import { languages, optionLabel } from "@/lib/academic/options";
import type { PublicUser } from "@/lib/auth/types";

type Filter = "all" | PublicProfileRole | "activo" | "inactivo";

type Props = {
  users: PublicUser[];
  allowedRoles?: PublicProfileRole[];
};

export function UserManager({ users, allowedRoles }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openCreate, setOpenCreate] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      if (allowedRoles && !allowedRoles.includes(user.role as PublicProfileRole)) {
        return false;
      }
      if (filter === "activo" || filter === "inactivo") {
        if (user.accountStatus !== filter) return false;
      } else if (filter !== "all" && user.role !== filter) {
        return false;
      }
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.phone ?? "").includes(q)
      );
    });
  }, [allowedRoles, filter, query, users]);

  const chips = (
    [
      { value: "all", label: "Todos" },
      { value: "student", label: "Alumnos" },
      { value: "teacher", label: "Profesores" },
      { value: "coordinator", label: "Coordinación" },
      { value: "company", label: "Empresas" },
      { value: "activo", label: "Activos" },
      { value: "inactivo", label: "Inactivos" },
    ] as { value: Filter; label: string }[]
  ).filter((item) => {
    if (!allowedRoles) return true;
    if (item.value === "all" || item.value === "activo" || item.value === "inactivo") {
      return true;
    }
    return allowedRoles.includes(item.value as PublicProfileRole);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpenCreate((value) => !value)}
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          {openCreate ? "Cerrar alta" : "+ Agregar usuario"}
        </button>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar 🔎"
          className="min-w-[220px] flex-1 rounded-full border border-navy/10 px-4 py-2.5 text-sm outline-none focus:border-cyan"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              filter === item.value
                ? "bg-navy text-white"
                : "bg-white text-navy"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {openCreate ? (
        <div className="rounded-[1.75rem] bg-white p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold text-navy">
            Nueva cuenta de acceso
          </h3>
          <p className="mt-2 text-sm text-muted">
            Aquí se crea quién puede entrar al sistema. La operación académica
            se gestiona en Coordinación.
          </p>
          <div className="mt-6">
            <CreateUserForm allowedRoles={allowedRoles} />
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[1.75rem] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-mist text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Usuario</th>
                <th className="px-5 py-3 font-semibold">Perfil</th>
                <th className="px-5 py-3 font-semibold">Correo</th>
                <th className="px-5 py-3 font-semibold">Idioma</th>
                <th className="px-5 py-3 font-semibold">Estatus</th>
                <th className="px-5 py-3 font-semibold">Último acceso</th>
                <th className="px-5 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((user) => (
                <tr key={user.id} className="border-t border-navy/8">
                  <td className="px-5 py-3 font-medium text-ink">{user.name}</td>
                  <td className="px-5 py-3">{roleLabel(user.role as UserRole)}</td>
                  <td className="px-5 py-3">{user.email}</td>
                  <td className="px-5 py-3 text-muted">
                    {optionLabel(languages, user.details.language) !== "—"
                      ? optionLabel(languages, user.details.language)
                      : user.details.languagesTaught || "—"}
                  </td>
                  <td className="px-5 py-3">
                    {user.accountStatus === "activo" ? "🟢 Activo" : "⚪ Inactivo"}
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {user.lastAccess
                      ? new Date(user.lastAccess).toLocaleDateString("es-MX")
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/dashboard/usuarios/${user.id}`}
                      className="font-semibold text-cyan"
                    >
                      Ver · Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
