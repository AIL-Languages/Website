"use client";

import type { KeyboardEvent } from "react";
import { useId } from "react";
import { CareerTimeline } from "@/components/director/CareerTimeline";
import { CountryFlag } from "@/components/director/CountryFlags";
import { GlasgowCard } from "@/components/director/GlasgowCard";
import { GlobalJourney } from "@/components/director/GlobalJourney";
import { ProfessionalExperience } from "@/components/director/ProfessionalExperience";
import { DetailSheet } from "@/components/ui/DetailSheet";
import {
  glasgowProgram,
  languages as directorLanguages,
} from "@/lib/director/data";

const tabs = [
  { id: "experiencia", label: "Experiencia" },
  { id: "formacion", label: "Formación" },
  { id: "certificaciones", label: "Certificaciones" },
  { id: "journey", label: "Trayectoria internacional" },
] as const;

export type ExperienceTab = (typeof tabs)[number]["id"];

type Props = {
  open: boolean;
  onClose: () => void;
  tab: ExperienceTab;
  onTabChange: (tab: ExperienceTab) => void;
};

const languageFlags: Record<string, { code: "US" | "CA" | "GB" | "BR" | "MX" | "IT"; label: string }[]> = {
  en: [
    { code: "US", label: "Estados Unidos" },
    { code: "CA", label: "Canadá" },
    { code: "GB", label: "Reino Unido" },
  ],
  pt: [{ code: "BR", label: "Brasil" }],
  es: [{ code: "MX", label: "México" }],
  it: [{ code: "IT", label: "Italia" }],
};

export function AcademicExperienceModal({ open, onClose, tab, onTabChange }: Props) {
  const tablistId = useId();

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    let next = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = index === last ? 0 : index + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = index === 0 ? last : index - 1;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = last;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = tabs[next];
    onTabChange(nextTab.id);
    window.requestAnimationFrame(() => {
      document.getElementById(`${tablistId}-${nextTab.id}`)?.focus();
    });
  }

  return (
    <DetailSheet open={open} onClose={onClose} title="Conocer trayectoria">
      <div
        role="tablist"
        aria-label="Secciones de trayectoria"
        aria-orientation="horizontal"
        id={tablistId}
        className="mb-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2.5"
      >
        {tabs.map((item, index) => {
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${tablistId}-${item.id}`}
              aria-selected={selected}
              aria-controls={`${tablistId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onTabChange(item.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`relative inline-flex min-h-11 w-full items-center justify-center rounded-full border px-3.5 py-2.5 text-center text-sm font-semibold leading-snug transition duration-200 sm:w-auto sm:shrink-0 sm:px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                selected
                  ? "border-ail-cyan bg-ail-navy text-white shadow-[0_0_16px_rgba(0,224,230,0.28)] after:absolute after:inset-x-4 after:-bottom-px after:h-0.5 after:rounded-full after:bg-ail-cyan"
                  : "border-ail-navy/45 bg-white text-ail-navy hover:border-ail-cyan hover:bg-ail-cyan/15"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${tablistId}-panel-${tab}`}
        aria-labelledby={`${tablistId}-${tab}`}
        className="space-y-6 overflow-x-hidden"
      >
        {tab === "experiencia" ? (
          <div className="space-y-6">
            <CareerTimeline />
            <ProfessionalExperience />
            <p className="text-sm leading-relaxed text-muted">
              Experiencia profesional en traducción e interpretación de inglés,
              portugués, español e italiano · Centro de Intérpretes · Tribunal
              Superior de Justicia del Estado de Chihuahua.
            </p>
          </div>
        ) : null}

        {tab === "formacion" ? (
          <div className="space-y-5">
            <GlasgowCard />
            <p className="rounded-2xl border border-navy/8 bg-mist/60 p-4 text-sm leading-relaxed text-muted">
              {glasgowProgram.text} No se trata de una maestría en idiomas, sino de
              formación de posgrado cursada en un entorno académico internacional de
              habla inglesa.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {directorLanguages.map((language) => (
                <article
                  key={language.id}
                  className="rounded-2xl border border-navy/8 bg-white p-4"
                >
                  <p className="font-display text-base font-semibold text-navy">
                    {language.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {language.level} · {language.levelDetail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "certificaciones" ? (
          <div className="space-y-5">
            {directorLanguages
              .filter((language) => language.certifications.length > 0)
              .map((language) => (
                <article key={language.id} className="rounded-2xl border border-navy/8 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {(languageFlags[language.id] ?? []).map((flag) => (
                      <span
                        key={flag.code}
                        className="overflow-hidden rounded-full border border-navy/10"
                      >
                        <CountryFlag code={flag.code} title={flag.label} className="h-6 w-6" />
                      </span>
                    ))}
                    <h3 className="font-display text-lg font-semibold text-navy">
                      {language.name}
                    </h3>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-ink/80">
                    {language.certifications.map((item) => (
                      <li key={item.id}>
                        {item.name}
                        {item.year ? ` · ${item.year}` : ""}
                        {item.score ? ` · ${item.score}` : ""}
                        {item.cefr ? ` · ${item.cefr}` : ""}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
          </div>
        ) : null}

        {tab === "journey" ? <GlobalJourney /> : null}
      </div>
    </DetailSheet>
  );
}
