import { getPolicies } from "@/lib/scheduling/store";
import { CALENDLY_FALLBACK } from "@/lib/scheduling/calendly-url";

export { CALENDLY_FALLBACK, calendlyEmbedUrl } from "@/lib/scheduling/calendly-url";

export async function resolveCalendlyUrl(teacherCalendlyUrl?: string | null) {
  const policies = await getPolicies();
  return (
    teacherCalendlyUrl?.trim() ||
    policies.defaultCalendlyUrl ||
    CALENDLY_FALLBACK
  );
}
