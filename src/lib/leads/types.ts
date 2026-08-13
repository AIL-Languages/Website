export const LEAD_STATUSES = ["new"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = [
  "website-contact",
  "website-corporate",
  "website-translation",
  "website-partnerships",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  goals: string;
  availability: string;
  company: string;
  source: LeadSource;
  requestId: string;
};

export type LeadRecord = {
  id: string;
  email: string;
  welcomeEmailSent: boolean;
  duplicate: boolean;
};

export type LeadCopyVariant = "corporate" | "translation" | "program";
