export function Testimonials() {
  return (
    <section className="bg-mist py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            Testimonios
          </p>
          <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            Lo que dicen nuestros estudiantes
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((slot) => (
            <article
              key={slot}
              className="rounded-[1.5rem] border border-dashed border-navy/20 bg-white/70 p-7"
            >
              <div className="h-3 w-24 rounded-full bg-navy/10" />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded-full bg-navy/8" />
                <div className="h-3 w-5/6 rounded-full bg-navy/8" />
                <div className="h-3 w-4/6 rounded-full bg-navy/8" />
              </div>
              <p className="mt-6 text-sm text-muted">
                Espacio reservado para testimonio real autorizado.
              </p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Publicaremos testimonios con nombre, perfil e idioma estudiado cuando
          contemos con autorizaciones de estudiantes.
        </p>
      </div>
    </section>
  );
}
