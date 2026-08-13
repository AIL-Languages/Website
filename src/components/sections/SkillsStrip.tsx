import {
  IconBookOpen,
  IconHeadphones,
  IconMessagesCircle,
  IconPenLine,
} from "@/components/director/icons";

const skills = [
  { title: "Listening", Icon: IconHeadphones },
  { title: "Speaking", Icon: IconMessagesCircle },
  { title: "Reading", Icon: IconBookOpen },
  { title: "Writing", Icon: IconPenLine },
] as const;

export function SkillsStrip() {
  return (
    <section className="bg-mist py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {skills.map((skill) => (
            <article
              key={skill.title}
              className="flex items-center gap-3 rounded-2xl border border-navy/8 bg-white px-4 py-3"
            >
              <skill.Icon className="h-5 w-5 shrink-0 text-ail-cyan" />
              <p className="font-display text-base font-semibold text-navy">{skill.title}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Desarrollamos integralmente las cuatro habilidades del idioma.
        </p>
      </div>
    </section>
  );
}
