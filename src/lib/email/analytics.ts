export type EmailAnalyticsEvent =
  | "lead_welcome_email_sent"
  | "student_welcome_email_sent";

export function trackEmailEvent(
  event: EmailAnalyticsEvent,
  extra: { interest?: string; courseLanguage?: string } = {},
) {
  const payload = { event, ...extra };
  console.info("[ail:analytics]", payload);
}
