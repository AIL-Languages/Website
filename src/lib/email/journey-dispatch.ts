export const EMAIL_EVENTS = {
  LEAD_CREATED: "lead_created",
  STUDENT_ENROLLED: "student_enrolled",
} as const;

export type EmailEvent = (typeof EMAIL_EVENTS)[keyof typeof EMAIL_EVENTS];

export type LeadEmailRecord = {
  id: string;
  email: string;
  leadWelcomeEmailSent: boolean;
};

export type StudentEmailRecord = {
  id: string;
  email: string;
  role: string;
  enrollmentStatus?: string;
  studentWelcomeEmailSent: boolean;
  leadId?: string;
};

export type EmailSendStatus = "sent" | "skipped" | "failed" | "not_applicable";

export type DispatchResult = {
  event: EmailEvent;
  leadEmail: EmailSendStatus;
  studentEmail: EmailSendStatus;
  reason?: string;
};

export type DispatchEmailEventInput = {
  event: EmailEvent;
  lead?: LeadEmailRecord;
  student?: StudentEmailRecord;
  force?: boolean;
  sendLeadWelcomeEmail: () => Promise<void>;
  sendStudentWelcomeEmail: () => Promise<void>;
  markLead: (status: { sent: boolean; error?: string; at?: string }) => Promise<void>;
  markStudent: (status: {
    sent: boolean;
    error?: string;
    at?: string;
  }) => Promise<void>;
  track: (event: "lead_welcome_email_sent" | "student_welcome_email_sent") => void;
};

function nowIso() {
  return new Date().toISOString();
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Error de proveedor de correo.";
}

export function isEnrolledStudent(student?: StudentEmailRecord) {
  return student?.role === "student" && student.enrollmentStatus === "active";
}

export async function dispatchEmailEvent(
  input: DispatchEmailEventInput,
): Promise<DispatchResult> {
  if (input.event === EMAIL_EVENTS.LEAD_CREATED) {
    if (!input.lead?.id) {
      return {
        event: input.event,
        leadEmail: "not_applicable",
        studentEmail: "not_applicable",
        reason: "missing_lead",
      };
    }
    if (input.lead.leadWelcomeEmailSent && !input.force) {
      return {
        event: input.event,
        leadEmail: "skipped",
        studentEmail: "not_applicable",
        reason: "duplicate",
      };
    }
    try {
      await input.sendLeadWelcomeEmail();
      await input.markLead({ sent: true, at: nowIso() });
      input.track("lead_welcome_email_sent");
      return {
        event: input.event,
        leadEmail: "sent",
        studentEmail: "not_applicable",
      };
    } catch (error) {
      await input.markLead({
        sent: false,
        error: errorMessage(error),
        at: nowIso(),
      });
      return {
        event: input.event,
        leadEmail: "failed",
        studentEmail: "not_applicable",
        reason: "provider",
      };
    }
  }

  if (input.event === EMAIL_EVENTS.STUDENT_ENROLLED) {
    if (!input.student?.id || input.student.role !== "student") {
      return {
        event: input.event,
        leadEmail: "not_applicable",
        studentEmail: "not_applicable",
        reason: "not_student",
      };
    }
    if (!input.force && input.student.enrollmentStatus !== "active") {
      return {
        event: input.event,
        leadEmail: "not_applicable",
        studentEmail: "not_applicable",
        reason: "not_enrolled",
      };
    }
    if (input.student.studentWelcomeEmailSent && !input.force) {
      return {
        event: input.event,
        leadEmail: "not_applicable",
        studentEmail: "skipped",
        reason: "duplicate",
      };
    }
    try {
      await input.sendStudentWelcomeEmail();
      await input.markStudent({ sent: true, at: nowIso() });
      input.track("student_welcome_email_sent");
      return {
        event: input.event,
        leadEmail: "not_applicable",
        studentEmail: "sent",
      };
    } catch (error) {
      await input.markStudent({
        sent: false,
        error: errorMessage(error),
        at: nowIso(),
      });
      return {
        event: input.event,
        leadEmail: "not_applicable",
        studentEmail: "failed",
        reason: "provider",
      };
    }
  }

  return {
    event: input.event,
    leadEmail: "not_applicable",
    studentEmail: "not_applicable",
    reason: "unknown_event",
  };
}
