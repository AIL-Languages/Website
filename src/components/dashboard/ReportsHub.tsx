import Link from "next/link";
import { introForRole, reportsForRole } from "@/lib/reports/catalog";
import type { UserRole } from "@/lib/auth/admin";

type Props = { role: UserRole };

export function ReportsHub({ role }: Props) {
  const cards = reportsForRole(role);

  return (
    <div className="space-y-6">
      <p className="rounded-[1.5rem] bg-white p-5 text-sm text-muted">
        {introForRole(role)} Documentos PDF procesa lo que entra al sistema;
        Reportes genera los documentos que salen.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((item) => (
          <Link
            key={`${item.kind}-${item.href}`}
            href={item.href}
            className="rounded-[1.5rem] bg-white p-6 transition hover:ring-2 hover:ring-cyan/40"
          >
            <h3 className="font-display text-lg font-semibold text-navy">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{item.text}</p>
            <p className="mt-4 text-sm font-semibold text-cyan">Abrir →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
