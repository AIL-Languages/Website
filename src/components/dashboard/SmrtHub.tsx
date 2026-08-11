import Link from "next/link";
import { SmrtLogoOnDark } from "@/components/dashboard/SmrtLogo";
import { SmrtReminderCard } from "@/components/dashboard/SmrtReminderCard";
import type { UserRole } from "@/lib/auth/admin";
import { site } from "@/lib/site";
import {
  smrtGuideForRole,
  smrtHubCards,
  smrtTeacherCards,
  usesStudentSmrtExperience,
} from "@/lib/smrt";

type Props = {
  role: UserRole;
  name: string;
};

export function SmrtHub({ role, name }: Props) {
  const guide = smrtGuideForRole(role);
  const studentLike = usesStudentSmrtExperience(role);
  const staff = role === "admin" || role === "coordinator";
  const cards = guide === "teacher" ? smrtTeacherCards : smrtHubCards;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-navy px-6 py-8 text-white sm:px-10">
        <SmrtLogoOnDark className="h-12 w-auto" height={48} />
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-lime">
          🎓 Smrt English
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Tu plataforma de aprendizaje y práctica
        </h1>
        <p className="mt-3 max-w-2xl text-white/75">
          Aprende a utilizar Smrt English y aprovecha todos los recursos
          disponibles para complementar tus clases en {site.name}. Acceso 24/7
          a contenidos y ejercicios de distintas habilidades.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={site.smrtAccessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-navy-deep transition hover:bg-cyan-bright"
          >
            Acceder a Smrt English
          </a>
          <Link
            href={
              guide === "teacher"
                ? "/dashboard/smrt-english/guia/profesor"
                : "/dashboard/smrt-english/guia/alumno"
            }
            className="inline-flex rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Ver guía completa
          </Link>
        </div>
      </section>

      {guide === "teacher" ? (
        <article className="rounded-[1.5rem] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan">
            Perfil profesor
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-navy">
            Guía Smrt English para profesores
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Aprende a gestionar tus clases, asignar actividades y evaluaciones,
            revisar ejercicios y consultar el progreso de tus alumnos. Hola,{" "}
            {name.split(" ")[0]}.
          </p>
          <p className="mt-3 text-sm text-muted">
            La guía detallada para docentes se publicará aquí. Mientras tanto,
            tienes un adelanto operativo y el acceso a la plataforma.
          </p>
        </article>
      ) : (
        <article className="rounded-[1.5rem] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan">
            {role === "company" ? "Perfil empresa / corporativo" : "Perfil alumno"}
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-navy">
            Guía Smrt English para alumnos
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            {role === "company"
              ? "Tus colaboradores usan Smrt English como alumnos: acceden a cursos, realizan ejercicios y consultan Assignments y Assessments."
              : "Aprende a utilizar tu plataforma, acceder a tus cursos, realizar ejercicios, consultar Assignments y Assessments y revisar tus resultados."}
          </p>
        </article>
      )}

      {staff ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/dashboard/smrt-english/guia/alumno"
            className="rounded-[1.5rem] bg-white p-6 transition hover:ring-2 hover:ring-cyan/40"
          >
            <p className="text-sm font-semibold text-navy">👩‍🎓 Guía del alumno</p>
            <p className="mt-2 text-sm text-muted">
              Onboarding interactivo basado en la guía oficial de AIL.
            </p>
          </Link>
          <Link
            href="/dashboard/smrt-english/guia/profesor"
            className="rounded-[1.5rem] bg-white p-6 transition hover:ring-2 hover:ring-cyan/40"
          >
            <p className="text-sm font-semibold text-navy">👩‍🏫 Guía del profesor</p>
            <p className="mt-2 text-sm text-muted">
              Vista docente. La guía completa se agregará cuando esté lista.
            </p>
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={`/dashboard/smrt-english/guia/${guide === "teacher" ? "profesor" : "alumno"}#${card.id}`}
            className="rounded-[1.5rem] bg-white p-6 transition hover:ring-2 hover:ring-cyan/40"
          >
            <p className="text-2xl">{card.emoji}</p>
            <h3 className="mt-3 font-display text-lg font-semibold text-navy">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{card.text}</p>
          </Link>
        ))}
      </div>

      {studentLike || role === "teacher" ? <SmrtReminderCard /> : null}
    </div>
  );
}
