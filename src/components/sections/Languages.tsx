import { ButtonLink } from "@/components/ButtonLink";

const languages = [
  {
    name: "Inglés",
    text: "Desarrolla tu capacidad de comunicarte con confianza en contextos profesionales, académicos, personales e internacionales.",
    accent: "from-cyan/20 to-transparent",
  },
  {
    name: "Portugués",
    text: "Aprende portugués mediante un enfoque práctico y comunicativo, desarrollando comprensión, fluidez y seguridad al expresarte.",
    accent: "from-lime/20 to-transparent",
  },
  {
    name: "Español para extranjeros",
    text: "Programa diseñado para estudiantes internacionales que desean mejorar su comunicación en español para vivir, estudiar, trabajar o desenvolverse en contextos hispanohablantes.",
    accent: "from-cyan-soft/25 to-transparent",
  },
];

export function Languages() {
  return (
    <section id="cursos" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
              Nuestros idiomas
            </p>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
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
              className="group relative overflow-hidden rounded-[1.75rem] bg-navy p-8 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,26,61,0.28)]"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${language.accent} opacity-90 transition group-hover:opacity-100`}
              />
              <div className="absolute inset-0 bg-navy/85 transition group-hover:bg-navy/75" />
              <div className="relative">
                <h3 className="font-display text-2xl font-semibold">{language.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/80">
                  {language.text}
                </p>
                <span className="mt-8 inline-flex text-sm font-semibold text-cyan-soft">
                  Quiero este programa →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
