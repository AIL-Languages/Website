import { escapeHtml } from "@/lib/email/escape";
import { emailTokens } from "@/lib/email/emails/tokens";
import { site } from "@/lib/site";
import { getActiveSocialLinks } from "@/lib/social";

export type EmailLayoutInput = {
  title: string;
  body: string;
  preheader?: string;
  logoUrl?: string;
  footerExtra?: string;
};

function socialFooterHtml() {
  const links = getActiveSocialLinks();
  if (!links.length) return "";
  const items = links
    .map(
      (link) =>
        `<a href="${escapeHtml(link.href!)}" style="color:${emailTokens.aqua};text-decoration:none;margin:0 6px;">${escapeHtml(link.name)}</a>`,
    )
    .join(" · ");
  return `<p style="margin:12px 0 0;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;">${items}</p>`;
}

export function renderEmailLayout({
  title,
  body,
  preheader,
  logoUrl,
  footerExtra,
}: EmailLayoutInput) {
  const preheaderHtml = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${escapeHtml(preheader)}</div>`
    : "";
  const logo = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(site.name)}" width="168" style="display:block;margin:0 auto 12px;border:0;max-width:168px;height:auto;" />`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0;padding:0;background:${emailTokens.mist};font-family:Georgia,'Times New Roman',serif;">
    ${preheaderHtml}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${emailTokens.mist};padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:${emailTokens.maxWidth}px;background:${emailTokens.white};border-radius:20px;overflow:hidden;border:1px solid rgba(7,27,58,0.08);">
            <tr>
              <td style="background:${emailTokens.navy};padding:24px 28px;text-align:center;">
                ${logo}
                <p style="margin:0;color:${emailTokens.aqua};font-size:12px;letter-spacing:0.16em;text-transform:uppercase;font-family:Arial,sans-serif;">${escapeHtml(site.shortName)}</p>
                <p style="margin:8px 0 0;color:${emailTokens.white};font-size:20px;font-weight:600;">${escapeHtml(site.name)}</p>
                <p style="margin:6px 0 0;color:${emailTokens.lime};font-size:13px;letter-spacing:0.06em;font-family:Arial,sans-serif;">${escapeHtml(site.tagline)}</p>
                <h1 style="margin:16px 0 0;color:${emailTokens.white};font-size:20px;font-weight:600;line-height:1.3;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;color:${emailTokens.navy};font-size:15px;line-height:1.65;background:${emailTokens.white};">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;color:${emailTokens.muted};font-size:12px;font-family:Arial,sans-serif;line-height:1.6;background:${emailTokens.white};">
                ${footerExtra ?? ""}
                <p style="margin:${footerExtra ? "18px 0 0" : "0"};">
                  <strong style="color:${emailTokens.navy};">${escapeHtml(site.name)} · ${escapeHtml(site.tagline)}</strong><br />
                  <a href="mailto:${escapeHtml(site.email)}" style="color:${emailTokens.aqua};text-decoration:none;">${escapeHtml(site.email)}</a>
                </p>
                ${socialFooterHtml()}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
