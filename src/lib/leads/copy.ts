import { interestLabels } from "@/lib/interests";
import type { LeadCopyVariant, LeadSource } from "@/lib/leads/types";

function interestKey(interest: string) {
  return interest.trim().toLowerCase();
}

export function leadVariant(interest: string): LeadCopyVariant {
  const key = interestKey(interest);
  if (key === "empresas" || key === "convenios" || key === "corporate") {
    return "corporate";
  }
  if (key === "traduccion" || key === "translation") return "translation";
  return "program";
}

export function leadSourceFor(interest: string, requested?: string): LeadSource {
  if (requested === "website-corporate") return "website-corporate";
  if (requested === "website-translation") return "website-translation";
  if (requested === "website-partnerships") return "website-partnerships";
  if (requested === "website-contact") return "website-contact";
  const key = interestKey(interest);
  if (key === "empresas" || key === "corporate") return "website-corporate";
  if (key === "traduccion" || key === "translation") return "website-translation";
  if (key === "convenios") return "website-partnerships";
  return "website-contact";
}

/** Título del interés, comprensible sin banderas/emojis. */
export function serviceHeading(interest: string) {
  switch (interestKey(interest)) {
    case "ingles":
    case "english":
      return "Inglés · Estados Unidos / Canadá / Reino Unido";
    case "portugues":
    case "portuguese":
      return "Portugués · Brasil";
    case "espanol":
    case "spanish":
      return "Español para extranjeros · México";
    case "empresas":
    case "corporate":
      return "Programas para empresas";
    case "traduccion":
    case "translation":
      return "Traducción e interpretación";
    default:
      return interestLabels[interestKey(interest)] || interest.trim();
  }
}

export function serviceLabel(interest: string) {
  const key = interestKey(interest);
  return interestLabels[key] || serviceHeading(interest);
}

export function receivedMessage(variant: LeadCopyVariant) {
  if (variant === "corporate") {
    return "Hemos recibido tu solicitud relacionada con los servicios corporativos de AIL. Nuestro equipo revisará las necesidades indicadas para orientarte sobre las alternativas de capacitación lingüística disponibles para tu organización.";
  }
  if (variant === "translation") {
    return "Hemos recibido tu solicitud relacionada con nuestros servicios de traducción e interpretación. Nuestro equipo revisará la información proporcionada para continuar con el proceso correspondiente.";
  }
  return "Hemos recibido correctamente tu solicitud de información sobre:";
}
