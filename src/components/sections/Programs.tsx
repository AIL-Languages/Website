import { ButtonLink } from "@/components/ButtonLink";

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

const exams = ["IELTS", "TOEFL iBT", "TOEFL ITP", "CELPE-BRAS"];

export function Programs() {
  return (
    <section id="empresas" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            Programas especializados
          </p>
          <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            Soluciones para estudiantes, profesionales y empresas
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {programs.map((program) => (
            <article
              key={program.title}
              className="rounded-[1.5rem] border border-navy/8 bg-mist/70 p-7 transition hover:border-cyan/40"
            >
              <h3 className="font-display text-xl font-semibold text-navy">
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
                Certificaciones
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold">
                Prepárate para alcanzar tu siguiente objetivo.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75">
                Programas de preparación para exámenes internacionales. AIL te
                acompaña en tu preparación; la certificación la otorga el organismo
                evaluador correspondiente.
              </p>
              <div className="mt-8">
                <ButtonLink href="#contacto" variant="lime">
                  Quiero prepararme
                </ButtonLink>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {exams.map((exam) => (
                <li
                  key={exam}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-5 text-center font-display text-lg font-semibold text-cyan-soft"
                >
                  {exam}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
