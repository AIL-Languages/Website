export type PartnershipStatusKind = "comingSoon" | "active" | "paused";

export type PartnershipType =
  | "institutional"
  | "benefit-program"
  | "university"
  | "corporate"
  | "civil-association"
  | "social-program"
  | "academic";

export type Partnership = {
  id: string;
  name: string;
  partnershipType: PartnershipType;
  status: PartnershipStatusKind;
  description: string;
  /** Descuento o beneficio confirmado; null mientras se reactiva. */
  benefit: string | null;
  /** Ruta a logo oficial autorizado; null = presentación tipográfica. */
  logo: string | null;
  monogram: string;
  contactInterestValue: string;
};

export const partnershipTypeLabels: Record<PartnershipType, string> = {
  institutional: "Convenio institucional",
  "benefit-program": "Programa de beneficio",
  university: "Convenio universitario",
  corporate: "Convenio empresarial",
  "civil-association": "Asociación civil",
  "social-program": "Programa social",
  academic: "Colaboración académica",
};

export const partnerships: Partnership[] = [
  {
    id: "ymca",
    name: "YMCA",
    partnershipType: "institutional",
    status: "comingSoon",
    description:
      "Beneficios especiales para personas elegibles conforme al convenio con A-Inman Languages.",
    benefit: null,
    logo: null,
    monogram: "YMCA",
    contactInterestValue: "convenios",
  },
  {
    id: "rotary",
    name: "Rotary International",
    partnershipType: "institutional",
    status: "comingSoon",
    description:
      "Beneficios preferenciales para personas elegibles conforme a los acuerdos de colaboración con A-Inman Languages.",
    benefit: null,
    logo: null,
    monogram: "RI",
    contactInterestValue: "convenios",
  },
  {
    id: "juntas-podemos-ahorrar",
    name: "Juntas Podemos Ahorrar",
    partnershipType: "benefit-program",
    status: "comingSoon",
    description:
      "Beneficio especial dirigido a mujeres participantes elegibles dentro del programa de colaboración con A-Inman Languages.",
    benefit: null,
    logo: null,
    monogram: "JP",
    contactInterestValue: "convenios",
  },
];

export const PARTNERSHIP_SHOW_ALL_THRESHOLD = 6;
