import { founderContent } from "@/lib/director/data";
import { CareerTimeline } from "@/components/director/CareerTimeline";
import { FadeUp } from "@/components/director/FadeUp";
import { FounderHero } from "@/components/director/FounderHero";
import { InternationalExperience } from "@/components/director/InternationalExperience";
import { LanguageProfile } from "@/components/director/LanguageProfile";
import { ProfessionalExperience } from "@/components/director/ProfessionalExperience";
import { ProfessionalTranslationExperience } from "@/components/director/ProfessionalTranslationExperience";

export function AcademicDirectorSection() {
  return (
    <section
      id="experiencia"
      aria-labelledby="experiencia-heading"
      className="relative overflow-hidden bg-[#F7FBFD] py-20 transition-[background-color,color] duration-300 dark:bg-background sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--ail-blue) 28%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-40 h-80 w-80 rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--ail-green) 22%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:space-y-20 lg:px-8">
        <FounderHero />

        <CareerTimeline />

        <ProfessionalExperience />

        <LanguageProfile />

        <InternationalExperience />

        <ProfessionalTranslationExperience />

        <FadeUp>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-lg font-semibold leading-relaxed text-ink sm:text-xl">
              {founderContent.closing}
            </p>
            <a
              href="#metodologia"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-ail-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-ail-cyan hover:text-ail-navy dark:bg-ail-green dark:text-ail-navy dark:hover:bg-ail-cyan"
            >
              Conoce nuestra metodología →
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
