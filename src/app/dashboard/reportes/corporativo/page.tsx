import { redirect } from "next/navigation";
import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { optionLabel, programs } from "@/lib/academic/options";
import { listProfiles, requireProfile } from "@/lib/auth/profile";
import { canViewCorporateReport, isCompanyStudent } from "@/lib/reports/access";
import { attendanceSummary, latestProgress } from "@/lib/reports/stats";
import { getReportsStore } from "@/lib/reports/store";

export const metadata = { title: "Reporte corporativo" };

export default async function CorporateReportPage() {
  const user = await requireProfile();
  if (!canViewCorporateReport(user)) redirect("/dashboard/reportes");
  const users = await listProfiles();
  const companies =
    user.role === "company"
      ? [user]
      : users.filter((item) => item.role === "company");
  const store = await getReportsStore();

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Reportes"
        title="Reporte corporativo"
        text="Progreso, asistencia y diplomas de colaboradores inscritos por empresa."
        backHref="/dashboard/reportes"
        backLabel="← Reportes"
      />
      {companies.map((company) => {
        const students = users.filter((item) => isCompanyStudent(company, item));
        const href =
          user.role === "company"
            ? "/api/reports/export?kind=corporativo"
            : `/api/reports/export?kind=corporativo&companyId=${company.id}`;
        return (
          <section key={company.id} className="rounded-[1.75rem] bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold text-navy">
                  {company.details.companyLegalName || company.name}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {students.length} colaboradores · {optionLabel(programs, company.details.program)}
                </p>
              </div>
              <a href={href} className="text-sm font-semibold text-cyan">
                Descargar PDF
              </a>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {students.map((student) => {
                const attendance = attendanceSummary(
                  store.attendance.filter((item) => item.studentId === student.id),
                );
                const progress = latestProgress(
                  store.progress.filter((item) => item.studentId === student.id),
                );
                const diploma = store.diplomas.find((item) => item.studentId === student.id);
                return (
                  <li key={student.id}>
                    {student.name} · asistencia {attendance.percent}% · progreso{" "}
                    {progress?.progressPercent ?? 0}%
                    {diploma ? ` · ${diploma.folio}` : ""}
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
