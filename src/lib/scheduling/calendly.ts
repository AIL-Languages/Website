import { getPolicies } from "@/lib/scheduling/store";

export const CALENDLY_FALLBACK = "https://calendly.com/ailanguages";

export async function resolveCalendlyUrl(teacherCalendlyUrl?: string | null) {
  const policies = await getPolicies();
  return (
    teacherCalendlyUrl?.trim() ||
    policies.defaultCalendlyUrl ||
    CALENDLY_FALLBACK
  );
}

export function calendlyEmbedUrl(url: string) {
  const clean = url.trim().replace(/\/$/, "");
  if (clean.includes("?")) return `${clean}&hide_gdpr_banner=1`;
  return `${clean}?hide_gdpr_banner=1`;
}
