import Link from "next/link";

const adminModules = [
  {
    href: "/dashboard/cms",
    title: "CMS · Landing",
    text: "Gestor de contenido de la página pública. Contraseña exclusiva de administradora.",
  },
  {
    href: "/dashboard/correos",
    title: "Correos de bienvenida",
    text: "Edita y envía el correo de bienvenida para alumnos, profesores, coordinación y empresas.",
  },
  {
    href: "/dashboard/usuarios",
    title: "Usuarios",
    text: "Alta, edición, suspensión y búsqueda de cuentas de acceso.",
  },
  {
    href: "/dashboard/configuracion",
    title: "Configuración",
    text: "Datos institucionales, parámetros académicos, roles y notificaciones.",
  },
  {
    href: "/dashboard/panel",
    title: "Panel administrativo",
    text: "Indicadores, estadísticas y operación general de AIL.",
  },
  {
    href: "/dashboard/pagos",
    title: "Pagos y facturación",
    text: "Métodos de pago, comprobantes, solicitudes de factura e historial.",
  },
  {
    href: "/dashboard/documentos",
    title: "Documentos PDF",
    text: "Documentos que entran al sistema: certificaciones, CSF y comprobantes.",
  },
  {
    href: "/dashboard/profesores",
    title: "Profesores",
    text: "Expediente docente, disponibilidad, carga académica y estatus.",
  },
  {
    href: "/dashboard/coordinacion",
    title: "Coordinación académica",
    text: "Grupos, asignaciones, horarios, niveles y seguimiento.",
  },
  {
    href: "/dashboard/asignacion",
    title: "Asignación académica",
    text: "Match manual alumno ↔ profesor según idioma, nivel y disponibilidad.",
  },
];

export function AdminPanel() {
  return (
    <section className="mt-10 space-y-6">
      <div className="rounded-[1.75rem] bg-navy p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
          Administrador
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Acceso completo al sistema
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-white/75">
          Centro operativo de AIL: cuentas, academia, pagos, documentos y
          seguimiento.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminModules.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[1.5rem] bg-white p-6 transition hover:ring-2 hover:ring-cyan/40"
          >
            <h3 className="font-display text-lg font-semibold text-navy">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{item.text}</p>
            <p className="mt-4 text-sm font-semibold text-cyan">Abrir módulo →</p>
          </Link>
        ))}
        <Link
          href="/dashboard/reportes"
          className="rounded-[1.5rem] bg-white p-6 transition hover:ring-2 hover:ring-cyan/40"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-lime-deep">
            Próximamente
          </p>
          <h3 className="mt-2 font-display text-lg font-semibold text-navy">
            Reportes
          </h3>
          <p className="mt-2 text-sm text-muted">
            Generación y exportación de reportes académicos, administrativos,
            financieros y corporativos, incluyendo asistencia, progreso
            académico, diplomas y constancias.
          </p>
          <p className="mt-4 text-sm font-semibold text-cyan">Abrir módulo →</p>
        </Link>
      </div>
    </section>
  );
}
