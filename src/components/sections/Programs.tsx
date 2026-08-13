"use client";

import { DetailSheet } from "@/components/ui/DetailSheet";
import { useHashOpen } from "@/components/ui/useHashOpen";
import {
  AILCard,
  AILCardText,
  AILCardTitle,
  AILIconBubble,
} from "@/components/ui/AILCard";
import { AILButton } from "@/components/ui/AILButton";
import {
  IconBuilding,
  IconCalendarDays,
  IconChart,
} from "@/components/director/icons";

const benefits = [
  {
    title: "Programas corporativos",
    text: "Capacitación diseñada para equipos y objetivos de negocio.",
    Icon: IconBuilding,
  },
  {
    title: "Seguimiento académico",
    text: "Avance, asistencia y reportes para coordinación empresarial.",
    Icon: IconChart,
  },
  {
    title: "Flexibilidad de horarios",
    text: "Clases online que se adaptan a la operación de tu empresa.",
    Icon: IconCalendarDays,
  },
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
    <section id="empresas" className="ail-section ail-section--navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="ail-kicker">Empresas</p>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Soluciones para empresas
        </h2>
        <p className="ail-lead mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
          Capacitación lingüística para equipos, con seguimiento académico y horarios flexibles.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {benefits.map((item) => (
            <AILCard key={item.title} align="center">
              <AILIconBubble>
                <item.Icon />
              </AILIconBubble>
              <AILCardTitle>{item.title}</AILCardTitle>
              <AILCardText>{item.text}</AILCardText>
            </AILCard>
          ))}
        </div>

        <AILButton
          type="button"
          arrow
          variant="on-dark"
          className="mt-6"
          onClick={sheet.openSheet}
        >
          Conocer soluciones corporativas
        </AILButton>
      </div>

      <DetailSheet
        open={sheet.open}
        onClose={sheet.closeSheet}
        title="Soluciones corporativas AIL"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {details.map((item) => (
            <AILCard key={item.title} variant="compact">
              <AILCardTitle className="text-lg">{item.title}</AILCardTitle>
              <AILCardText>{item.text}</AILCardText>
            </AILCard>
          ))}
        </div>
        <AILButton href="#contacto" className="mt-6" onClick={sheet.closeSheet}>
          Solicitar información corporativa
        </AILButton>
      </DetailSheet>
    </section>
  );
}
