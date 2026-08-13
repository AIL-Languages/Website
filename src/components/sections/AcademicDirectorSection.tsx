"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AcademicExperienceModal,
  type ExperienceTab,
} from "@/components/director/AcademicExperienceModal";
import { CountryFlag } from "@/components/director/CountryFlags";
import { useHashOpen } from "@/components/ui/useHashOpen";
import { founderContent, journeyStops } from "@/lib/director/data";

const highlights = [
  { title: "+13 años", text: "Experiencia en enseñanza de idiomas" },
  { title: "University of Glasgow", text: "Formación académica internacional" },
  { title: "Experiencia internacional", text: "Trayectoria académica, profesional y lingüística" },
  { title: "Perfil multilingüe", text: "Inglés · Portugués · Español · Italiano" },
];

const languageChips = [
  {
    name: "Inglés",
    flags: [
      { code: "US" as const, label: "Estados Unidos" },
      { code: "CA" as const, label: "Canadá" },
      { code: "GB" as const, label: "Reino Unido" },
    ],
  },
  {
    name: "Portugués",
    flags: [{ code: "BR" as const, label: "Brasil" }],
  },
  {
    name: "Español",
    flags: [{ code: "MX" as const, label: "México" }],
  },
  {
    name: "Italiano",
    flags: [{ code: "IT" as const, label: "Italia" }],
  },
];

export function AcademicDirectorSection() {
  const sheet = useHashOpen("#trayectoria");
  const [tab, setTab] = useState<ExperienceTab>("experiencia");

  function openTrajectory(next: ExperienceTab = "experiencia") {
    setTab(next);
    sheet.openSheet();
  }

  return (
    <section id="experiencia" className="bg-[#F7FBFD] py-12 sm:py-16 dark:bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
          Experiencia & dirección académica
        </p>
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Experiencia que respalda tu aprendizaje
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          AIL combina experiencia docente, formación internacional y una visión
          multilingüe para ofrecer una enseñanza práctica, profesional y conectada
          con el mundo.
        </p>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:gap-12">
          <figure className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[1.5rem] border border-ail-cyan/25 shadow-[0_18px_45px_rgba(7,27,58,0.12)] aspect-[4/5] lg:max-w-none">
            <Image
              src={founderContent.images.hero.src}
              alt={founderContent.images.hero.alt}
              width={founderContent.images.hero.width}
              height={founderContent.images.hero.height}
              className="h-full w-full object-cover object-[center_18%]"
              sizes="(max-width: 1024px) 90vw, 420px"
            />
          </figure>

          <div>
            <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              {founderContent.name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-ail-navy/80 dark:text-ail-cyan sm:text-base">
              {founderContent.role}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-navy/8 bg-white/80 px-4 py-3"
                >
                  <p className="font-display text-base font-semibold text-navy">{item.title}</p>
                  <p className="mt-1 text-xs leading-snug text-muted sm:text-sm">{item.text}</p>
                </article>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {languageChips.map((language) => (
                <span
                  key={language.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-navy/10 bg-white px-2.5 py-1.5 text-xs font-semibold text-navy"
                >
                  {language.flags.map((flag) => (
                    <span
                      key={flag.code}
                      className="overflow-hidden rounded-full border border-navy/10"
                    >
                      <CountryFlag code={flag.code} title={flag.label} className="h-5 w-5" />
                    </span>
                  ))}
                  {language.name}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-ink">Trayectoria internacional</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {journeyStops.map((stop) => (
                  <span
                    key={stop.id}
                    className="overflow-hidden rounded-full border border-navy/10"
                    title={stop.country}
                  >
                    <CountryFlag code={stop.code} title={stop.country} className="h-7 w-7" />
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">
                Explorar dentro de “Conocer trayectoria”
              </p>
            </div>

            <button
              type="button"
              onClick={() => openTrajectory("experiencia")}
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ail-green px-5 text-sm font-semibold text-ail-navy"
            >
              Conocer trayectoria →
            </button>
          </div>
        </div>
      </div>

      <AcademicExperienceModal
        open={sheet.open}
        onClose={sheet.closeSheet}
        tab={tab}
        onTabChange={setTab}
      />
    </section>
  );
}
