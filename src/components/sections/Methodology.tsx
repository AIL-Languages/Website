import type { ComponentType } from "react";
import {
  IconBookOpen,
  IconHeadphones,
  IconMessagesCircle,
  IconPenLine,
} from "@/components/director/icons";

type Skill = {
  title: string;
  subtitle: string;
  Icon: ComponentType<{ className?: string }>;
  iconClass: string;
  ringClass: string;
  glowClass: string;
  lineClass: string;
};

const skills: Skill[] = [
  {
    title: "Listening",
    subtitle: "Comprensión auditiva",
    Icon: IconHeadphones,
    iconClass: "text-[#168BFF]",
    ringClass: "border-[#168BFF]/35 bg-[#168BFF]/12",
    glowClass: "group-hover:shadow-[0_0_24px_rgba(22,139,255,0.35)]",
    lineClass: "bg-[#168BFF]",
  },
  {
    title: "Speaking",
    subtitle: "Comunicación oral",
    Icon: IconMessagesCircle,
    iconClass: "text-[#00E0E6]",
    ringClass: "border-[#00E0E6]/35 bg-[#00E0E6]/12",
    glowClass: "group-hover:shadow-[0_0_24px_rgba(0,224,230,0.35)]",
    lineClass: "bg-[#00E0E6]",
  },
  {
    title: "Reading",
    subtitle: "Comprensión lectora",
    Icon: IconBookOpen,
    iconClass: "text-[#2ad4c8]",
    ringClass: "border-[#2ad4c8]/35 bg-[#2ad4c8]/12",
    glowClass: "group-hover:shadow-[0_0_24px_rgba(42,212,200,0.35)]",
    lineClass: "bg-[#2ad4c8]",
  },
  {
    title: "Writing",
    subtitle: "Expresión escrita",
    Icon: IconPenLine,
    iconClass: "text-[#00F0A3]",
    ringClass: "border-[#00F0A3]/35 bg-[#00F0A3]/12",
    glowClass: "group-hover:shadow-[0_0_24px_rgba(0,240,163,0.35)]",
    lineClass: "bg-[#00F0A3]",
  },
];

const complements = ["Grammar", "Vocabulary", "Pronunciation", "Conversation"];

export function Methodology() {
  return (
    <section id="metodologia" className="bg-mist py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            Nuestra metodología
          </p>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Aprende el idioma utilizándolo.
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">
            Combinamos un enfoque práctico y comunicativo —método directo y
            acercamiento comunicativo— para desarrollar las habilidades necesarias
            en situaciones reales.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[1.75rem] bg-ail-navy p-5 sm:p-7">
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ail-cyan">
            Language skills
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {skills.map((skill) => (
              <article
                key={skill.title}
                className={`group flex h-full flex-col items-center rounded-[1.35rem] border border-white/10 bg-[#0c2748] px-4 py-6 text-center transition duration-300 hover:-translate-y-1 hover:border-ail-cyan/45 ${skill.glowClass}`}
              >
                <span
                  className={`relative inline-flex h-16 w-16 items-center justify-center rounded-full border sm:h-[68px] sm:w-[68px] ${skill.ringClass} transition duration-300 motion-safe:group-hover:scale-[1.08]`}
                >
                  <skill.Icon
                    className={`h-7 w-7 sm:h-8 sm:w-8 ${skill.iconClass} transition duration-300`}
                  />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-white sm:text-xl">
                  {skill.title}
                </h3>
                <p className="mt-1 text-xs text-white/65 sm:text-sm">
                  {skill.subtitle}
                </p>
                <span
                  aria-hidden
                  className={`mt-3 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-10 ${skill.lineClass}`}
                />
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {complements.map((item) => (
            <span
              key={item}
              className="rounded-full border border-cyan/30 bg-card px-4 py-2 text-sm font-semibold text-ink"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <article className="rounded-[1.75rem] bg-ail-navy p-8 text-white">
            <h3 className="font-display text-2xl font-semibold">Modalidades</h3>
            <div className="mt-8 space-y-6">
              <div>
                <p className="text-lg font-semibold text-cyan-soft">
                  Clases personalizadas
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Para estudiantes que desean avanzar de acuerdo con sus propias
                  necesidades, disponibilidad y objetivos.
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-lime">Grupos reducidos</p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Grupos virtuales de máximo cinco estudiantes para mantener una
                  experiencia dinámica y atención cercana. Clases en Zoom.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-navy/10 bg-card p-8">
            <h3 className="font-display text-2xl font-semibold text-ink">
              Tu aprendizaje continúa fuera de clase
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              AIL complementa las clases de inglés con herramientas digitales y
              material educativo para practicar diferentes habilidades lingüísticas.
            </p>
            <a
              href="https://www.smrtenglish.com/smrt/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-display text-xl font-semibold text-cyan underline-offset-4 transition hover:text-cyan-bright hover:underline"
            >
              Smrt English
            </a>
            <p className="mt-2 text-sm text-muted">
              Plataforma educativa para practicar Listening, Speaking, Reading,
              Writing, Vocabulary y Grammar, con acceso 24/7 a contenidos y
              ejercicios.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
