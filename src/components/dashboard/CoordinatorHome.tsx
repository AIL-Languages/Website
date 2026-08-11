import Link from "next/link";

const modules = [
  {
    href: "/dashboard/usuarios",
    title: "Usuarios",
    text: "Altas de alumnos y profesores, y cuentas de acceso.",
  },
  {
    href: "/dashboard/pagos",
    title: "Pagos",
    text: "Seguimiento de cobros y comprobantes por verificar.",
  },
  {
    href: "/dashboard/profesores",
    title: "Profesores",
    text: "Expediente docente, disponibilidad y carga académica.",
  },
  {
    href: "/dashboard/coordinacion",
    title: "Coordinación académica",
    text: "Grupos, horarios, asignaciones y seguimiento.",
  },
  {
    href: "/dashboard/reportes",
    title: "Reportes",
    text: "Asistencia, avances, evaluaciones, diplomas emitidos y exportación PDF.",
  },
];

export function CoordinatorHome() {
  return (
    <section className="mt-10 space-y-6">
      <div className="rounded-[1.75rem] bg-navy p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
          Coordinación académica
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Operación diaria de AIL
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-white/75">
          Administra quién estudia qué, con quién y cómo avanza. Las cuentas de
          acceso se gestionan en Usuarios; el expediente docente, en Profesores.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((item) => (
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
      </div>
    </section>
  );
}
