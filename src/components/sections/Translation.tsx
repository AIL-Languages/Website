import { ButtonLink } from "@/components/ButtonLink";

const services = [
  {
    title: "Traducción de documentos",
    text: "Inglés ↔ Español · Portugués ↔ Español",
  },
  {
    title: "Interpretación",
    text: "Servicios de interpretación para reuniones, audiencias, videollamadas y situaciones profesionales.",
  },
  {
    title: "Revisión y corrección lingüística",
    text: "Revisión de redacción, gramática, estilo y claridad de documentos.",
  },
];

export function Translation() {
  return (
    <section id="traduccion" className="relative overflow-hidden bg-navy py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute -left-10 top-10 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-lime">
            Servicios lingüísticos profesionales
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Traducción e interpretación
          </h2>
          <p className="mt-5 max-w-2xl text-white/75">
            Además de formación en idiomas, AIL ofrece servicios lingüísticos para
            particulares, profesionales y organizaciones.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-[1.5rem] border border-white/15 bg-white/5 p-7 backdrop-blur-sm"
            >
              <h3 className="font-display text-xl font-semibold text-cyan-soft">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{service.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <ButtonLink href="#contacto" variant="primary">
            Solicitar cotización
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
