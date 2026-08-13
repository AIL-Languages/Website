const steps = [
  {
    n: "01",
    title: "Evaluación inicial",
    text: "Realizamos una evaluación diagnóstica para identificar tus conocimientos previos y ayudarte a comenzar desde el nivel adecuado.",
  },
  {
    n: "02",
    title: "Definimos tus objetivos",
    text: "Académicos, profesionales, personales, de conversación, certificación o viaje.",
  },
  {
    n: "03",
    title: "Diseñamos tu experiencia",
    text: "Asignamos profesor, nivel, horario y modalidad de acuerdo con tu disponibilidad y objetivos.",
  },
  {
    n: "04",
    title: "Aprende y practica",
    text: "Las clases combinan explicación, conversación, comprensión auditiva, lectura, escritura, gramática y vocabulario.",
  },
  {
    n: "05",
    title: "Seguimiento académico",
    text: "Evaluamos periódicamente tu progreso para identificar avances y áreas de oportunidad.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="proceso"
      className="relative overflow-hidden bg-ail-navy py-20 text-white sm:py-28"
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_right,_rgba(0,224,230,0.22),_transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-lime">
            Proceso
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            ¿Cómo funcionan nuestras clases?
          </h2>
          <p className="mt-4 text-white/75">
            Nivelación con referencia al MCER y un recorrido claro desde el primer
            contacto hasta el seguimiento continuo.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step) => (
            <li key={step.n} className="relative border-l border-cyan/40 pl-5 md:border-l-0 md:border-t md:pl-0 md:pt-5">
              <span className="font-display text-3xl font-bold text-cyan">{step.n}</span>
              <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
