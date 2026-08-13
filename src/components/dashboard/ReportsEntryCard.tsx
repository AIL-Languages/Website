import { AILCard, AILCardText, AILCardTitle } from "@/components/ui/AILCard";
import { AILButton } from "@/components/ui/AILButton";

export function ReportsEntryCard() {
  return (
    <AILCard>
      <p className="ail-card-badge">Próximamente</p>
      <AILCardTitle>Reportes</AILCardTitle>
      <AILCardText>
        Generación y exportación de reportes académicos, administrativos,
        financieros y corporativos, incluyendo asistencia, progreso académico,
        diplomas y constancias.
      </AILCardText>
      <AILButton href="/dashboard/reportes" arrow>
        Abrir módulo
      </AILButton>
    </AILCard>
  );
}
