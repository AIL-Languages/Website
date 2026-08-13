"use client";

import Image from "next/image";
import { ExpandInline } from "@/components/ui/ExpandInline";

const pillars = [
  { title: "Comunicativa", text: "Aprendes el idioma utilizándolo en situaciones reales." },
  { title: "Personalizada", text: "Cada ruta se adapta a tu nivel, objetivos y ritmo." },
  { title: "Aplicación real", text: "Enfoque práctico para contextos académicos, laborales y de viaje." },
  { title: "100% online", text: "Clases en Zoom, horarios flexibles y seguimiento continuo." },
];

const modalities = [
  {
    title: "Clases personalizadas",
    text: "Para avanzar según tus necesidades, disponibilidad y objetivos.",
  },
  {
    title: "Grupos reducidos",
    text: "Máximo cinco estudiantes, con atención cercana y dinámica en Zoom.",
  },
];

export function Methodology() {
  return (
    <section id="metodologia" className="bg-mist py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
          Metodología
        </p>
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Aprende el idioma utilizándolo
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Enfoque práctico y comunicativo para desenvolverte con seguridad.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((item) => (
            <article key={item.title} className="rounded-2xl border border-navy/8 bg-white p-5">
              <h3 className="font-display text-lg font-semibold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>

        <ExpandInline summary="Conocer nuestra metodología">
          <div className="grid gap-4 lg:grid-cols-2">
            {modalities.map((item) => (
              <article key={item.title} className="rounded-2xl bg-ail-navy p-6 text-white">
                <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/75">{item.text}</p>
              </article>
            ))}
            <article className="rounded-2xl border border-navy/10 bg-white px-5 py-5 sm:px-6 sm:py-5 lg:col-span-2">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-7 sm:text-left">
                <Image
                  src="/images/smrt-english-logo.png"
                  alt="Smrt English, plataforma educativa utilizada por A-Inman Languages"
                  width={570}
                  height={164}
                  className="h-auto w-[132px] shrink-0 object-contain sm:w-[170px]"
                />
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold text-navy">
                    Tu aprendizaje continúa fuera de clase
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Complementa tus clases con actividades, recursos interactivos y
                    práctica adicional mediante la plataforma educativa Smrt English.
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    Disponible para estudiantes inscritos en los programas de inglés de
                    AIL.
                  </p>
                  <a
                    href="https://smrtenglish.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ail-cyan transition hover:text-cyan-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan/70 focus-visible:ring-offset-2"
                  >
                    Conoce Smrt English
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </ExpandInline>
      </div>
    </section>
  );
}
