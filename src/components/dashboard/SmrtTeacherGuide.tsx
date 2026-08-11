import Link from "next/link";
import { SmrtLogoOnDark } from "@/components/dashboard/SmrtLogo";
import { coordinationWhatsappHref, skills } from "@/lib/smrt";
import { site } from "@/lib/site";

const sectionClass = "scroll-mt-28 rounded-[1.75rem] bg-white p-6 sm:p-8";

export function SmrtTeacherGuide() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-navy px-6 py-8 text-white sm:px-10">
        <SmrtLogoOnDark className="h-10 w-auto" height={40} />
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-lime">
          Guía del profesor
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold">
          Gestiona clases, actividades y avance en Smrt
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/75">
          Vista docente de Smrt English dentro de AIL. La guía completa para
          profesores se publicará aquí cuando esté lista. Este adelanto cubre
          lo esencial para operar con tus grupos.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={site.smrtAccessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep"
          >
            Acceder a Smrt English
          </a>
          <Link
            href="/dashboard/smrt-english"
            className="inline-flex rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white"
          >
            ← Volver
          </Link>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-cyan/30 bg-white p-6">
        <p className="text-sm font-semibold text-navy">Pendiente</p>
        <p className="mt-2 text-sm text-muted">
          Recibiremos una guía específica para profesores. No reutilizamos el
          PDF de alumnos porque está escrito desde la perspectiva del
          estudiante (“tu maestro”, “tus resultados”, etc.).
        </p>
      </section>

      <section id="primeros-pasos" className={sectionClass}>
        <h2 className="font-display text-2xl font-semibold text-navy">
          🚀 Primeros pasos
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Accede en{" "}
          <a
            href={site.smrtAccessUrl}
            className="font-semibold text-cyan"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.smrtenglish.com/ail
          </a>
          . Recuerda a tus alumnos el mínimo de 1 hora semanal: la inactividad
          puede bloquear su cuenta y Coordinación Académica debe reactivar el
          acceso.
        </p>
      </section>

      <section id="cursos" className={sectionClass}>
        <h2 className="font-display text-2xl font-semibold text-navy">
          📚 Cursos y biblioteca
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Hay más de 60 cursos (Adults, Youth, Kids, Business, IELTS, TOEFL,
          bilingües y más). Usa la biblioteca para elegir materiales alineados
          al programa de cada grupo.
        </p>
      </section>

      <section id="lecciones" className={sectionClass}>
        <h2 className="font-display text-2xl font-semibold text-navy">
          ✏️ Lecciones y ejercicios
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Cada unidad se divide por habilidades. La plataforma corrige
          ortografía y puntuación y muestra resultados al instante cuando el
          alumno envía el ejercicio.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((item) => (
            <span
              key={item}
              className="rounded-full bg-cyan/15 px-3 py-1.5 text-sm font-semibold text-navy"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section id="assignments" className={sectionClass}>
        <h2 className="font-display text-2xl font-semibold text-navy">
          📋 Assignments
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Asigna actividades desde Assignments. El alumno ve la lista, tus
          asignaciones y si ya revisaste el trabajo. Los ejercicios suelen
          revisarse al final de la semana: comunica fechas de entrega con
          claridad.
        </p>
      </section>

      <section id="assessments" className={sectionClass}>
        <h2 className="font-display text-2xl font-semibold text-navy">
          🎯 Assessments
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Al asignar una evaluación de unidad, el alumno ve el aviso en
          Assessments. Ambos pueden consultar resultados. El examen de nivel
          cubre Listening, Reading, Grammar y Writing; Speaking se evalúa
          contigo en clase.
        </p>
      </section>

      <section id="ayuda" className={sectionClass}>
        <h2 className="font-display text-2xl font-semibold text-navy">
          ❓ ¿Necesitas ayuda?
        </h2>
        <p className="mt-3 text-sm text-muted">
          Coordinación Académica: {site.coordinationPhoneDisplay}
        </p>
        <a
          href={coordinationWhatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-navy-deep"
        >
          Escribir a Coordinación
        </a>
      </section>
    </div>
  );
}
