export const languages = [
  { value: "ingles", label: "Inglés" },
  { value: "portugues", label: "Portugués" },
  { value: "espanol", label: "Español para extranjeros" },
] as const;

export const levels = [
  { value: "diagnostico", label: "Por diagnosticar" },
  { value: "A1", label: "A1 – Beginner" },
  { value: "A2", label: "A2 – Elementary" },
  { value: "B1", label: "B1 – Intermediate" },
  { value: "B2", label: "B2 – Upper Intermediate" },
  { value: "C1", label: "C1 – Advanced" },
  { value: "C2", label: "C2 – Proficiency" },
] as const;

export const languageCodes: Record<string, string> = {
  ingles: "EN",
  portugues: "PT",
  espanol: "ES",
};

export const languageNamesEn: Record<string, string> = {
  ingles: "English",
  portugues: "Portuguese",
  espanol: "Spanish",
};

export const plans = [
  { value: "personalizada", label: "Clases personalizadas" },
  { value: "grupo", label: "Grupo reducido" },
  { value: "business", label: "English for Business" },
  { value: "stem", label: "English + STEM" },
  { value: "certificacion", label: "Preparación para certificaciones" },
] as const;

export const programs = [
  { value: "corporativo", label: "Programa corporativo" },
  { value: "business", label: "English for Business" },
  { value: "grupos", label: "Grupos reducidos" },
  { value: "personalizado", label: "Clases personalizadas para equipos" },
  { value: "certificacion", label: "Preparación para certificaciones" },
] as const;

export const teacherStatuses = [
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
] as const;

export function optionLabel(
  options: readonly { value: string; label: string }[],
  value?: string,
) {
  return options.find((item) => item.value === value)?.label || value || "—";
}
