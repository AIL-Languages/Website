import { careerTimeline } from "@/lib/director/data";
import { FadeUp } from "@/components/director/FadeUp";

const nodeColors = [
  "bg-ail-blue",
  "bg-ail-cyan",
  "bg-ail-cyan",
  "bg-ail-green",
];

export function CareerTimeline() {
  return (
    <FadeUp>
      <div className="mb-8 max-w-2xl">
        <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Trayectoria docente y profesional
        </h3>
        <p className="mt-2 text-sm font-semibold text-muted sm:text-base">
          Experiencia en enseñanza de idiomas desde 2012
        </p>
      </div>

      {/* Mobile vertical */}
      <ol className="relative space-y-6 border-l border-ail-cyan/30 pl-6 md:hidden">
        {careerTimeline.map((item, index) => (
          <li key={item.id} className="relative">
            <span
              className={`absolute -left-[1.9rem] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-background ${nodeColors[index]}`}
            />
            <p className="text-xs font-semibold uppercase tracking-wide text-ail-blue">
              {item.period}
            </p>
            <h4 className="mt-1 font-display text-lg font-semibold text-ink">
              {item.title}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
          </li>
        ))}
      </ol>

      {/* Desktop horizontal */}
      <ol className="relative hidden gap-4 md:grid md:grid-cols-4">
        <div
          aria-hidden
          className="absolute left-[6%] right-[6%] top-[18px] h-[2px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--ail-blue), var(--ail-cyan), var(--ail-green))",
          }}
        />
        {careerTimeline.map((item, index) => (
          <li key={item.id} className="relative pt-10">
            <span
              className={`absolute left-0 top-[11px] h-4 w-4 rounded-full ring-4 ring-background ${nodeColors[index]}`}
            />
            <p className="text-xs font-semibold uppercase tracking-wide text-ail-blue">
              {item.period}
            </p>
            <h4 className="mt-2 font-display text-lg font-semibold text-ink">
              {item.title}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
          </li>
        ))}
      </ol>
    </FadeUp>
  );
}
