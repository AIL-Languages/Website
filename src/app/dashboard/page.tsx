import { AdminPanel } from "@/components/dashboard/AdminPanel";
import { AccessDeniedNotice } from "@/components/dashboard/AccessDeniedNotice";
import { CompanyPanel } from "@/components/dashboard/CompanyPanel";
import { CoordinatorHome } from "@/components/dashboard/CoordinatorHome";
import { ReportsEntryCard } from "@/components/dashboard/ReportsEntryCard";
import { SmrtReminderCard } from "@/components/dashboard/SmrtReminderCard";
import {
  AILCard,
  AILCardText,
  AILCardTitle,
} from "@/components/ui/AILCard";
import { AILButton } from "@/components/ui/AILButton";
import {
  ACCESS_DENIED_QUERY,
  canManageSystem,
  roleLabel,
} from "@/lib/auth/admin";
import { listProfiles, requireProfile } from "@/lib/auth/profile";
import { site, whatsappLink } from "@/lib/site";
import { usesStudentSmrtExperience } from "@/lib/smrt";

export const metadata = {
  title: "Dashboard",
};

function greeting(role: string) {
  if (role === "admin") {
    return `Panel de administración de ${site.name}.`;
  }
  if (role === "coordinator") {
    return `Panel operativo de coordinación académica en ${site.name}.`;
  }
  if (role === "teacher") {
    return `Este es tu espacio docente en ${site.name}.`;
  }
  if (role === "company") {
    return `Administra los alumnos de tu empresa y consulta el servicio contratado.`;
  }
  return `Este es tu espacio de alumno en ${site.name}.`;
}

function nextSteps(role: string) {
  if (role === "coordinator") {
    return [
      "Revisa altas de alumnos y profesores.",
      "Arma grupos, horarios y niveles.",
      "Comparte la guía Smrt English con tus grupos.",
    ];
  }
  if (role === "teacher") {
    return [
      "Entra a Smrt English y revisa tus clases.",
      "Asigna actividades y evaluaciones.",
      "Recuerda a tus alumnos la 1 hora semanal en plataforma.",
    ];
  }
  if (role === "company") {
    return [
      "Confirma el programa contratado y el número de alumnos.",
      "Comparte Smrt English con tus colaboradores.",
      "Registra a quienes tomarán clases.",
    ];
  }
  if (role === "admin") {
    return [
      "Supervisa usuarios, pagos y configuración del sistema.",
      "Revisa plantilla docente y operación académica.",
      "Da seguimiento al uso de Smrt English.",
    ];
  }
  return [
    "Completa tu disponibilidad y fecha deseada de inicio si aún no lo hiciste.",
    "Cuando te asignen profesor, agenda tu primera clase en Mis clases.",
    "Complementa con al menos 1 hora semanal en Smrt English.",
  ];
}

type Props = {
  searchParams: Promise<{ aviso?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const user = await requireProfile();
  const params = await searchParams;
  const isAdmin = canManageSystem(user.role, user.email);
  const users = user.role === "company" ? await listProfiles() : [];
  const companyStudents = users.filter(
    (item) =>
      item.role === "student" &&
      (item.details.companyId === user.id ||
        item.createdBy === user.id ||
        Boolean(
          user.details.companyLegalName &&
            item.details.companyName === user.details.companyLegalName,
        )),
  );

  return (
    <main>
      <AccessDeniedNotice show={params.aviso === ACCESS_DENIED_QUERY} />
      <section className="rounded-[2rem] bg-navy px-6 py-8 text-white sm:px-10">
        <p className="ail-kicker text-lime">Inicio</p>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Hola, {user.name}
        </h1>
        <p className="ail-lead mt-3 max-w-2xl">{greeting(user.role)}</p>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <AILCard className="lg:col-span-2">
          <AILCardTitle className="text-xl">Próximos pasos</AILCardTitle>
          <ul className="space-y-3 text-sm text-[color:var(--ail-text-muted-light)]">
            {nextSteps(user.role).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap gap-3">
            {user.role === "student" ? (
              <AILButton href="/dashboard/clases">Ir a Mis clases</AILButton>
            ) : (
              <AILButton href="/dashboard/smrt-english">Ir a Smrt English</AILButton>
            )}
            <AILButton
              href={whatsappLink(
                `Hola, soy ${user.name}. Ya tengo cuenta en el dashboard (${roleLabel(user.role)}) y quiero continuar.`,
              )}
              external
              variant="secondary"
            >
              Escribir por WhatsApp
            </AILButton>
          </div>
        </AILCard>

        {usesStudentSmrtExperience(user.role) || user.role === "teacher" ? (
          <SmrtReminderCard />
        ) : (
          <AILCard>
            <AILCardTitle className="text-xl">Smrt English</AILCardTitle>
            <AILCardText>
              Recursos y guía de uso para alumnos y profesores, integrados al
              ecosistema AIL.
            </AILCardText>
            <AILButton href="/dashboard/smrt-english" arrow>
              Abrir pestaña Smrt English
            </AILButton>
          </AILCard>
        )}
      </section>

      {isAdmin ? <AdminPanel role={user.role} email={user.email} /> : null}
      {user.role === "coordinator" ? (
        <CoordinatorHome role={user.role} email={user.email} />
      ) : null}
      {user.role === "company" ? (
        <CompanyPanel user={user} students={companyStudents} />
      ) : null}
      {user.role === "student" || user.role === "teacher" ? (
        <section className="mt-8">
          <ReportsEntryCard />
        </section>
      ) : null}
    </main>
  );
}
