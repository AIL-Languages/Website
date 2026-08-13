"use client";

import { CreateUserWithWelcome } from "@/components/dashboard/CreateUserWithWelcome";
import { languages, levels } from "@/lib/academic/options";
import type { AcademicFollowUp, AcademicGroup } from "@/lib/academic/types";
import { roleLabel } from "@/lib/auth/admin";
import type { PublicUser } from "@/lib/auth/types";

type Props = {
  users: PublicUser[];
  groups: AcademicGroup[];
  followUps: AcademicFollowUp[];
  allowCreate?: boolean;
  showPeople?: boolean;
  variant?: "coordinator" | "admin";
};

function PeopleTable({ title, people }: { title: string; people: PublicUser[] }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_40px_rgba(0,26,61,0.06)]">
      <div className="border-b border-navy/8 px-6 py-4">
        <h3 className="font-display text-lg font-semibold text-navy">
          {title} ({people.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-mist text-muted">
            <tr>
              <th className="px-6 py-3 font-semibold">Nombre</th>
              <th className="px-6 py-3 font-semibold">Correo</th>
              <th className="px-6 py-3 font-semibold">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {people.map((item) => (
              <tr key={item.id} className="border-t border-navy/8">
                <td className="px-6 py-3 text-ink">{item.name}</td>
                <td className="px-6 py-3 text-ink">{item.email}</td>
                <td className="px-6 py-3 text-muted">
                  {item.details.language ||
                    item.details.languagesTaught ||
                    item.details.companyLegalName ||
                    roleLabel(item.role)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CoordinatorPanel({
  users,
  groups,
  followUps,
  allowCreate = true,
  showPeople = true,
  variant = "coordinator",
}: Props) {
  const students = users.filter((user) => user.role === "student");
  const teachers = users.filter((user) => user.role === "teacher");
  const isAdminView = variant === "admin";

  return (
    <section className="mt-10 space-y-6">
      <div className="rounded-[1.75rem] bg-navy p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
          Coordinación académica
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Gestión operativa
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-white/75">
          {isAdminView
            ? "Supervisa grupos, horarios, niveles y seguimiento académico, además del resto del sistema."
            : "Acceso a alumnos, profesores, grupos, horarios, niveles y seguimiento. Sin configuración sensible, finanzas ni administración del sistema."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Alumnos", students.length],
          ["Profesores", teachers.length],
          ["Grupos", groups.length],
          ["Seguimientos", followUps.length],
        ].map(([label, value]) => (
          <article key={String(label)} className="rounded-[1.5rem] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-navy">{value}</p>
          </article>
        ))}
      </div>

      {allowCreate ? (
        <div className="rounded-[1.75rem] bg-white p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold text-navy">
            Alta operativa
          </h3>
          <p className="mt-2 text-sm text-muted">
            Crea cuentas de alumnos o profesores.
          </p>
          <div className="mt-6">
            <CreateUserWithWelcome allowedRoles={["student", "teacher"]} />
          </div>
        </div>
      ) : null}

      {showPeople ? (
        <>
          <PeopleTable title="Alumnos" people={students} />
          <PeopleTable title="Profesores" people={teachers} />
        </>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.75rem] bg-white p-6">
          <h3 className="font-display text-xl font-semibold text-navy">Grupos y horarios</h3>
          <form
            className="mt-4 space-y-3"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const data = new FormData(form);
              await fetch("/api/academic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.fromEntries(data.entries())),
              });
              window.location.reload();
            }}
          >
            <input name="name" required placeholder="Nombre del grupo" className="w-full rounded-xl border border-navy/10 px-4 py-3" />
            <select name="language" required className="w-full rounded-xl border border-navy/10 px-4 py-3">
              {languages.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <select name="level" required className="w-full rounded-xl border border-navy/10 px-4 py-3">
              {levels.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input name="teacher" placeholder="Profesor" className="w-full rounded-xl border border-navy/10 px-4 py-3" />
            <input name="schedule" required placeholder="Horario, ej. Lun-Mié 18:00" className="w-full rounded-xl border border-navy/10 px-4 py-3" />
            <button className="rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep">
              Crear grupo
            </button>
          </form>
          <ul className="mt-5 space-y-2 text-sm text-muted">
            {groups.map((group) => (
              <li key={group.id}>
                <strong className="text-ink">{group.name}</strong> · {group.language} {group.level} · {group.schedule}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[1.75rem] bg-white p-6">
          <h3 className="font-display text-xl font-semibold text-navy">Seguimiento académico</h3>
          <form
            className="mt-4 space-y-3"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const data = new FormData(form);
              await fetch("/api/academic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "followup", ...Object.fromEntries(data.entries()) }),
              });
              window.location.reload();
            }}
          >
            <input name="studentName" required placeholder="Nombre del alumno" className="w-full rounded-xl border border-navy/10 px-4 py-3" />
            <textarea name="notes" required placeholder="Avance, asistencia o área de oportunidad" className="w-full rounded-xl border border-navy/10 px-4 py-3" rows={4} />
            <button className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white">
              Registrar seguimiento
            </button>
          </form>
          <ul className="mt-5 space-y-3 text-sm text-muted">
            {followUps.map((item) => (
              <li key={item.id}>
                <strong className="text-ink">{item.studentName}</strong>
                <p>{item.notes}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
