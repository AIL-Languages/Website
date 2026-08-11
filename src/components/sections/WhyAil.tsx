const reasons = [
  {
    title: "Atención personalizada",
    text: "Cada estudiante tiene objetivos y necesidades diferentes.",
  },
  {
    title: "Metodología práctica",
    text: "Aprendes a utilizar el idioma, no solamente a memorizarlo.",
  },
  {
    title: "Profesores preparados",
    text: "Experiencia docente y formación lingüística respaldan nuestro modelo académico.",
  },
  {
    title: "Flexibilidad",
    text: "Modalidad online y coordinación de horarios.",
  },
  {
    title: "Grupos reducidos",
    text: "Máximo cinco estudiantes.",
  },
  {
    title: "Seguimiento académico",
    text: "Evaluamos tu progreso durante el proceso.",
  },
  {
    title: "Experiencia internacional",
    text: "La dirección académica cuenta con experiencia profesional, académica y cultural en diferentes países.",
  },
];

export function WhyAil() {
  return (
    <section className="bg-mist py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            Diferenciadores
          </p>
          <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            ¿Por qué elegir AIL?
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <article
              key={reason.title}
              className={`rounded-[1.5rem] bg-white p-6 shadow-[0_10px_35px_rgba(0,26,61,0.05)] ${
                index === reasons.length - 1 ? "lg:col-span-3 lg:max-w-xl" : ""
              }`}
            >
              <div className="mb-4 h-1.5 w-10 rounded-full bg-gradient-to-r from-cyan to-lime" />
              <h3 className="font-display text-lg font-semibold text-navy">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{reason.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
