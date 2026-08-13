import {
  IconBookOpen,
  IconHeadphones,
  IconMessagesCircle,
  IconPenLine,
} from "@/components/director/icons";
import {
  AILCard,
  AILCardTitle,
  AILIconBubble,
} from "@/components/ui/AILCard";

const skills = [
  { title: "Comprensión auditiva", Icon: IconHeadphones },
  { title: "Expresión oral", Icon: IconMessagesCircle },
  { title: "Comprensión lectora", Icon: IconBookOpen },
  { title: "Expresión escrita", Icon: IconPenLine },
] as const;

export function SkillsStrip() {
  return (
    <section className="ail-section ail-section--navy-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <AILCard key={skill.title} variant="compact" align="center">
              <AILIconBubble>
                <skill.Icon />
              </AILIconBubble>
              <AILCardTitle className="text-base">{skill.title}</AILCardTitle>
            </AILCard>
          ))}
        </div>
        <p className="ail-lead mt-4 text-center text-sm">
          Desarrollamos integralmente las cuatro habilidades del idioma.
        </p>
      </div>
    </section>
  );
}
