import { listGroups } from "@/lib/academic/store";
import { canCoordinate } from "@/lib/auth/admin";
import { requireProfile } from "@/lib/auth/profile";
import Link from "next/link";

export const metadata = {
  title: "Calendario",
};

export default async function CalendarPage() {
  const user = await requireProfile();
  const groups = canCoordinate(user.role, user.email) ? await listGroups() : [];

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] bg-navy px-6 py-8 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
          Calendario
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold">Horarios y entregas</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/75">
          Las clases en vivo se coordinan con AIL. En Smrt, los ejercicios
          suelen revisarse al final de la semana.
        </p>
      </section>

      {groups.length ? (
        <section className="rounded-[1.75rem] bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-navy">
            Grupos programados
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {groups.map((group) => (
              <li key={group.id}>
                <strong className="text-ink">{group.schedule}</strong> · {group.name}{" "}
                · {group.language} {group.level}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="rounded-[1.75rem] bg-white p-6 text-sm text-muted">
          Cuando tu horario quede confirmado aparecerá aquí. Dedica al menos 1
          hora semanal a Smrt English entre clase y clase.
          <div className="mt-4">
            <Link href="/dashboard/smrt-english" className="font-semibold text-cyan">
              Ver guía Smrt English →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
