import Link from "next/link";
import { SmrtLogoOnDark } from "@/components/dashboard/SmrtLogo";
import {
  bilingualTracks,
  coordinationWhatsappHref,
  courseCatalog,
  learningTools,
  skills,
} from "@/lib/smrt";
import { site } from "@/lib/site";

const sectionClass = "scroll-mt-28 rounded-[1.75rem] bg-white p-6 sm:p-8";

export function SmrtStudentGuide() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-navy px-6 py-8 text-white sm:px-10">
        <SmrtLogoOnDark className="h-10 w-auto" height={40} />
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-lime">
          Guía del alumno
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold">
          Cómo usar Smrt English en AIL
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/75">
          Recursos y guía de uso. No es un manual administrativo: es tu
          onboarding para aprovechar la plataforma 24/7 junto con tus clases.
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
          <a
            href={site.smrtStudentGuidePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Abrir PDF original
          </a>
          <Link
            href="/dashboard/smrt-english"
            className="inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-cyan-soft"
          >
            ← Volver
          </Link>
        </div>
      </section>

      <section id="primeros-pasos" className={sectionClass}>
        <h2 className="font-display text-2xl font-semibold text-navy">
          🚀 Primeros pasos
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Entra con el acceso de AIL:{" "}
          <a
            href={site.smrtAccessUrl}
            className="font-semibold text-cyan"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.smrtenglish.com/ail
          </a>
          . Ahí encontrarás tus cursos, la biblioteca y las pestañas de
          Assignments y Assessments.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-mist/80 p-5">
            <p className="font-semibold text-navy">Requisitos</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Acceso obligatorio de mínimo 1 hora semanal.</li>
              <li>
                Si hay inactividad, la cuenta puede bloquearse automáticamente.
              </li>
              <li>
                Para recuperarla, reporta el caso a Coordinación Académica.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl bg-mist/80 p-5">
            <p className="font-semibold text-navy">Beneficios</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Acceso 24/7, sin límite a contenidos.</li>
              <li>Ejercicios de Listening, Speaking, Reading y Writing.</li>
              <li>Vocabulario, gramática y más recursos de práctica.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="cursos" className={sectionClass}>
        <h2 className="font-display text-2xl font-semibold text-navy">
          📚 Cursos y biblioteca
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          La biblioteca ofrece acceso a más de 60 cursos de distintos niveles y
          temáticas. En Library / Courses puedes elegir el contenido según tu
          interés o el programa que te asigne tu profesor.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {courseCatalog.map((item) => (
            <span
              key={item}
              className="rounded-full border border-navy/10 bg-mist px-3 py-1.5 text-xs font-semibold text-navy"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="mt-6 text-sm font-semibold text-navy">Cursos bilingües</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {bilingualTracks.map((item) => (
            <span
              key={item}
              className="rounded-full bg-navy px-3 py-1.5 text-xs font-semibold text-white"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div>
            <p className="font-semibold text-navy">Diccionarios</p>
            <p className="mt-2 text-sm text-muted">
              {learningTools.dictionaries.join(" · ")}
            </p>
          </div>
          <div>
            <p className="font-semibold text-navy">Noticias internacionales</p>
            <p className="mt-2 text-sm text-muted">{learningTools.news.join(" · ")}</p>
          </div>
          <div>
            <p className="font-semibold text-navy">Videos educacionales</p>
            <p className="mt-2 text-sm text-muted">
              {learningTools.videos.join(" · ")}
            </p>
          </div>
          <div>
            <p className="font-semibold text-navy">Herramientas de aprendizaje</p>
            <p className="mt-2 text-sm text-muted">{learningTools.tools.join(" · ")}</p>
          </div>
        </div>
      </section>

      <section id="lecciones" className={sectionClass}>
        <h2 className="font-display text-2xl font-semibold text-navy">
          ✏️ Lecciones y ejercicios
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          La página de inicio o <strong>Cafe</strong> muestra artículos y videos
          para practicar comprensión auditiva. Puedes filtrar por palabras de
          interés y tipo de ejercicio.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Las lecciones explican el tema por secciones, con imágenes
          interactivas y dinámicas. Al entrar a tu clase verás los contenidos
          divididos para practicar cada habilidad:
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.map((item) => (
            <span
              key={item}
              className="rounded-full bg-cyan/15 px-3 py-1.5 text-sm font-semibold text-navy"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-mist/80 p-5 text-sm text-muted">
          Al final de cada lección hay ejercicios para practicar lo aprendido.
          La plataforma revisa ortografía y puntuación —clave para mejorar
          Writing— y te muestra los resultados al instante cuando envías tu
          trabajo, para que detectes, aprendas y corrijas tus propios errores.
        </div>
      </section>

      <section id="assignments" className={sectionClass}>
        <h2 className="font-display text-2xl font-semibold text-navy">
          📋 Assignments
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          En la pestaña <strong>Assignments</strong> verás la lista de ejercicios
          disponibles y los que tu profesor te asignó (incluidos exámenes).
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>Consulta las actividades asignadas para tu clase.</li>
          <li>Revisa tus resultados de cada actividad.</li>
          <li>Confirma si tu profesor ya realizó la revisión.</li>
        </ul>
        <p className="mt-4 text-sm text-muted">
          Los ejercicios suelen revisarse al final de la semana. Mantén contacto
          con tu maestro para fechas de entrega.
        </p>
      </section>

      <section id="assessments" className={sectionClass}>
        <h2 className="font-display text-2xl font-semibold text-navy">
          🎯 Assessments
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Cuando tu profesor asigne una evaluación al final de una unidad,
          aparecerá un aviso en <strong>Assessments</strong>. Alumnos y
          profesores pueden ver los resultados para corregir errores y seguir
          mejorando.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-mist/80 p-5">
            <p className="font-semibold text-navy">Por unidad y por nivel</p>
            <p className="mt-2 text-sm text-muted">
              Cada unidad tiene un examen de avance. Cada nivel tiene un examen
              final de las 4 habilidades principales: Listening, Reading,
              Grammar y Writing.
            </p>
          </div>
          <div className="rounded-2xl bg-mist/80 p-5">
            <p className="font-semibold text-navy">Speaking</p>
            <p className="mt-2 text-sm text-muted">
              La habilidad oral se evalúa directamente con tu profesor durante
              la clase, no solo en la plataforma.
            </p>
          </div>
        </div>
      </section>

      <section id="ayuda" className={sectionClass}>
        <h2 className="font-display text-2xl font-semibold text-navy">
          ❓ ¿Necesitas ayuda?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Recuerda: pedimos mínimo 1 hora semanal en la plataforma para un
          progreso académico notable. Si tienes dudas o tu cuenta se bloqueó,
          contacta a Coordinación Académica.
        </p>
        <p className="mt-4 font-semibold text-navy">
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
