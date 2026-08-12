import Image from "next/image";
import { founderContent } from "@/lib/director/data";
import { ExperienceStats } from "@/components/director/ExperienceStats";
import { FadeUp } from "@/components/director/FadeUp";

export function FounderHero() {
  const photo = founderContent.images.hero;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[0.58fr_0.42fr] lg:gap-12 xl:gap-16">
      {/* Contenido — izquierda en desktop; primero en mobile */}
      <div className="order-1 space-y-6">
        <FadeUp>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ail-blue">
            {founderContent.eyebrow}
          </p>
          <h2
            id="experiencia-heading"
            className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl"
          >
            {founderContent.name}
          </h2>
          <p className="mt-2 text-base font-semibold text-ail-navy/80 dark:text-ail-cyan">
            {founderContent.role}
          </p>
        </FadeUp>

        <FadeUp delayMs={80} className="hidden lg:block">
          <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            {founderContent.bio}
          </p>
        </FadeUp>

        <FadeUp delayMs={120} className="hidden lg:block">
          <ExperienceStats />
        </FadeUp>
      </div>

      {/* Foto principal — derecha desktop; tras cargo en mobile */}
      <FadeUp className="order-2 relative mx-auto w-full max-w-md lg:max-w-none">
        <div
          aria-hidden
          className="absolute -inset-4 -z-10 rounded-[2rem] opacity-[0.18] sm:-inset-6"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, var(--ail-blue), transparent 55%), radial-gradient(circle at 75% 70%, var(--ail-cyan), transparent 50%), radial-gradient(circle at 40% 90%, var(--ail-green), transparent 45%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-2 top-8 h-2 w-2 rounded-full bg-ail-blue/50"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/3 h-1.5 w-1.5 rounded-full bg-ail-cyan/60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-16 left-6 h-1.5 w-1.5 rounded-full bg-ail-green/55"
        />
        <figure className="group relative overflow-hidden rounded-[1.75rem] border border-ail-cyan/25 shadow-[0_20px_50px_rgba(7,27,58,0.14)] aspect-[4/5]">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="h-full w-full object-cover object-[center_18%] transition duration-300 motion-safe:group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 90vw, 420px"
            priority
          />
        </figure>
      </FadeUp>

      <FadeUp delayMs={80} className="order-3 lg:hidden">
        <p className="text-sm leading-relaxed text-muted">{founderContent.bio}</p>
      </FadeUp>

      <FadeUp delayMs={120} className="order-4 lg:hidden">
        <ExperienceStats />
      </FadeUp>
    </div>
  );
}
