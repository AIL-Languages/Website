import { ButtonLink } from "@/components/ButtonLink";
import { CertificationExamCards } from "@/components/sections/CertificationExamCards";
import { getCmsContent } from "@/lib/cms/store";

const programs = [
  {
    title: "English for Business",
    text: "Inglés aplicado a reuniones, presentaciones, comunicación empresarial, entrevistas y situaciones profesionales.",
  },
  {
    title: "English + STEM",
    text: "Aprendizaje del idioma mediante actividades de ciencia, tecnología, ingeniería, matemáticas, robótica y programación.",
  },
  {
    title: "Preparación para certificaciones",
    text: "Programas orientados a estudiantes que requieren preparación para exámenes internacionales.",
  },
  {
    title: "Programas corporativos",
    text: "Capacitación lingüística diseñada de acuerdo con las necesidades específicas de empresas y equipos de trabajo.",
  },
];

export async function Programs() {
  const { programs: copy } = await getCmsContent();

  return (
    <section id="empresas" className="bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            {copy.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {copy.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {programs.map((program) => (
            <article
              key={program.title}
              className="rounded-[1.5rem] border border-navy/8 bg-mist/70 p-7 transition hover:border-cyan/40"
            >
              <h3 className="font-display text-xl font-semibold text-ink">
                {program.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{program.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-[2rem] bg-navy px-8 py-10 text-white sm:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
                {copy.certificationsEyebrow}
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold">
                {copy.certificationsTitle}
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75">
                {copy.certificationsBody}
              </p>
              <div className="mt-8">
                <ButtonLink href="#contacto" variant="lime">
                  {copy.certificationsCta}
                </ButtonLink>
              </div>
            </div>
            <CertificationExamCards />
          </div>
        </div>
      </div>
    </section>
  );
}
