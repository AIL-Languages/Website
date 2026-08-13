import type { ProfileDetails } from "@/lib/academic/details";
import { trackEmailEvent } from "@/lib/email/analytics";
import { resolveCourseLanguage } from "@/lib/email/course-language";
import { renderStudentWelcomeEmail } from "@/lib/email/emails/StudentWelcomeEmail";
import {
  dispatchEmailEvent,
  EMAIL_EVENTS,
} from "@/lib/email/journey-dispatch";
import {
  linkLeadToStudent,
  markStudentWelcomeStatus,
  studentFlagsFrom,
  type StudentEmailFlags,
} from "@/lib/email/journey-store";
import { isResendConfigured, sendEmail } from "@/lib/email/resend";
import { buildStudentWelcomeVars } from "@/lib/email/student-vars";
import { site } from "@/lib/site";

export async function sendStudentWelcomeEmail(input: {
  name: string;
  email: string;
  details: ProfileDetails;
  studentId?: string;
  origin?: string;
}) {
  if (!isResendConfigured()) {
    throw new Error("Resend no está configurado. Agrega RESEND_API_KEY.");
  }
  const vars = await buildStudentWelcomeVars(input);
  const rendered = renderStudentWelcomeEmail(vars);
  await sendEmail({
    to: input.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    replyTo: site.email,
  });
  return { sent: true as const, subject: rendered.subject };
}

export async function onStudentEnrolled(input: {
  studentId: string;
  name: string;
  email: string;
  role: string;
  details: ProfileDetails;
  flags?: Partial<StudentEmailFlags>;
  force?: boolean;
}) {
  const linked = await linkLeadToStudent(input.studentId, input.email, input.details);
  const flags = studentFlagsFrom({
    id: input.studentId,
    email: input.email,
    name: input.name,
    role: input.role,
    details: linked.details,
    lead_id: linked.leadId,
    student_welcome_email_sent: input.flags?.studentWelcomeEmailSent,
    student_welcome_email_sent_at: input.flags?.studentWelcomeEmailSentAt,
    student_welcome_email_error: input.flags?.studentWelcomeEmailError,
  });

  return dispatchEmailEvent({
    event: EMAIL_EVENTS.STUDENT_ENROLLED,
    student: {
      id: flags.id,
      email: flags.email,
      role: flags.role,
      enrollmentStatus: linked.details.enrollmentStatus,
      studentWelcomeEmailSent: flags.studentWelcomeEmailSent,
      leadId: flags.leadId,
    },
    force: input.force,
    sendLeadWelcomeEmail: async () => {
      throw new Error("El correo de prospecto no se envía en student_enrolled.");
    },
    sendStudentWelcomeEmail: async () => {
      await sendStudentWelcomeEmail({
        name: input.name,
        email: input.email,
        details: linked.details,
        studentId: input.studentId,
      });
    },
    markLead: async () => undefined,
    markStudent: (status) => markStudentWelcomeStatus(flags, status),
    track: (event) =>
      trackEmailEvent(event, {
        courseLanguage: resolveCourseLanguage(linked.details.language),
      }),
  });
}
