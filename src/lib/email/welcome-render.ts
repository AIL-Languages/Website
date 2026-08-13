import { escapeHtml, nl2br } from "@/lib/email/escape";
import { brandEmailHtml } from "@/lib/email/shell";
import type { WelcomeTemplate, WelcomeVars } from "@/lib/email/welcome-types";

export function interpolateWelcome(template: string, vars: WelcomeVars) {
  return template
    .replaceAll("{{name}}", vars.name)
    .replaceAll("{{email}}", vars.email)
    .replaceAll("{{role}}", vars.roleLabel)
    .replaceAll("{{loginUrl}}", vars.loginUrl)
    .replaceAll("{{dashboardUrl}}", vars.dashboardUrl)
    .replaceAll("{{siteName}}", vars.siteName)
    .replaceAll("{{password}}", vars.password?.trim() || "(no incluida)");
}

export function renderWelcomeEmail(
  template: Pick<WelcomeTemplate, "heading" | "body" | "ctaLabel" | "ctaHref">,
  vars: WelcomeVars,
) {
  const heading = interpolateWelcome(template.heading, vars);
  const bodyText = interpolateWelcome(template.body, vars);
  const ctaLabel = interpolateWelcome(template.ctaLabel, vars);
  const ctaHref = interpolateWelcome(template.ctaHref, vars);
  const safeHref =
    ctaHref.startsWith("http://") ||
    ctaHref.startsWith("https://") ||
    ctaHref.startsWith("/")
      ? escapeHtml(ctaHref)
      : "#";
  const cta = ctaLabel
    ? `<p style="margin:24px 0 0;"><a href="${safeHref}" style="display:inline-block;background:#00f0a3;color:#071b3a;text-decoration:none;font-family:Arial,sans-serif;font-weight:700;font-size:14px;padding:12px 22px;border-radius:999px;">${escapeHtml(ctaLabel)}</a></p>`
    : "";

  return {
    heading,
    html: brandEmailHtml(heading, `${nl2br(bodyText)}${cta}`),
    text: [heading, "", bodyText, ctaHref ? `${ctaLabel}: ${ctaHref}` : ""]
      .filter(Boolean)
      .join("\n"),
  };
}
