export type FaqAudience =
  | "prospect"
  | "student"
  | "teacher"
  | "company"
  | "translation-client";

export type FaqCategoryId =
  | "courses"
  | "schedule"
  | "platform"
  | "payments"
  | "certifications"
  | "companies"
  | "translations";

export type FaqCta = {
  label: string;
  /** Ancla o ruta existente. `null` = pendiente; no se renderiza el enlace. */
  href: string | null;
  external?: boolean;
  /** Prefija el formulario de contacto al navegar a `#contacto`. */
  contactInterest?: string;
};

export type FaqItem = {
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: string;
  keywords: string[];
  audience?: FaqAudience | FaqAudience[];
  relatedRoute?: string | null;
  cta?: FaqCta;
  ctaLabel?: string;
  priority?: number;
  isPublic: boolean;
};

export type FaqCategory = {
  id: FaqCategoryId | "all";
  label: string;
};
