import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { languages, levels, optionLabel } from "@/lib/academic/options";
import { requireProfile } from "@/lib/auth/profile";
import { reportsContext } from "@/lib/reports/page-data";

export const metadata = { title: "Historial académico" };

export default async function HistoryReportPage() {
  const user = await requireProfile();
  const { students, completions, diplomas } = await reportsContext(user);
  const focus = user.role === "student" ? [user] : students;

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Reportes"
        title="Historial académico"
        text="Niveles cursados, resultados, profesores y diplomas emitidos."
        backHref="/dashboard/reportes"
        backLabel="← Reportes"
      />
      {focus.map((student) => {
        const items = completions.filter((item) => item.studentId === student.id);
        return (
          <section key={student.id} className="rounded-[1.75rem] bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-navy">
                {student.name}
              </h2>
              <a
                href={`/api/reports/export?kind=historial&studentId=${student.id}`}
                className="text-sm font-semibold text-cyan"
              >
                Descargar PDF
              </a>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {items.length === 0 ? <li>Sin historial registrado.</li> : null}
              {items.map((item) => {
                const diploma = diplomas.find(
                  (doc) =>
                    doc.studentId === item.studentId &&
                    doc.language === item.language &&
                    doc.level === item.level,
                );
                return (
                  <li key={item.id}>
                    <strong className="text-ink">
                      {optionLabel(languages, item.language)} · {optionLabel(levels, item.level)}
                    </strong>
                    {" · "}
                    {item.levelCompleted ? "Completado" : "En curso"}
                    {diploma ? ` · Folio ${diploma.folio}` : ""}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
