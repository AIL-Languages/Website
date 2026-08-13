import { emailPrimaryButton } from "@/lib/email/emails/buttons";
import { renderEmailLayout } from "@/lib/email/emails/EmailLayout";

export { renderEmailLayout } from "@/lib/email/emails/EmailLayout";

/** Shell interno (aviso al buzón de AIL, equipo). */
export function brandEmailHtml(title: string, body: string) {
  return renderEmailLayout({ title, body });
}

export function prospectEmailHtml(input: {
  siteUrl: string;
  body: string;
  title?: string;
  preheader?: string;
}) {
  const base = input.siteUrl.replace(/\/$/, "");
  return renderEmailLayout({
    title: input.title || "A-Inman Languages",
    preheader: input.preheader,
    body: input.body,
    logoUrl: `${base}/brand/logo-ail-dark.png`,
  });
}

export function emailCtaButton(href: string, label: string) {
  return `<p style="margin:22px 0;">${emailPrimaryButton(label, href)}</p>`;
}
