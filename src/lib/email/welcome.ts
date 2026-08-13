import { roleLabel, type UserRole } from "@/lib/auth/admin";
import { isResendConfigured, sendEmail } from "@/lib/email/resend";
import { renderWelcomeEmail } from "@/lib/email/welcome-render";
import { getWelcomeTemplate } from "@/lib/email/welcome-store";
import {
  type WelcomeRole,
  type WelcomeTemplate,
  type WelcomeVars,
} from "@/lib/email/welcome-types";
import { publicSiteUrl, site } from "@/lib/site";

export type WelcomeRecipient = {
  name: string;
  email: string;
  role: UserRole | WelcomeRole;
  password?: string;
};

const STAFF_WELCOME_ROLES = ["teacher", "coordinator", "company"] as const;

function isStaffWelcomeRole(role: string): role is (typeof STAFF_WELCOME_ROLES)[number] {
  return (STAFF_WELCOME_ROLES as readonly string[]).includes(role);
}

export function welcomeVarsFor(recipient: WelcomeRecipient): WelcomeVars {
  const base = publicSiteUrl();
  return {
    name: recipient.name,
    email: recipient.email,
    roleLabel: roleLabel(recipient.role as UserRole),
    loginUrl: `${base}/iniciar-sesion`,
    dashboardUrl: `${base}/dashboard`,
    siteName: site.name,
    password: recipient.password,
  };
}

/** Correo de equipo (profesor, coordinación, empresa). Nunca para prospectos ni alumnos. */
export async function sendStaffWelcomeEmail(input: {
  recipient: WelcomeRecipient;
  template?: Partial<WelcomeTemplate>;
}) {
  if (!isResendConfigured()) {
    throw new Error("Resend no está configurado. Agrega RESEND_API_KEY.");
  }
  if (input.recipient.role === "student") {
    throw new Error(
      "Usa sendStudentWelcomeEmail para alumnos inscritos. No reutilices el correo de equipo.",
    );
  }
  const role = String(input.recipient.role);
  if (!isStaffWelcomeRole(role)) {
    throw new Error("Este correo de bienvenida solo aplica a equipo o empresa.");
  }

  const stored = await getWelcomeTemplate(role);
  const template: WelcomeTemplate = {
    ...stored,
    ...input.template,
    subject: input.template?.subject?.trim() || stored.subject,
    heading: input.template?.heading?.trim() || stored.heading,
    body: input.template?.body?.trim() || stored.body,
    ctaLabel: input.template?.ctaLabel?.trim() || stored.ctaLabel,
    ctaHref: input.template?.ctaHref?.trim() || stored.ctaHref,
  };

  const vars = welcomeVarsFor(input.recipient);
  const rendered = renderWelcomeEmail(template, vars);
  const subject = template.subject
    .replaceAll("{{name}}", vars.name)
    .replaceAll("{{role}}", vars.roleLabel)
    .replaceAll("{{siteName}}", vars.siteName);

  await sendEmail({
    to: input.recipient.email,
    subject,
    html: rendered.html,
    text: rendered.text,
    replyTo: site.email,
  });

  return { sent: true as const, subject };
}

export async function maybeSendStaffWelcomeOnRegister(recipient: WelcomeRecipient) {
  if (!isResendConfigured()) return { sent: false as const, reason: "unconfigured" };
  const role = String(recipient.role);
  if (!isStaffWelcomeRole(role)) {
    return { sent: false as const, reason: "role" };
  }
  try {
    const template = await getWelcomeTemplate(role);
    if (!template.autoSend) return { sent: false as const, reason: "disabled" };
    await sendStaffWelcomeEmail({ recipient, template });
    return { sent: true as const };
  } catch (error) {
    console.error("[welcome:register]", error);
    return { sent: false as const, reason: "error" };
  }
}
