import { AdminLogForm } from "@/components/dashboard/AdminLogForm";
import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { getAcademicBundle } from "@/lib/academic/store";
import { languages } from "@/lib/academic/options";
import { listProfiles, requireAdmin } from "@/lib/auth/profile";
import { teacherLoad } from "@/lib/ops/load";
import { listPayments } from "@/lib/ops/payments";
import { getSettings } from "@/lib/settings/store";

export const metadata = { title: "Panel administrativo" };

function money(value: string) {
  const n = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default async function AdminOverviewPage() {
  await requireAdmin();
  const [users, payments, academic, settings] = await Promise.all([
    listProfiles(),
    listPayments(),
    getAcademicBundle(),
    getSettings(),
  ]);

  const students = users.filter((item) => item.role === "student");
  const teachers = users.filter((item) => item.role === "teacher");
  const companies = users.filter((item) => item.role === "company");
  const activeStudents = students.filter((item) => item.accountStatus === "activo");
  const activeTeachers = teachers.filter((item) => item.accountStatus === "activo");
  const now = new Date();
  const newThisMonth = students.filter((item) => {
    const created = new Date(item.createdAt);
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;
  const paused = students.filter(
    (item) =>
      item.accountStatus === "inactivo" ||
      item.details.academicStatus === "pausa" ||
      item.details.academicStatus === "baja",
  ).length;

  const byLanguage = languages.map((language) => ({
    label: language.label,
    count: students.filter((item) => item.details.language === language.value).length,
  }));

  const income = payments
    .filter((item) => item.status === "pagado")
    .reduce((sum, item) => sum + money(item.amount), 0);

  const occupancy = teachers.map((teacher) => teacherLoad(teacher, academic.groups));
  const assigned = occupancy.reduce((sum, item) => sum + item.assigned, 0);
  const max = occupancy.reduce((sum, item) => sum + item.max, 0);

  const kpis = [
    { label: "Alumnos activos", value: String(activeStudents.length) },
    { label: "Profesores activos", value: String(activeTeachers.length) },
    { label: "Grupos", value: String(academic.groups.length) },
    { label: "Clientes corporativos", value: String(companies.length) },
  ];

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Panel administrativo"
        title={`Resumen de ${settings.institutionName}`}
        text="Indicadores, estadísticas y operación general. No duplica la configuración: aquí se decide con datos."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <article key={item.label} className="rounded-[1.5rem] bg-white p-6">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-navy">
              {item.value}
            </p>
          </article>
        ))}
      </div>

      <section className="rounded-[1.75rem] bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy">
          Distribución por idioma
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          {byLanguage.map((item) => (
            <li key={item.label}>
              {item.label} — {item.count} alumnos
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.5rem] bg-white p-6">
          <p className="text-sm text-muted">Alumnos nuevos este mes</p>
          <p className="mt-2 font-display text-2xl font-semibold text-navy">{newThisMonth}</p>
        </article>
        <article className="rounded-[1.5rem] bg-white p-6">
          <p className="text-sm text-muted">Bajas / pausas</p>
          <p className="mt-2 font-display text-2xl font-semibold text-navy">{paused}</p>
        </article>
        <article className="rounded-[1.5rem] bg-white p-6">
          <p className="text-sm text-muted">Clases programadas</p>
          <p className="mt-2 font-display text-2xl font-semibold text-navy">
            {academic.schedules.length}
          </p>
        </article>
        <article className="rounded-[1.5rem] bg-white p-6">
          <p className="text-sm text-muted">Ocupación docente</p>
          <p className="mt-2 font-display text-2xl font-semibold text-navy">
            {max ? `${assigned} / ${max} h` : `${assigned} h asignadas`}
          </p>
        </article>
      </div>

      <article className="rounded-[1.5rem] bg-navy p-6 text-white">
        <p className="text-sm text-white/70">Ingresos registrados (pagos confirmados)</p>
        <p className="mt-2 font-display text-3xl font-semibold">
          ${income.toLocaleString("es-MX")}
        </p>
      </article>

      <AdminLogForm entries={settings.log} />
    </main>
  );
}
