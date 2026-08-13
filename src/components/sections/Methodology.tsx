"use client";

import Image from "next/image";
import { ExpandInline } from "@/components/ui/ExpandInline";
import {
  AILCard,
  AILCardText,
  AILCardTitle,
  AILIconBubble,
} from "@/components/ui/AILCard";
import { AILButton } from "@/components/ui/AILButton";
import {
  IconHandshake,
  IconMessagesCircle,
  IconUserCheck,
  IconVideo,
} from "@/components/director/icons";

const pillars = [
  {
    title: "Comunicativa",
    text: "Practica el idioma desde la primera clase.",
    Icon: IconMessagesCircle,
  },
  {
    title: "Personalizada",
    text: "Avanza según tus objetivos y ritmo.",
    Icon: IconUserCheck,
  },
  {
    title: "Aplicación real",
    text: "Utiliza el idioma en situaciones cotidianas.",
    Icon: IconHandshake,
  },
  {
    title: "100 % online",
    text: "Aprende en vivo desde cualquier lugar.",
    Icon: IconVideo,
  },
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
    <section id="metodologia" className="ail-section ail-section--navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="ail-kicker">Metodología</p>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Aprende el idioma utilizándolo
        </h2>
        <p className="ail-lead mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
          Enfoque práctico y comunicativo para desenvolverte con seguridad.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((item) => (
            <AILCard key={item.title} variant="compact" align="center">
              <AILIconBubble>
                <item.Icon />
              </AILIconBubble>
              <AILCardTitle>{item.title}</AILCardTitle>
              <AILCardText>{item.text}</AILCardText>
            </AILCard>
          ))}
        </div>

        <ExpandInline summary="Conocer nuestra metodología">
          <div className="grid gap-4 lg:grid-cols-2">
            {modalities.map((item) => (
              <AILCard key={item.title} variant="dark">
                <AILCardTitle>{item.title}</AILCardTitle>
                <AILCardText>{item.text}</AILCardText>
              </AILCard>
            ))}
            <AILCard className="lg:col-span-2">
              <div className="flex w-full flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-7 sm:text-left">
                <Image
                  src="/images/smrt-english-logo.png"
                  alt="Smrt English, plataforma educativa utilizada por A-Inman Languages"
                  width={570}
                  height={164}
                  className="h-auto w-[132px] shrink-0 rounded-xl bg-white p-2 object-contain sm:w-[170px]"
                />
                <div className="min-w-0">
                  <AILCardTitle>Tu aprendizaje continúa fuera de clase</AILCardTitle>
                  <AILCardText className="mt-2 max-w-none">
                    Complementa tus clases con actividades, recursos interactivos y
                    práctica adicional mediante la plataforma educativa Smrt English.
                  </AILCardText>
                  <p className="ail-card-text mt-1.5">
                    Disponible para estudiantes inscritos en los programas de inglés de
                    AIL.
                  </p>
                  <AILButton
                    href="https://smrtenglish.com/"
                    external
                    arrow
                    className="mt-3"
                  >
                    Conoce Smrt English
                  </AILButton>
                </div>
              </div>
            </AILCard>
          </div>
        </ExpandInline>
      </div>
    </section>
  );
}
