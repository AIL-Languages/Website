import { trackEmailEvent } from "@/lib/email/analytics";
import { sendLeadWelcomeEmail } from "@/lib/email/leads";
import {
  dispatchEmailEvent,
  EMAIL_EVENTS,
} from "@/lib/email/journey-dispatch";
import {
  findLeadByEmail,
  leadFlagsFromRow,
  markLeadWelcomeStatus,
  type LeadEmailFlags,
} from "@/lib/email/journey-store";
import { markWelcomeEmailResult } from "@/lib/leads/store";

export { sendLeadWelcomeEmail };

export async function onLeadCreated(input: {
  lead: LeadEmailFlags | { id: string; email: string; leadWelcomeEmailSent: boolean };
  name: string;
  email: string;
  interest: string;
  force?: boolean;
}) {
  return dispatchEmailEvent({
    event: EMAIL_EVENTS.LEAD_CREATED,
    lead: {
      id: input.lead.id,
      email: input.lead.email,
      leadWelcomeEmailSent: input.lead.leadWelcomeEmailSent,
    },
    force: input.force,
    sendLeadWelcomeEmail: async () => {
      await sendLeadWelcomeEmail({
        name: input.name,
        email: input.email,
        interest: input.interest,
      });
    },
    sendStudentWelcomeEmail: async () => {
      throw new Error("El correo de alumno no se envía en lead_created.");
    },
    markLead: async (status) => {
      const flags: LeadEmailFlags =
        "respuestas" in input.lead
          ? (input.lead as LeadEmailFlags)
          : {
              id: input.lead.id,
              email: input.lead.email,
              respuestas: {},
              leadWelcomeEmailSent: input.lead.leadWelcomeEmailSent,
            };
      await markLeadWelcomeStatus(flags, status);
      await markWelcomeEmailResult({
        leadId: input.lead.id,
        sent: status.sent,
        error: status.error,
      });
    },
    markStudent: async () => undefined,
    track: (event) => trackEmailEvent(event, { interest: input.interest }),
  });
}

export async function onLeadCreatedByEmail(input: {
  name: string;
  email: string;
  interest: string;
  leadRow?: Record<string, unknown> | null;
  force?: boolean;
}) {
  const lead = input.leadRow
    ? leadFlagsFromRow(input.leadRow)
    : await findLeadByEmail(input.email);
  if (!lead) {
    return {
      event: EMAIL_EVENTS.LEAD_CREATED,
      leadEmail: "not_applicable" as const,
      studentEmail: "not_applicable" as const,
      reason: "missing_lead",
    };
  }
  return onLeadCreated({ ...input, lead });
}
