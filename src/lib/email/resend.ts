import { Resend } from "resend";
import { site } from "@/lib/site";

let client: Resend | null = null;

function emailApiKey() {
  return (
    process.env.RESEND_API_KEY?.trim() ||
    process.env.EMAIL_API_KEY?.trim() ||
    ""
  );
}

export function isResendConfigured() {
  return Boolean(emailApiKey());
}

export function getResendClient() {
  const apiKey = emailApiKey();
  if (!apiKey) {
    throw new Error("Falta RESEND_API_KEY o EMAIL_API_KEY en las variables de entorno.");
  }
  if (!client) client = new Resend(apiKey);
  return client;
}

export function getResendFrom() {
  return (
    process.env.EMAIL_FROM?.trim() ||
    process.env.RESEND_FROM?.trim() ||
    `A-Inman Languages <beth.t@example.com>`
  );
}

export function getContactInbox() {
  return (
    process.env.CONTACT_INBOX_EMAIL?.trim() ||
    process.env.RESEND_TO?.trim() ||
    site.email
  );
}

export async function sendEmail(input: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string | string[];
}) {
  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: getResendFrom(),
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });

  if (error) {
    throw new Error(error.message || "No se pudo enviar el correo.");
  }

  return data;
}
