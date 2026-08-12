export const CONTACT_INTEREST_KEY = "ail-contact-interest";
export const CONTACT_INTEREST_EVENT = "ail:contact-interest";

export const interestOptions = [
  { value: "", label: "Selecciona (opcional)" },
  { value: "ingles", label: "Inglés" },
  { value: "portugues", label: "Portugués" },
  { value: "espanol", label: "Español para extranjeros" },
  { value: "ielts", label: "IELTS" },
  { value: "toefl-ibt", label: "TOEFL iBT" },
  { value: "toefl-itp", label: "TOEFL ITP" },
  { value: "celpe-bras", label: "CELPE-BRAS" },
  { value: "certificaciones", label: "Preparación para certificaciones" },
  { value: "empresas", label: "Programas corporativos" },
  { value: "convenios", label: "Convenios y alianzas institucionales" },
  { value: "traduccion", label: "Traducción / Interpretación" },
] as const;

export const interestLabels: Record<string, string> = {
  ingles: "Inglés",
  portugues: "Portugués",
  espanol: "Español para extranjeros",
  ielts: "IELTS",
  "toefl-ibt": "TOEFL iBT",
  "toefl-itp": "TOEFL ITP",
  "celpe-bras": "CELPE-BRAS",
  certificaciones: "Preparación para certificaciones",
  empresas: "Programas corporativos",
  convenios: "Convenios y alianzas institucionales",
  traduccion: "Traducción / Interpretación",
};

export function setContactInterest(value: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CONTACT_INTEREST_KEY, value);
  window.dispatchEvent(
    new CustomEvent(CONTACT_INTEREST_EVENT, { detail: value }),
  );
}

export function readContactInterest(): string | null {
  if (typeof window === "undefined") return null;
  const fromQuery = new URLSearchParams(window.location.search).get("interest");
  if (fromQuery && fromQuery in interestLabels) return fromQuery;
  return sessionStorage.getItem(CONTACT_INTEREST_KEY);
}
