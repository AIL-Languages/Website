import { CreateUserForm } from "@/components/dashboard/CreateUserForm";
import { ReportsEntryCard } from "@/components/dashboard/ReportsEntryCard";
import { optionLabel, programs } from "@/lib/academic/options";
import type { PublicUser } from "@/lib/auth/types";

type Props = {
  user: PublicUser;
  students: PublicUser[];
};

export function CompanyPanel({ user, students }: Props) {
  return (
    <section className="mt-10 space-y-6">
      <div className="rounded-[1.75rem] bg-navy p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
          Empresa / Corporativo
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          {user.details.companyLegalName || user.name}
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-white/75">
          Administra los alumnos de tu empresa y consulta la información del
          servicio contratado.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-[1.5rem] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Programa contratado
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-navy">
            {optionLabel(programs, user.details.program)}
          </p>
        </article>
        <article className="rounded-[1.5rem] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Alumnos contratados
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-navy">
            {user.details.studentCount || "—"}
          </p>
        </article>
        <article className="rounded-[1.5rem] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Alumnos registrados
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-navy">
            {students.length}
          </p>
        </article>
      </div>

      <ReportsEntryCard />

      <div className="rounded-[1.75rem] bg-white p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-navy">
          Registrar alumno de la empresa
        </h3>
        <div className="mt-6">
          <CreateUserForm allowedRoles={["student"]} />
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] bg-white">
        <div className="border-b border-navy/8 px-6 py-4">
          <h3 className="font-display text-lg font-semibold text-navy">
            Alumnos de la empresa
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-mist text-muted">
              <tr>
                <th className="px-6 py-3 font-semibold">Nombre</th>
                <th className="px-6 py-3 font-semibold">Correo</th>
                <th className="px-6 py-3 font-semibold">Idioma</th>
                <th className="px-6 py-3 font-semibold">Nivel</th>
              </tr>
            </thead>
            <tbody>
              {students.map((item) => (
                <tr key={item.id} className="border-t border-navy/8">
                  <td className="px-6 py-3">{item.name}</td>
                  <td className="px-6 py-3">{item.email}</td>
                  <td className="px-6 py-3">{item.details.language || "—"}</td>
                  <td className="px-6 py-3">{item.details.level || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
