"use client";

import {
  IconAward,
  IconCalendarDays,
  IconClipboardList,
  IconExternalLink,
  IconFileText,
  IconGraduationCap,
  IconLanguages,
  IconUserCheck,
} from "@/components/director/icons";
import {
  TEACHER_APPLICATION_FORM_URL,
  teacherApplicationRequirements,
  teacherSelectionSteps,
  trackTeacherApplicationClick,
} from "@/lib/recruitment";

const requirementIcons = {
  file: IconFileText,
  award: IconAward,
  graduation: IconGraduationCap,
  userCheck: IconUserCheck,
  calendar: IconCalendarDays,
  languages: IconLanguages,
} as const;

type Props = {
  compact?: boolean;
};

export function TeacherApplicationPanel({ compact = false }: Props) {
  return (
    <div className={compact ? "space-y-6" : "space-y-8"}>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ail-cyan">
          Reclutamiento docente
        </p>
        <h2
          className={`mt-2 font-display font-bold text-ink ${
            compact ? "text-2xl" : "text-3xl sm:text-4xl"
          }`}
        >
          Forma parte del equipo docente de AIL
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          Nuestro proceso de selección inicia con un formulario de aplicación que nos
          permite conocer tu perfil académico, experiencia docente, disponibilidad y
          dominio del idioma que deseas impartir.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-navy/10 bg-mist/50 p-6 sm:p-7">
          <h3 className="font-display text-lg font-semibold text-ink">
            Para iniciar tu aplicación necesitarás
          </h3>
          <ul className="mt-5 space-y-4">
            {teacherApplicationRequirements.map((item) => {
              const Icon = requirementIcons[item.icon];
              return (
                <li key={item.id} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ail-cyan/30 bg-ail-cyan/10 text-ail-cyan">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
                      {item.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 rounded-2xl border border-ail-navy/10 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ail-cyan">
              Certificaciones del idioma
            </p>
            <p className="mt-2 text-sm text-muted">
              Si cuentas con certificaciones o evaluaciones oficiales del idioma que
              deseas impartir, inclúyelas en tu aplicación. No exigen un requisito único
              para todas las vacantes.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-ink/80">
              <li>
                <strong>Inglés:</strong> IELTS, TOEFL, Cambridge, EF SET u otras
                comprobables
              </li>
              <li>
                <strong>Portugués:</strong> CELPE-BRAS u otras evaluaciones comprobables
              </li>
              <li>
                <strong>Español:</strong> formación ELE, certificaciones de enseñanza o
                experiencia comprobable
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-navy/10 bg-ail-navy p-6 text-white sm:p-7">
          <h3 className="font-display text-lg font-semibold">¿Cómo funciona el proceso?</h3>
          <ol className="mt-5 space-y-0">
            {teacherSelectionSteps.map((item, index) => (
              <li key={item.step} className="relative flex gap-4 pb-6 last:pb-0">
                {index < teacherSelectionSteps.length - 1 ? (
                  <span
                    className="absolute left-[15px] top-8 bottom-0 w-px bg-ail-cyan/35"
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ail-cyan/40 bg-ail-cyan/15 font-display text-xs font-bold text-ail-cyan">
                  {item.step}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="rounded-2xl border border-ail-cyan/25 bg-ail-cyan/8 px-4 py-3 text-sm leading-relaxed text-ink/85">
        <strong>Completar el formulario de aplicación no garantiza contratación ni
        incorporación al equipo docente de AIL.</strong>{" "}
        Las aplicaciones serán evaluadas de acuerdo con el perfil, experiencia,
        disponibilidad y necesidades académicas vigentes.
      </p>

      <div className="flex flex-col items-stretch gap-2 sm:items-start">
        <a
          href={TEACHER_APPLICATION_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackTeacherApplicationClick}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ail-green px-6 py-3.5 text-sm font-semibold text-ail-navy transition hover:bg-ail-cyan sm:w-auto sm:min-w-[280px]"
        >
          <IconClipboardList className="h-5 w-5" />
          Iniciar mi aplicación
          <IconExternalLink className="h-4 w-4" />
        </a>
        <p className="text-center text-xs text-muted sm:text-left">
          El formulario se abrirá en Google Forms.
        </p>
      </div>
    </div>
  );
}
