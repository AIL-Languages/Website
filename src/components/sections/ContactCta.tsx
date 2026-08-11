import { ContactForm } from "@/components/ContactForm";

export function ContactCta() {
  return (
    <section id="contacto" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:px-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            Contacto
          </p>
          <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            Tu siguiente idioma puede abrirte nuevas oportunidades.
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted">
            Cuéntanos qué idioma quieres aprender, cuáles son tus objetivos y qué
            disponibilidad tienes. Nuestro equipo te orientará para encontrar la
            modalidad adecuada.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-ink/85">
            <li>Estudiantes particulares</li>
            <li>Empresas y equipos de trabajo</li>
            <li>Clientes de traducción e interpretación</li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
