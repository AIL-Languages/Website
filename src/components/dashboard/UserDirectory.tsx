"use client";

import { useMemo, useState } from "react";
import { roleLabel, type UserRole } from "@/lib/auth/admin";
import type { PublicUser } from "@/lib/auth/types";

const filters: { value: "all" | UserRole; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "student", label: "Alumnos" },
  { value: "teacher", label: "Profesores" },
  { value: "coordinator", label: "Coordinación" },
  { value: "company", label: "Empresas" },
  { value: "admin", label: "Admin" },
];

type Props = {
  users: PublicUser[];
  allowedRoles?: UserRole[];
};

export function UserDirectory({ users, allowedRoles }: Props) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"all" | UserRole>("all");

  const visible = useMemo(() => {
    const source = allowedRoles
      ? users.filter((user) => allowedRoles.includes(user.role))
      : users;
    const q = query.trim().toLowerCase();
    return source.filter((user) => {
      if (role !== "all" && user.role !== role) return false;
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.phone ?? "").includes(q)
      );
    });
  }, [allowedRoles, query, role, users]);

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-white">
      <div className="flex flex-col gap-3 border-b border-navy/8 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-display text-lg font-semibold text-navy">
          Directorio ({visible.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar nombre, correo o teléfono"
            className="rounded-full border border-navy/10 px-4 py-2 text-sm outline-none focus:border-cyan"
          />
          {!allowedRoles ? (
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as "all" | UserRole)}
              className="rounded-full border border-navy/10 px-4 py-2 text-sm"
            >
              {filters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-mist text-muted">
            <tr>
              <th className="px-6 py-3 font-semibold">Nombre</th>
              <th className="px-6 py-3 font-semibold">Correo</th>
              <th className="px-6 py-3 font-semibold">Teléfono</th>
              <th className="px-6 py-3 font-semibold">Perfil</th>
              <th className="px-6 py-3 font-semibold">Detalle</th>
              <th className="px-6 py-3 font-semibold">Alta</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id} className="border-t border-navy/8">
                <td className="px-6 py-3">{item.name}</td>
                <td className="px-6 py-3">{item.email}</td>
                <td className="px-6 py-3">{item.phone || item.details.contactPhone || "—"}</td>
                <td className="px-6 py-3">{roleLabel(item.role)}</td>
                <td className="px-6 py-3 text-muted">
                  {item.details.language ||
                    item.details.languagesTaught ||
                    item.details.companyLegalName ||
                    item.details.status ||
                    "—"}
                </td>
                <td className="px-6 py-3 text-muted">
                  {new Date(item.createdAt).toLocaleDateString("es-MX")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
