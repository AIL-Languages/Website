import { professionalOrganizations } from "@/lib/director/data";
import { FadeUp } from "@/components/director/FadeUp";

export function ProfessionalExperience() {
  return (
    <FadeUp>
      <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
        Experiencia académica y corporativa
      </h3>
      <ul className="mt-5 flex flex-wrap gap-2.5">
        {professionalOrganizations.map((name) => (
          <li
            key={name}
            className="rounded-full border border-[color:var(--border)] bg-mist/80 px-3.5 py-2 text-sm font-medium text-ink transition duration-300 hover:border-ail-cyan/50 hover:bg-card"
          >
            {name}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-muted sm:text-sm">
        Experiencia profesional docente directa y/o desarrollada mediante academias
        e instituciones educativas.
      </p>
    </FadeUp>
  );
}
