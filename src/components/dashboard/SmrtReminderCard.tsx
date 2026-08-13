import { site } from "@/lib/site";
import { AILCard, AILCardText } from "@/components/ui/AILCard";
import { AILButton } from "@/components/ui/AILButton";

export function SmrtReminderCard() {
  return (
    <AILCard>
      <p className="ail-card-title text-base">Recuerda</p>
      <AILCardText>
        Dedica al menos <strong>1 hora semanal</strong> a trabajar en Smrt
        English para complementar tus clases y mantener un progreso académico
        constante.
      </AILCardText>
      <AILCardText>
        La inactividad puede bloquear tu cuenta. Si eso ocurre, contacta a
        Coordinación Académica para recuperar el acceso.
      </AILCardText>
      <AILButton href={site.smrtAccessUrl} external arrow>
        Ir a Smrt English
      </AILButton>
    </AILCard>
  );
}
