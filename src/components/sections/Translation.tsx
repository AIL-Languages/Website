"use client";

import { CountryFlag } from "@/components/director/CountryFlags";
import { DetailSheet } from "@/components/ui/DetailSheet";
import { useHashOpen } from "@/components/ui/useHashOpen";
import { setContactInterest } from "@/lib/interests";

const services = [
  {
    title: "Traducción de documentos",
    text: "Inglés ↔ Español · Portugués ↔ Español",
  },
  {
    title: "Interpretación",
    text: "Reuniones, audiencias, videollamadas y contextos profesionales.",
  },
  {
    title: "Revisión y corrección lingüística",
    text: "Gramática, estilo y claridad de documentos.",
  },
];

export function Translation() {
  const sheet = useHashOpen("#traduccion-detalle");

  return (
    <section id="traduccion" className="ail-section ail-section--navy-soft text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="ail-kicker">
          Servicios profesionales
        </p>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Traducción e interpretación
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {[
            ["US", "Inglés"],
            ["GB", "Inglés"],
            ["BR", "Portugués"],
            ["MX", "Español"],
          ].map(([code, label]) => (
            <span key={code} className="overflow-hidden rounded-full border border-white/30">
              <CountryFlag
                code={code as "US" | "GB" | "BR" | "MX"}
                title={label}
                className="h-6 w-6"
              />
            </span>
          ))}
        </div>
        <p className="ail-lead mt-3 max-w-xl text-sm">
          Traducción de documentos · Interpretación profesional
        </p>
        <button
          type="button"
          onClick={sheet.openSheet}
          className="ail-btn ail-btn--on-dark mt-5"
        >
          Solicitar cotización →
        </button>
      </div>

      <DetailSheet open={sheet.open} onClose={sheet.closeSheet} title="Cotización de servicios lingüísticos">
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="rounded-2xl border border-navy/8 p-5">
              <h3 className="font-display text-lg font-semibold text-navy">{service.title}</h3>
              <p className="mt-2 text-sm text-muted">{service.text}</p>
            </article>
          ))}
        </div>
        <a
          href="#contacto"
          onClick={() => {
            setContactInterest("traduccion");
            sheet.closeSheet();
          }}
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ail-green px-5 text-sm font-semibold text-ail-navy"
        >
          Ir a contacto
        </a>
      </DetailSheet>
    </section>
  );
}
