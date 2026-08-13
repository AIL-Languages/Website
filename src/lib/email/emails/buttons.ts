import { escapeHtml } from "@/lib/email/escape";
import { emailTokens } from "@/lib/email/emails/tokens";

function safeHref(href: string) {
  const value = href.trim();
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("/")
  ) {
    return escapeHtml(value);
  }
  return "#";
}

export function emailPrimaryButton(label: string, href: string) {
  return `<a href="${safeHref(href)}" style="display:inline-block;background:${emailTokens.lime};color:${emailTokens.navy};text-decoration:none;font-family:Arial,sans-serif;font-weight:700;font-size:14px;padding:12px 22px;border-radius:999px;">${escapeHtml(label)}</a>`;
}

export function emailSecondaryButton(label: string, href: string) {
  return `<a href="${safeHref(href)}" style="display:inline-block;background:${emailTokens.white};color:${emailTokens.navy};text-decoration:none;font-family:Arial,sans-serif;font-weight:700;font-size:14px;padding:11px 20px;border-radius:999px;border:2px solid ${emailTokens.aqua};">${escapeHtml(label)}</a>`;
}

export function emailTextLink(label: string, href: string) {
  return `<a href="${safeHref(href)}" style="color:${emailTokens.navy};font-weight:700;text-decoration:underline;">${escapeHtml(label)}</a>`;
}
