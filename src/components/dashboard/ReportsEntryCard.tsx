import Link from "next/link";

export function ReportsEntryCard() {
  return (
    <Link
      href="/dashboard/reportes"
      className="block rounded-[1.5rem] bg-white p-6 transition hover:ring-2 hover:ring-cyan/40"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-lime-deep">
        Próximamente
      </p>
      <h3 className="mt-2 font-display text-lg font-semibold text-navy">Reportes</h3>
      <p className="mt-2 text-sm text-muted">
        Generación y exportación de reportes académicos, administrativos,
        financieros y corporativos, incluyendo asistencia, progreso académico,
        diplomas y constancias.
      </p>
      <p className="mt-4 text-sm font-semibold text-cyan">Abrir módulo →</p>
    </Link>
  );
}
