const skills = [
  { title: "Listening", subtitle: "Comprensión auditiva" },
  { title: "Speaking", subtitle: "Comunicación oral" },
  { title: "Reading", subtitle: "Comprensión lectora" },
  { title: "Writing", subtitle: "Expresión escrita" },
];

const complements = ["Grammar", "Vocabulary", "Pronunciation", "Conversation"];

export function Methodology() {
  return (
    <section id="metodologia" className="bg-mist py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            Nuestra metodología
          </p>
          <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            Aprende el idioma utilizándolo.
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">
            Combinamos un enfoque práctico y comunicativo —método directo y
            acercamiento comunicativo— para desarrollar las habilidades necesarias
            en situaciones reales.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={skill.title}
              className="rounded-[1.5rem] border border-navy/8 bg-white px-6 py-8 text-center shadow-[0_12px_40px_rgba(0,26,61,0.06)]"
            >
              <p className="font-display text-2xl font-bold text-navy">{skill.title}</p>
              <p className="mt-2 text-sm text-muted">{skill.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {complements.map((item) => (
            <span
              key={item}
              className="rounded-full border border-cyan/30 bg-white px-4 py-2 text-sm font-semibold text-navy"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <article className="rounded-[1.75rem] bg-navy p-8 text-white">
            <h3 className="font-display text-2xl font-semibold">Modalidades</h3>
            <div className="mt-8 space-y-6">
              <div>
                <p className="text-lg font-semibold text-cyan-soft">
                  Clases personalizadas
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Para estudiantes que desean avanzar de acuerdo con sus propias
                  necesidades, disponibilidad y objetivos.
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-lime">Grupos reducidos</p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Grupos virtuales de máximo cinco estudiantes para mantener una
                  experiencia dinámica y atención cercana. Clases en Zoom.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-navy/10 bg-white p-8">
            <h3 className="font-display text-2xl font-semibold text-navy">
              Tu aprendizaje continúa fuera de clase
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              AIL complementa las clases de inglés con herramientas digitales y
              material educativo para practicar diferentes habilidades lingüísticas.
            </p>
            <a
              href="https://www.smrtenglish.com/smrt/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-display text-xl font-semibold text-cyan underline-offset-4 transition hover:text-cyan-bright hover:underline"
            >
              Smrt English
            </a>
            <p className="mt-2 text-sm text-muted">
              Plataforma educativa para practicar Listening, Speaking, Reading,
              Writing, Vocabulary y Grammar, con acceso 24/7 a contenidos y
              ejercicios.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
