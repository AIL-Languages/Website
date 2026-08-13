export type CourseLanguage = "english" | "portuguese" | "spanish";

export function resolveCourseLanguage(value?: string | null): CourseLanguage | undefined {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (!normalized) return undefined;
  if (["ingles", "english", "en"].includes(normalized)) return "english";
  if (["portugues", "portuguese", "pt"].includes(normalized)) return "portuguese";
  if (["espanol", "spanish", "es"].includes(normalized)) return "spanish";
  return undefined;
}

export function courseLabelFor(
  language?: CourseLanguage,
  fallback?: string | null,
) {
  if (language === "english") return "Inglés";
  if (language === "portuguese") return "Portugués";
  if (language === "spanish") return "Español para extranjeros";
  const clean = fallback?.trim();
  if (!clean || clean === "—") return undefined;
  return clean;
}
