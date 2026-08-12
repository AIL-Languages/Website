import Image from "next/image";
import { founderContent, glasgowProgram, languages } from "@/lib/director/data";
import { CertificationAccordion } from "@/components/director/CertificationAccordion";
import { FadeUp } from "@/components/director/FadeUp";
import { FlagScotland } from "@/components/director/CountryFlags";

export function LanguageProfile() {
  const photo = founderContent.images.credentials;

  return (
    <div className="space-y-8">
      <FadeUp>
        <div className="max-w-2xl">
          <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Perfil lingüístico y formación
          </h3>
          <p className="mt-2 text-sm font-semibold text-muted sm:text-base">
            Idiomas, certificaciones y trayectoria académica internacional
          </p>
        </div>
      </FadeUp>

      <div className="grid items-start gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:gap-12">
        {/* Foto: mobile order 1 (tras título), desktop izquierda */}
        <FadeUp className="order-1 mx-auto w-full max-w-sm lg:max-w-none">
          <figure className="group relative overflow-hidden rounded-[1.5rem] border border-ail-cyan/30 shadow-[0_16px_40px_rgba(7,27,58,0.1)] aspect-[4/5]">
            <span
              aria-hidden
              className="absolute inset-y-4 left-0 z-10 w-1 rounded-full bg-gradient-to-b from-ail-blue via-ail-cyan to-ail-green"
            />
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="h-full w-full object-cover object-top transition duration-300 motion-safe:group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 85vw, 360px"
              loading="lazy"
            />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-ail-navy/85 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-ail-cyan backdrop-blur-sm">
              Academic Director
            </figcaption>
          </figure>
        </FadeUp>

        <div className="order-2 space-y-6">
          <FadeUp>
            <article className="relative overflow-hidden rounded-[1.5rem] border border-ail-cyan/30 bg-card p-5 shadow-[0_12px_36px_rgba(7,27,58,0.06)] sm:p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-40"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--ail-cyan) 40%, transparent), transparent 70%)",
                }}
              />
              <div className="relative flex items-start gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-white/20 shadow-md">
                  <FlagScotland className="h-full w-full" title="Bandera de Escocia" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Formación académica
                  </p>
                  <h4 className="mt-1 font-display text-lg font-bold text-ink sm:text-xl">
                    {glasgowProgram.degree}
                  </h4>
                  <p className="mt-1 text-sm font-semibold text-ail-blue">
                    {glasgowProgram.institution} · {glasgowProgram.location}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
                    {glasgowProgram.years}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {glasgowProgram.text}
                  </p>
                </div>
              </div>
            </article>
          </FadeUp>

          <FadeUp delayMs={60}>
            <h4 className="font-display text-xl font-semibold text-ink">
              Perfil lingüístico
            </h4>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {languages.map((language) => (
                <article
                  key={language.id}
                  className="rounded-[1.25rem] border border-[color:var(--border)] bg-card p-4 transition duration-300 hover:-translate-y-0.5 hover:border-ail-cyan/45"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted">
                    <span aria-hidden>{language.flag}</span> {language.name}
                  </p>
                  <h5 className="mt-1 font-display text-lg font-bold text-ink">
                    {language.level}
                    <span className="text-sm font-semibold text-muted">
                      {" "}
                      · {language.levelDetail}
                    </span>
                  </h5>
                  <CertificationAccordion language={language} />
                </article>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
