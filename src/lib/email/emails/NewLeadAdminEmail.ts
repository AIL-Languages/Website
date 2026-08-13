import { escapeHtml, nl2br } from "@/lib/email/escape";
import { renderEmailLayout } from "@/lib/email/emails/EmailLayout";
import { firstNameFrom } from "@/lib/email/names";
import { serviceHeading, serviceLabel } from "@/lib/leads/copy";
import { publicSiteUrl, site } from "@/lib/site";

export type NewLeadAdminEmailProps = {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  availability: string;
  company: string;
  goals: string;
  createdAt?: Date;
  siteUrl?: string;
};

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Chihuahua",
  }).format(date);
}

function row(label: string, value: string) {
  if (!value) return "";
  return `<p style="margin:0 0 14px;"><strong style="display:block;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5a6f8a;font-family:Arial,sans-serif;">${escapeHtml(label)}</strong><span>${nl2br(value)}</span></p>`;
}

export function NewLeadAdminEmail(props: NewLeadAdminEmailProps) {
  const firstName = firstNameFrom(props.name);
  const service = serviceLabel(props.interest);
  const createdAt = props.createdAt ?? new Date();
  const siteUrl = props.siteUrl || publicSiteUrl();

  const html = renderEmailLayout({
    title: "Nuevo lead AIL",
    logoUrl: `${siteUrl}/brand/logo-ail-dark.png`,
    body: `
      <p style="margin:0 0 18px;">Nuevo prospecto registrado en ${escapeHtml(site.name)}. Este aviso no incluye datos bancarios ni accesos académicos.</p>
      ${row("Nombre", props.name)}
      ${row("Correo", props.email)}
      ${row("WhatsApp", props.phone || "No indicado")}
      ${row("Interés", serviceHeading(props.interest))}
      ${row("Modalidad / disponibilidad", props.availability || "No indicada")}
      ${row("Empresa", props.company || "No indicada")}
      ${row("Mensaje", props.goals)}
      ${row("Fecha", formatWhen(createdAt))}
      ${row("Lead ID", props.leadId)}
      <p style="margin:18px 0 0;font-size:13px;color:#5a6f8a;font-family:Arial,sans-serif;">Puedes responder directamente a este correo para escribirle al prospecto.</p>
    `,
  });

  const text = [
    `Nuevo lead AIL — ${service} — ${firstName}`,
    `Nombre: ${props.name}`,
    `Correo: ${props.email}`,
    `WhatsApp: ${props.phone || "No indicado"}`,
    `Interés: ${serviceHeading(props.interest)}`,
    `Modalidad: ${props.availability || "No indicada"}`,
    `Empresa: ${props.company || "No indicada"}`,
    `Mensaje: ${props.goals}`,
    `Fecha: ${formatWhen(createdAt)}`,
    `Lead ID: ${props.leadId}`,
  ].join("\n");

  return {
    subject: `Nuevo lead AIL — ${service} — ${firstName}`,
    html,
    text,
  };
}
