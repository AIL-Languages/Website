import Link from "next/link";

const cards = [
  {
    title: "Alumno",
    href: "/registro?perfil=alumno",
    text: "Aprende inglés, portugués o español con clases personalizadas y seguimiento académico.",
    cta: "Registrarme como alumno",
    dark: false,
  },
  {
    title: "Profesor",
    href: "/registro?perfil=profesor",
    text: "Forma parte del equipo docente de A-Inman Languages e imparte clases virtuales.",
    cta: "Registrarme como profesor",
    dark: true,
  },
  {
    title: "Coordinación académica",
    href: "/registro?perfil=coordinacion",
    text: "Gestiona profesores, alumnos, grupos, horarios, niveles y seguimiento académico.",
    cta: "Registrarme como coordinación",
    dark: true,
  },
  {
    title: "Empresa / Corporativo",
    href: "/registro?perfil=empresa",
    text: "Administra los alumnos de tu empresa y consulta el programa contratado.",
    cta: "Registrarme como empresa",
    dark: false,
  },
];

export function JoinProfiles() {
  return (
    <section id="registro" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            Crea tu cuenta
          </p>
          <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            ¿Cómo quieres unirte a AIL?
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Elige tu perfil. Cada cuenta tiene un dashboard distinto: alumnos,
            profesores, coordinación académica o empresas.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.title}
              className={`flex flex-col rounded-[1.75rem] p-8 ${
                card.dark ? "bg-navy text-white" : "border border-navy/10 bg-mist/70"
              }`}
            >
              <h3 className="font-display text-2xl font-semibold">{card.title}</h3>
              <p
                className={`mt-3 flex-1 text-sm leading-relaxed ${
                  card.dark ? "text-white/75" : "text-muted"
                }`}
              >
                {card.text}
              </p>
              <Link
                href={card.href}
                className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                  card.dark
                    ? "bg-lime text-navy-deep hover:bg-lime-deep"
                    : "bg-cyan text-navy-deep hover:bg-cyan-bright"
                }`}
              >
                {card.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
