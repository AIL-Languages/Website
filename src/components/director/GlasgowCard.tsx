import { glasgowProgram } from "@/lib/director/data";
import { FlagScotland } from "@/components/director/CountryFlags";
import { FadeUp } from "@/components/director/FadeUp";

export function GlasgowCard() {
  return (
    <FadeUp>
      <article className="relative overflow-hidden rounded-[1.75rem] border border-ail-cyan/35 bg-card p-6 shadow-[0_16px_40px_rgba(0,224,230,0.08)] sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-55"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--ail-cyan) 42%, transparent), transparent 70%)",
          }}
        />
        <div className="relative flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-white/20 shadow-md">
            <FlagScotland className="h-full w-full" title="Bandera de Escocia" />
          </span>
          <div>
            <h4 className="font-display text-xl font-bold text-ink">
              {glasgowProgram.institution}
            </h4>
            <p className="mt-1 text-sm font-semibold text-muted">
              {glasgowProgram.location}
            </p>
            <p className="mt-2 text-sm font-semibold text-ail-blue">
              {glasgowProgram.degree}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
              {glasgowProgram.years}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              {glasgowProgram.text}
            </p>
          </div>
        </div>
      </article>
    </FadeUp>
  );
}
