"use client";

import { DetailSheet } from "@/components/ui/DetailSheet";
import { useHashOpen } from "@/components/ui/useHashOpen";

const benefits = [
  { title: "Programas corporativos", text: "Capacitación diseñada para equipos y objetivos de negocio." },
  { title: "Seguimiento académico", text: "Avance, asistencia y reportes para coordinación empresarial." },
  { title: "Flexibilidad de horarios", text: "Clases online que se adaptan a la operación de tu empresa." },
];

const details = [
  {
    title: "English for Business",
    text: "Inglés para reuniones, presentaciones, comunicación empresarial y entrevistas.",
  },
  {
    title: "English + STEM",
    text: "Idioma aplicado a ciencia, tecnología, ingeniería, matemáticas y programación.",
  },
  {
    title: "Programas corporativos",
    text: "Rutas a la medida para empresas, con seguimiento y reportes.",
  },
];

export function Programs() {
  const sheet = useHashOpen("#empresas-detalle");

  return (
    <section id="empresas" className="bg-card py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
          Empresas
        </p>
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Soluciones para empresas
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Capacitación lingüística para equipos, con seguimiento académico y horarios flexibles.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {benefits.map((item) => (
            <article key={item.title} className="rounded-2xl border border-navy/8 bg-mist/70 p-5">
              <h3 className="font-display text-lg font-semibold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={sheet.openSheet}
          className="mt-6 text-sm font-semibold text-ail-cyan"
        >
          Conocer soluciones corporativas →
        </button>
      </div>

      <DetailSheet
        open={sheet.open}
        onClose={sheet.closeSheet}
        title="Soluciones corporativas AIL"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {details.map((item) => (
            <article key={item.title} className="rounded-2xl border border-navy/8 p-5">
              <h3 className="font-display text-lg font-semibold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </article>
          ))}
        </div>
        <a
          href="#contacto"
          onClick={sheet.closeSheet}
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ail-green px-5 text-sm font-semibold text-ail-navy"
        >
          Solicitar información corporativa
        </a>
      </DetailSheet>
    </section>
  );
}
