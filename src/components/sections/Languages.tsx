import { ButtonLink } from "@/components/ButtonLink";
import { CountryFlag } from "@/components/director/CountryFlags";

type FlagCode = "US" | "CA" | "GB" | "BR" | "MX";

const languages: {
  name: string;
  text: string;
  accent: string;
  flags: { code: FlagCode; label: string }[];
  flagsLabel: string;
}[] = [
  {
    name: "Inglés",
    text: "Desarrolla tu capacidad de comunicarte con confianza en contextos profesionales, académicos, personales e internacionales.",
    accent: "from-cyan/20 to-transparent",
    flagsLabel: "Referentes lingüísticos internacionales del inglés",
    flags: [
      { code: "US", label: "Estados Unidos" },
      { code: "CA", label: "Canadá" },
      { code: "GB", label: "Reino Unido" },
    ],
  },
  {
    name: "Portugués",
    text: "Aprende portugués mediante un enfoque práctico y comunicativo, desarrollando comprensión, fluidez y seguridad al expresarte.",
    accent: "from-lime/20 to-transparent",
    flagsLabel: "Portugués · Brasil",
    flags: [{ code: "BR", label: "Brasil" }],
  },
  {
    name: "Español para extranjeros",
    text: "Programa diseñado para estudiantes internacionales que desean mejorar su comunicación en español para vivir, estudiar, trabajar o desenvolverse en contextos hispanohablantes.",
    accent: "from-cyan-soft/25 to-transparent",
    flagsLabel: "Español · México",
    flags: [{ code: "MX", label: "México" }],
  },
];

function FlagCluster({
  flags,
  groupLabel,
}: {
  flags: { code: FlagCode; label: string }[];
  groupLabel: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1.5"
      role="group"
      aria-label={groupLabel}
    >
      {flags.map((flag) => (
        <span
          key={flag.code}
          title={flag.label}
          className="inline-flex origin-center transition duration-200 ease-out hover:scale-110"
        >
          <span className="overflow-hidden rounded-full border border-white/70 shadow-[0_4px_10px_rgba(0,0,0,0.28)]">
            <CountryFlag
              code={flag.code}
              title={flag.label}
              className="h-7 w-7 sm:h-8 sm:w-8 lg:h-[34px] lg:w-[34px]"
            />
          </span>
        </span>
      ))}
    </div>
  );
}

export function Languages() {
  return (
    <section id="cursos" className="bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
              Nuestros idiomas
            </p>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              Formación lingüística con propósito
            </h2>
          </div>
          <ButtonLink href="#contacto" variant="ghost">
            Solicitar información
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {languages.map((language) => (
            <a
              key={language.name}
              href="#contacto"
              className="group relative overflow-hidden rounded-[1.75rem] bg-ail-navy p-8 text-white transition duration-300 hover:-translate-y-[3px] hover:shadow-[0_24px_60px_rgba(0,26,61,0.28)] hover:ring-1 hover:ring-ail-cyan/40"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${language.accent} opacity-90 transition group-hover:opacity-100`}
              />
              <div className="absolute inset-0 bg-ail-navy/85 transition group-hover:bg-ail-navy/75" />
              <div className="relative flex h-full flex-col">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <h3 className="font-display text-2xl font-semibold">
                    {language.name}
                  </h3>
                  <FlagCluster
                    flags={language.flags}
                    groupLabel={language.flagsLabel}
                  />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/80">
                  {language.text}
                </p>
                <span className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-ail-cyan transition group-hover:gap-2">
                  Quiero este programa
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
