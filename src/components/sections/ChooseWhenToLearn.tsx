const steps = [
  {
    title: "Elige tu fecha de inicio",
    text: "Selecciona la fecha aproximada en la que quieres comenzar tu curso.",
    icon: "calendar",
  },
  {
    title: "Encontramos a tu profesor",
    text: "Hacemos match entre tu idioma, nivel, modalidad y disponibilidad.",
    icon: "user",
  },
  {
    title: "Agenda tus clases",
    text: "Consulta los horarios disponibles de tu profesor y reserva tus sesiones.",
    icon: "agenda",
  },
  {
    title: "Entra a tu aula virtual",
    text: "Accede desde tu perfil AIL a tu sala Zoom personalizada.",
    icon: "video",
  },
] as const;

function StepIcon({ kind }: { kind: (typeof steps)[number]["icon"] }) {
  const common = "h-6 w-6";
  if (kind === "calendar") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "user") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "agenda") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
      <rect x="3" y="6" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 10l5-3v10l-5-3v-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function ChooseWhenToLearn() {
  return (
    <section
      id="elige-cuando"
      className="ail-section ail-section--tint relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,184,230,0.18),_transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            Agenda AIL
          </p>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Tú eliges cuándo aprender
          </h2>
          <p className="mt-3 text-lg font-semibold text-ink/80">
            Clases que se adaptan a tu disponibilidad.
          </p>
          <p className="mt-4 text-muted leading-relaxed">
            Selecciona cuándo quieres comenzar y, una vez inscrito, agenda tus
            clases de acuerdo con la disponibilidad de tu profesor. Desde tu
            perfil AIL podrás consultar tus próximas sesiones y acceder
            directamente a tu aula virtual.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="ail-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-lime">
                <StepIcon kind={step.icon} />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-cyan">
                Paso {index + 1}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <a
            href="/registro"
            className="inline-flex rounded-full bg-ail-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-ail-cyan hover:text-ail-navy dark:bg-ail-green dark:text-ail-navy"
          >
            Comenzar mi curso
          </a>
        </div>
      </div>
    </section>
  );
}
