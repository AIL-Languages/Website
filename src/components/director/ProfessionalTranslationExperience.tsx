import { FadeUp } from "@/components/director/FadeUp";
import { IconLanguages } from "@/components/director/icons";

export function ProfessionalTranslationExperience() {
  return (
    <FadeUp>
      <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-card p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ail-green/15 text-ail-navy dark:text-ail-green">
            <IconLanguages className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-bold text-ink">
              Experiencia lingüística más allá del aula
            </h3>
            <h4 className="mt-3 font-display text-lg font-semibold text-ink">
              Traducción e interpretación profesional
            </h4>
            <p className="mt-2 text-sm font-semibold text-ail-blue">
              Experiencia profesional en traducción e interpretación de inglés,
              portugués, español e italiano.
            </p>
            <p className="mt-4 text-sm font-semibold text-ink">
              Centro de Intérpretes · Tribunal Superior de Justicia del Estado de
              Chihuahua
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
              Desde abril de 2025
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
              Experiencia lingüística aplicada en contextos profesionales que
              requieren precisión, comprensión intercultural y comunicación
              especializada.
            </p>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}
