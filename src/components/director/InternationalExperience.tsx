import Image from "next/image";
import { founderContent } from "@/lib/director/data";
import { FadeUp } from "@/components/director/FadeUp";
import { GlobalJourney } from "@/components/director/GlobalJourney";
import { GlasgowCard } from "@/components/director/GlasgowCard";

export function InternationalExperience() {
  const photo = founderContent.images.international;

  return (
    <div className="space-y-8">
      <FadeUp>
        <div className="max-w-2xl">
          <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Formación y experiencia internacional
          </h3>
          <p className="mt-2 text-sm font-semibold text-muted sm:text-base">
            Una trayectoria lingüística construida también fuera del aula.
          </p>
        </div>
      </FadeUp>

      {/* Mobile: título → ruta → foto → Glasgow */}
      <div className="grid items-stretch gap-6 lg:grid-cols-[0.58fr_0.42fr]">
        <FadeUp delayMs={40} className="order-1">
          <GlobalJourney />
        </FadeUp>

        <FadeUp delayMs={80} className="order-2">
          <figure className="group relative h-full min-h-[300px] overflow-hidden rounded-[1.5rem] border border-ail-cyan/25 shadow-[0_18px_45px_rgba(7,27,58,0.12)] aspect-[4/5] lg:aspect-auto">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="h-full w-full object-cover object-[center_20%] transition duration-300 motion-safe:group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 40vw"
              loading="lazy"
            />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-ail-navy/85 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-ail-green backdrop-blur-sm">
              Linking Worldwide
            </figcaption>
          </figure>
        </FadeUp>
      </div>

      <div className="order-3">
        <GlasgowCard />
      </div>
    </div>
  );
}
