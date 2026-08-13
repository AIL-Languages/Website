import { NewLeadAdminEmail } from "@/lib/email/emails/NewLeadAdminEmail";
import {
  getContactInbox,
  isResendConfigured,
  sendEmail,
} from "@/lib/email/resend";
import type { LeadInput } from "@/lib/leads/types";

export type ContactInquiry = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  goals: string;
  availability: string;
  company?: string;
};

/** Notificación interna a AIL. Un solo aviso por lead; no duplicar este envío. */
export async function sendContactInquiryEmail(
  inquiry: ContactInquiry,
  leadId: string,
) {
  if (!isResendConfigured()) {
    return { sent: false as const };
  }

  const message = NewLeadAdminEmail({
    leadId,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    interest: inquiry.interest,
    availability: inquiry.availability,
    company: inquiry.company ?? "",
    goals: inquiry.goals,
  });

  await sendEmail({
    to: getContactInbox(),
    subject: message.subject,
    html: message.html,
    text: message.text,
    replyTo: inquiry.email,
  });

  return { sent: true as const };
}

export function inquiryFromLeadInput(input: LeadInput): ContactInquiry {
  return {
    name: input.name,
    email: input.email,
    phone: input.phone,
    interest: input.interest,
    goals: input.goals,
    availability: input.availability,
    company: input.company,
  };
}
