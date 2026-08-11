import { detailRows } from "@/lib/academic/details";
import { listGroups } from "@/lib/academic/store";
import { canCoordinate, roleLabel } from "@/lib/auth/admin";
import { requireProfile } from "@/lib/auth/profile";
import Link from "next/link";

export const metadata = {
  title: "Mis clases",
};

export default async function ClassesPage() {
  const user = await requireProfile();
  const academic = detailRows(user.role, user.details);
  const groups = canCoordinate(user.role, user.email) ? await listGroups() : [];

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] bg-navy px-6 py-8 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
          Mis clases
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold">
          Tu espacio académico
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/75">
          Perfil: {roleLabel(user.role)}. Complementa cada clase con práctica en
          Smrt English.
        </p>
      </section>

      {academic.length ? (
        <section className="rounded-[1.75rem] bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-navy">
            Datos de tu programa
          </h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {academic.map((row) => (
              <div key={row.label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {row.label}
                </dt>
                <dd className="mt-1 text-sm text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {groups.length ? (
        <section className="rounded-[1.75rem] bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-navy">Grupos</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {groups.map((group) => (
              <li key={group.id}>
                <strong className="text-ink">{group.name}</strong> · {group.language}{" "}
                {group.level} · {group.schedule}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="rounded-[1.75rem] bg-white p-6 text-sm text-muted">
          El detalle de grupos y horarios se coordina con AIL. Mientras tanto,
          usa Smrt English para continuar tu práctica.
          <div className="mt-4">
            <Link
              href="/dashboard/smrt-english"
              className="font-semibold text-cyan"
            >
              Abrir Smrt English →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
