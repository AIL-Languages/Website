import { escapeHtml } from "@/lib/email/escape";
import {
  emailPrimaryButton,
  emailSecondaryButton,
  emailTextLink,
} from "@/lib/email/emails/buttons";
import { renderEmailLayout } from "@/lib/email/emails/EmailLayout";
import { emailTokens } from "@/lib/email/emails/tokens";
import { leadInterestLabel } from "@/lib/email/lead-labels";
import { firstNameFrom } from "@/lib/email/names";
import { leadVariant, receivedMessage } from "@/lib/leads/copy";
import { publicSiteUrl, site, whatsappLink } from "@/lib/site";

export const LEAD_WELCOME_SUBJECT = "¡Gracias por contactar a A-Inman Languages! 🌎";
export const LEAD_WELCOME_SUBJECT_ALT = "Recibimos tu solicitud | A-Inman Languages";
export const LEAD_WELCOME_PREHEADER =
  "Hemos recibido tu solicitud y pronto te orientaremos sobre el programa de tu interés.";

export type LeadWelcomeVars = {
  firstName: string;
  interestLabel: string;
  receivedText: string;
  followUpText: string;
  siteUrl: string;
  programsUrl: string;
  methodologyUrl: string;
  experienceUrl: string;
  servicesUrl: string;
  faqUrl: string;
  logoUrl?: string;
  whatsappUrl: string;
};

export function leadWelcomeVarsFrom(input: {
  name: string;
  interest: string;
  origin?: string;
  logoUrl?: string;
}): LeadWelcomeVars {
  const base = (input.origin || publicSiteUrl()).replace(/\/$/, "");
  const variant = leadVariant(input.interest);
  return {
    firstName: firstNameFrom(input.name),
    interestLabel: leadInterestLabel(input.interest),
    receivedText: receivedMessage(variant),
    followUpText:
      variant === "program"
        ? "Nuestro equipo revisará tus datos y se pondrá en contacto contigo para orientarte sobre el programa que mejor se adapte a tus objetivos."
        : "Nuestro equipo se pondrá en contacto contigo para continuar con tu solicitud.",
    siteUrl: base,
    programsUrl: `${base}/#cursos`,
    methodologyUrl: `${base}/#metodologia`,
    experienceUrl: `${base}/#experiencia`,
    servicesUrl: `${base}/#empresas`,
    faqUrl: `${base}/#faq`,
    logoUrl: input.logoUrl || `${base}/brand/logo-ail-dark.png`,
    whatsappUrl: whatsappLink(),
  };
}

export function renderLeadWelcomeEmail(vars: LeadWelcomeVars) {
  const body = `
    <p style="margin:0 0 16px;">Hola <strong>${escapeHtml(vars.firstName)}</strong>:</p>
    <p style="margin:0 0 16px;">¡Gracias por tu interés en <strong>A-Inman Languages (AIL)</strong>!</p>
    <p style="margin:0 0 16px;">Somos una academia virtual de idiomas enfocada principalmente en adolescentes y adultos, con programas de:</p>
    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-weight:700;color:${emailTokens.navy};">Inglés · Portugués · Español para extranjeros</p>
    <p style="margin:0 0 16px;">Nuestro enfoque es práctico, comunicativo y personalizado, con clases 100% online y horarios que se coordinan de acuerdo con la disponibilidad del alumno y nuestros profesores.</p>
    <p style="margin:0 0 8px;">${escapeHtml(vars.receivedText)}</p>
    <p style="margin:0 0 18px;padding:14px 16px;background:${emailTokens.mist};border-left:4px solid ${emailTokens.aqua};font-family:Arial,sans-serif;font-size:18px;font-weight:700;">${escapeHtml(vars.interestLabel)}</p>
    <p style="margin:0 0 16px;">${escapeHtml(vars.followUpText)}</p>
    <p style="margin:0 0 10px;">Mientras tanto, puedes conocer más sobre:</p>
    <ul style="margin:0 0 22px;padding-left:18px;">
      <li style="margin:0 0 6px;">nuestros ${emailTextLink("programas", vars.programsUrl)};</li>
      <li style="margin:0 0 6px;">${emailTextLink("metodología", vars.methodologyUrl)};</li>
      <li style="margin:0 0 6px;">${emailTextLink("experiencia académica", vars.experienceUrl)};</li>
      <li style="margin:0 0 6px;">${emailTextLink("servicios", vars.servicesUrl)};</li>
      <li style="margin:0;">${emailTextLink("preguntas frecuentes", vars.faqUrl)}.</li>
    </ul>
    <p style="margin:0 0 12px;">${emailPrimaryButton("Conocer A-Inman Languages →", vars.siteUrl)}</p>
    <p style="margin:0;">${emailSecondaryButton("Ver nuestros programas", vars.programsUrl)}</p>
  `;

  const footerExtra = `
    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-weight:700;color:${emailTokens.navy};">¿Tienes alguna duda?</p>
    <p style="margin:0;">
      Correo: <a href="mailto:${escapeHtml(site.email)}" style="color:${emailTokens.navy};font-weight:700;">${escapeHtml(site.email)}</a><br />
      WhatsApp: <a href="${escapeHtml(vars.whatsappUrl)}" style="color:${emailTokens.navy};font-weight:700;">${escapeHtml(site.phoneDisplay)}</a>
    </p>
  `;

  const text = [
    `Hola ${vars.firstName}:`,
    "",
    "¡Gracias por tu interés en A-Inman Languages (AIL)!",
    "Somos una academia virtual de idiomas enfocada principalmente en adolescentes y adultos, con programas de Inglés, Portugués y Español para extranjeros.",
    vars.receivedText,
    vars.interestLabel,
    vars.followUpText,
    `Conocer AIL: ${vars.siteUrl}`,
    `Ver programas: ${vars.programsUrl}`,
    `Dudas: ${site.email}`,
    "A-Inman Languages",
    "Linking Worldwide",
  ].join("\n");

  return {
    subject: LEAD_WELCOME_SUBJECT,
    preheader: LEAD_WELCOME_PREHEADER,
    html: renderEmailLayout({
      title: "¡Gracias por contactarnos!",
      preheader: LEAD_WELCOME_PREHEADER,
      body,
      logoUrl: vars.logoUrl,
      footerExtra,
    }),
    text,
  };
}
