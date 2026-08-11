import { site } from "@/lib/site";

export function SmrtReminderCard() {
  return (
    <article className="rounded-[1.5rem] border border-cyan/25 bg-white p-6 shadow-[0_12px_40px_rgba(0,26,61,0.06)]">
      <p className="text-sm font-semibold text-navy">💡 Recuerda</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Dedica al menos <strong className="text-ink">1 hora semanal</strong> a
        trabajar en Smrt English para complementar tus clases y mantener un
        progreso académico constante.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        La inactividad puede bloquear tu cuenta. Si eso ocurre, contacta a
        Coordinación Académica para recuperar el acceso.
      </p>
      <a
        href={site.smrtAccessUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep transition hover:bg-cyan-bright"
      >
        Ir a Smrt English →
      </a>
    </article>
  );
}
