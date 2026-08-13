"use client";

import { useEffect, useState } from "react";
import { CountryFlag } from "@/components/director/CountryFlags";
import { DetailSheet } from "@/components/ui/DetailSheet";
import { setContactInterest } from "@/lib/interests";

type FlagCode = "US" | "CA" | "GB" | "BR" | "MX";

const languages = [
  {
    id: "ingles",
    hash: "#ingles",
    interest: "ingles",
    name: "Inglés",
    text: "Desarrolla tu comunicación para contextos personales, académicos y profesionales.",
    flagsLabel: "Inglés internacional",
    flags: [
      { code: "US" as FlagCode, label: "Estados Unidos" },
      { code: "CA" as FlagCode, label: "Canadá" },
      { code: "GB" as FlagCode, label: "Reino Unido" },
    ],
    details: {
      levels: "A1 a C1, con evaluación diagnóstica y referencia al MCER.",
      modality: "Clases personalizadas o grupos reducidos (máximo 5), 100% online.",
      method: "Enfoque comunicativo y práctico: escuchas, hablas y usas el idioma desde el primer día.",
      skills: "Listening, Speaking, Reading y Writing, con grammar, vocabulary y pronunciación.",
      schedule: "Horarios flexibles según tu disponibilidad y la de tu profesor.",
      exams: "Preparación opcional para IELTS, TOEFL iBT y TOEFL ITP.",
    },
  },
  {
    id: "portugues",
    hash: "#portugues",
    interest: "portugues",
    name: "Portugués",
    text: "Aprende portugués con un enfoque práctico, comunicativo y cultural.",
    flagsLabel: "Portugués · Brasil",
    flags: [{ code: "BR" as FlagCode, label: "Brasil" }],
    details: {
      levels: "Desde principiante hasta avanzado, con nivelación inicial.",
      modality: "Clases online personalizadas o en grupos reducidos.",
      method: "Comunicación real, comprensión y fluidez para viajar, estudiar o trabajar.",
      skills: "Las cuatro habilidades + vocabulario y pronunciación brasileña.",
      schedule: "Sesiones que se adaptan a tu agenda.",
      exams: "Preparación opcional para CELPE-BRAS.",
    },
  },
  {
    id: "espanol",
    hash: "#espanol",
    interest: "espanol",
    name: "Español",
    text: "Programa para extranjeros que necesitan comunicarse en contextos hispanohablantes.",
    flagsLabel: "Español · México",
    flags: [{ code: "MX" as FlagCode, label: "México" }],
    details: {
      levels: "Nivelación según tus conocimientos previos y objetivos.",
      modality: "100% online, personalizada o en grupo reducido.",
      method: "Español práctico para vivir, estudiar, trabajar o viajar.",
      skills: "Comprensión, expresión oral y escrita en situaciones reales.",
      schedule: "Horarios flexibles con seguimiento académico.",
      exams: "Preparación lingüística según tu meta comunicativa.",
    },
  },
] as const;

type Language = (typeof languages)[number];

function FlagCluster({
  flags,
  groupLabel,
}: {
  flags: { code: FlagCode; label: string }[];
  groupLabel: string;
}) {
  return (
    <div className="inline-flex items-center gap-1.5" role="group" aria-label={groupLabel}>
      {flags.map((flag) => (
        <span key={flag.code} className="overflow-hidden rounded-full border border-white/70">
          <CountryFlag code={flag.code} title={flag.label} className="h-7 w-7" />
        </span>
      ))}
    </div>
  );
}

export function Languages() {
  const [current, setCurrent] = useState<Language | null>(null);

  useEffect(() => {
    function sync() {
      const match = languages.find((item) => item.hash === window.location.hash);
      setCurrent(match ?? null);
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  function openLanguage(language: Language) {
    window.history.pushState(null, "", language.hash);
    setCurrent(language);
  }

  function close() {
    setCurrent(null);
    if (languages.some((item) => item.hash === window.location.hash)) {
      window.history.pushState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }

  return (
    <section id="cursos" className="bg-card py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
          Programas de idiomas
        </p>
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Elige tu idioma
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Inglés, portugués o español, con clases online personalizadas y grupos reducidos.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {languages.map((language) => (
            <article
              key={language.id}
              className="flex flex-col rounded-[1.5rem] bg-ail-navy p-6 text-white"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-semibold">{language.name}</h3>
                <FlagCluster flags={[...language.flags]} groupLabel={language.flagsLabel} />
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/75">
                {language.text}
              </p>
              <button
                type="button"
                onClick={() => openLanguage(language)}
                className="mt-5 text-left text-sm font-semibold text-ail-cyan"
              >
                Ver programa →
              </button>
            </article>
          ))}
        </div>
      </div>

      <DetailSheet open={Boolean(current)} onClose={close} title={current?.name ?? "Programa"}>
        {current ? (
          <div className="space-y-4 text-sm leading-relaxed text-ink/85">
            {[
              ["Niveles", current.details.levels],
              ["Modalidad", current.details.modality],
              ["Metodología", current.details.method],
              ["Habilidades", current.details.skills],
              ["Horarios", current.details.schedule],
              ["Certificaciones", current.details.exams],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
                <p className="mt-1">{value}</p>
              </div>
            ))}
            <a
              href="#contacto"
              onClick={() => {
                setContactInterest(current.interest);
                close();
              }}
              className="inline-flex min-h-11 items-center rounded-full bg-ail-green px-5 text-sm font-semibold text-ail-navy"
            >
              Solicitar información
            </a>
          </div>
        ) : null}
      </DetailSheet>
    </section>
  );
}
