"use client";

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
  { id: "journey", label: "Global Journey" },
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

  return (
    <DetailSheet open={open} onClose={onClose} title="Conocer trayectoria">
      <div
        role="tablist"
        aria-label="Trayectoria académica"
        id={tablistId}
        className="mb-5 flex gap-2 overflow-x-auto pb-1"
      >
        {tabs.map((item) => {
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
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                selected ? "bg-navy text-white" : "bg-mist text-navy"
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
        className="space-y-6"
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

        {tab === "journey" ? (
          <div>
            <p className="mb-4 text-sm font-semibold text-ail-green">
              Linking Worldwide · trayectoria internacional
            </p>
            <GlobalJourney />
          </div>
        ) : null}
      </div>
    </DetailSheet>
  );
}
