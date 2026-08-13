import { AILCard, AILCardText, AILCardTitle } from "@/components/ui/AILCard";
import { AILButton } from "@/components/ui/AILButton";
import { introForRole, reportsForRole } from "@/lib/reports/catalog";
import type { UserRole } from "@/lib/auth/admin";

type Props = { role: UserRole };

export function ReportsHub({ role }: Props) {
  const cards = reportsForRole(role);

  return (
    <div className="space-y-4">
      <AILCard variant="compact">
        <AILCardText className="max-w-none">
          {introForRole(role)} Documentos PDF procesa lo que entra al sistema;
          Reportes genera los documentos que salen.
        </AILCardText>
      </AILCard>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((item) => (
          <AILCard key={`${item.kind}-${item.href}`}>
            <AILCardTitle>{item.title}</AILCardTitle>
            <AILCardText>{item.text}</AILCardText>
            <AILButton href={item.href} arrow>
              Abrir
            </AILButton>
          </AILCard>
        ))}
      </div>
    </div>
  );
}
