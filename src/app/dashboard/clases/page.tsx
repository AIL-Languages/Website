import { StudentClassesPanel } from "@/components/scheduling/StudentClassesPanel";
import {
  languages,
  levels,
  optionLabel,
  plans,
} from "@/lib/academic/options";
import { listGroups } from "@/lib/academic/store";
import { canCoordinate, roleLabel } from "@/lib/auth/admin";
import { getProfileById, requireProfile } from "@/lib/auth/profile";
import { resolveCalendlyUrl } from "@/lib/scheduling/calendly";
import {
  getPolicies,
  getRoomForStudent,
  listClasses,
  pastClasses,
  upcomingClasses,
} from "@/lib/scheduling/store";
import Link from "next/link";

export const metadata = {
  title: "Mis clases",
};

export default async function ClassesPage() {
  const user = await requireProfile();
  const groups = canCoordinate(user.role, user.email) ? await listGroups() : [];

  if (user.role === "student") {
    const classes = await listClasses({ studentId: user.id });
    const upcoming = upcomingClasses(classes);
    const history = pastClasses(classes).reverse();
    const room = await getRoomForStudent(user.id);
    const policies = await getPolicies();
    const teacher = user.details.teacherId
      ? await getProfileById(user.details.teacherId)
      : null;
    const calendlyUrl = await resolveCalendlyUrl(teacher?.details.calendlyUrl);
    const used = Number(user.details.classesUsed || history.filter((item) => item.status === "completed").length || 0);
    const total = Number(user.details.classesTotal || 12);

    return (
      <main className="space-y-6">
        <section className="rounded-[2rem] bg-navy px-6 py-8 text-white sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
            Mis clases
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold">
            Tu agenda académica AIL
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75">
            Consulta tu curso, agenda sesiones y entra a tu aula virtual desde un
            solo lugar.
          </p>
        </section>

        <StudentClassesPanel
          course={{
            language: optionLabel(languages, user.details.language),
            level: optionLabel(levels, user.details.level),
            teacher: user.details.teacher || teacher?.name || "Por asignar",
            plan: optionLabel(plans, user.details.plan),
            used,
            total,
            hasTeacher: Boolean(user.details.teacherId || user.details.teacher),
          }}
          upcoming={upcoming}
          history={history}
          room={
            room
              ? {
                  ...room,
                  encryptedHostUrl: undefined,
                }
              : null
          }
          calendlyUrl={calendlyUrl}
          policies={{
            cancellationLimitHours: policies.cancellationLimitHours,
            rescheduleLimitHours: policies.rescheduleLimitHours,
            noShowPolicy: policies.noShowPolicy,
          }}
          timezone={user.details.timezone || policies.defaultTimezone}
        />
      </main>
    );
  }

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
          Perfil: {roleLabel(user.role)}.
        </p>
      </section>

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
          Usa <Link href="/dashboard/asignacion" className="font-semibold text-cyan">Asignación académica</Link>{" "}
          para el match alumno–profesor, o{" "}
          <Link href="/dashboard/coordinacion" className="font-semibold text-cyan">
            Coordinación
          </Link>{" "}
          para grupos y horarios.
        </section>
      )}
    </main>
  );
}
