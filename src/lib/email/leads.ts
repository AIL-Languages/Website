import {
  leadWelcomeVarsFrom,
  renderLeadWelcomeEmail,
} from "@/lib/email/emails/LeadWelcomeEmail";
import { NewLeadAdminEmail } from "@/lib/email/emails/NewLeadAdminEmail";
import {
  getContactInbox,
  isResendConfigured,
  sendEmail,
} from "@/lib/email/resend";
import type { LeadInput, LeadRecord } from "@/lib/leads/types";
import { site } from "@/lib/site";

/** EMAIL 1 — bienvenida al prospecto (no es la bienvenida académica). */
export async function sendLeadWelcomeEmail(input: {
  name: string;
  email: string;
  interest: string;
  origin?: string;
}) {
  if (!isResendConfigured()) {
    throw new Error("Resend no está configurado. Agrega RESEND_API_KEY.");
  }
  const rendered = renderLeadWelcomeEmail(
    leadWelcomeVarsFrom({
      name: input.name,
      interest: input.interest,
      origin: input.origin,
    }),
  );
  await sendEmail({
    to: input.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    replyTo: site.email,
  });
  return { sent: true as const, subject: rendered.subject };
}

export async function sendNewLeadNotification(input: {
  lead: Pick<LeadRecord, "id">;
  inquiry: LeadInput;
}) {
  if (!isResendConfigured()) {
    return { sent: false as const, error: "unconfigured" };
  }

  try {
    const message = NewLeadAdminEmail({
      leadId: input.lead.id,
      name: input.inquiry.name,
      email: input.inquiry.email,
      phone: input.inquiry.phone,
      interest: input.inquiry.interest,
      availability: input.inquiry.availability,
      company: input.inquiry.company,
      goals: input.inquiry.goals,
    });
    await sendEmail({
      to: getContactInbox(),
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: input.inquiry.email,
    });
    return { sent: true as const };
  } catch (error) {
    console.error("[lead:notify]", error);
    return { sent: false as const, error: "notify_failed" };
  }
}
