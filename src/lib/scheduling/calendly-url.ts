export const CALENDLY_FALLBACK = "https://calendly.com/ailanguages";

export function calendlyEmbedUrl(url: string) {
  const clean = url.trim().replace(/\/$/, "");
  if (clean.includes("?")) return `${clean}&hide_gdpr_banner=1`;
  return `${clean}?hide_gdpr_banner=1`;
}
