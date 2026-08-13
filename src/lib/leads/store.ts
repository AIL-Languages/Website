import { createAdminClient } from "@/lib/supabase/admin";
import { leadFlagsFromRow } from "@/lib/email/journey-store";
import type { LeadInput, LeadRecord } from "@/lib/leads/types";

const RECENT_MS = 2 * 60 * 1000;

export type CreatedLead = {
  record: LeadRecord;
  row: Record<string, unknown>;
};

function trackingFields(input: LeadInput) {
  return {
    status: "new",
    company: input.company || null,
    request_id: input.requestId,
    welcome_email_sent: false,
    welcome_email_sent_at: null,
    welcome_email_error: null,
    lead_welcome_email_sent: false,
    lead_welcome_email_sent_at: null,
    lead_welcome_email_error: null,
  };
}

function englishRow(input: LeadInput) {
  return {
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    interest: input.interest,
    goals: input.goals,
    availability: input.availability || null,
    source: input.source,
    ...trackingFields(input),
  };
}

function spanishRow(input: LeadInput) {
  return {
    nombre: input.name,
    email: input.email,
    telefono: input.phone || null,
    servicios: [input.interest],
    respuestas: {
      objetivos: input.goals,
      disponibilidad: input.availability || null,
      fuente: input.source,
      empresa: input.company || null,
      request_id: input.requestId,
      status: "new",
      leadWelcomeEmailSent: false,
    },
    propuesta: "",
    ...trackingFields(input),
  };
}

function toCreated(row: Record<string, unknown>, duplicate: boolean, email: string): CreatedLead {
  const flags = leadFlagsFromRow(row);
  return {
    row,
    record: {
      id: flags.id,
      email,
      welcomeEmailSent: flags.leadWelcomeEmailSent,
      duplicate,
    },
  };
}

async function findExisting(
  supabase: ReturnType<typeof createAdminClient>,
  input: LeadInput,
): Promise<CreatedLead | null> {
  const since = new Date(Date.now() - RECENT_MS).toISOString();

  const byRequest = await supabase
    .from("leads")
    .select("*")
    .eq("request_id", input.requestId)
    .maybeSingle();

  if (!byRequest.error && byRequest.data) {
    return toCreated(byRequest.data as Record<string, unknown>, true, input.email);
  }

  const byEmail = await supabase
    .from("leads")
    .select("*")
    .eq("email", input.email)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!byEmail.error && byEmail.data) {
    return toCreated(byEmail.data as Record<string, unknown>, true, input.email);
  }

  return null;
}

async function insertRow(
  supabase: ReturnType<typeof createAdminClient>,
  row: object,
) {
  return supabase.from("leads").insert(row).select("*").single();
}

function isMissingColumn(error: { message?: string } | null) {
  const message = error?.message?.toLowerCase() ?? "";
  return (
    message.includes("schema cache") ||
    message.includes("column") ||
    message.includes("could not find")
  );
}

function isUniqueViolation(error: { message?: string; code?: string } | null) {
  const message = error?.message?.toLowerCase() ?? "";
  return error?.code === "23505" || message.includes("duplicate") || message.includes("unique");
}

export async function createLead(input: LeadInput): Promise<CreatedLead> {
  const supabase = createAdminClient();
  const existing = await findExisting(supabase, input);
  if (existing) return existing;

  const attempts = [
    spanishRow(input),
    englishRow(input),
    {
      nombre: input.name,
      email: input.email,
      telefono: input.phone || null,
      servicios: [input.interest],
      respuestas: {
        objetivos: input.goals,
        disponibilidad: input.availability || null,
        fuente: input.source,
        empresa: input.company || null,
        request_id: input.requestId,
        status: "new",
        leadWelcomeEmailSent: false,
      },
      propuesta: "",
    },
    {
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      interest: input.interest,
      goals: input.goals,
      availability: input.availability || null,
      source: input.source,
    },
  ];

  let lastError: unknown = null;
  for (const row of attempts) {
    const { data, error } = await insertRow(supabase, row);
    if (!error && data) {
      return toCreated(data as Record<string, unknown>, false, input.email);
    }
    lastError = error;
    if (isUniqueViolation(error)) {
      const duplicate = await findExisting(supabase, input);
      if (duplicate) return duplicate;
    }
    if (!isMissingColumn(error)) break;
  }

  console.error("[leads:create]", lastError);
  throw new Error("No se pudo registrar la solicitud.");
}

export async function markWelcomeEmailResult(input: {
  leadId: string;
  sent: boolean;
  error?: string;
}) {
  const supabase = createAdminClient();
  const sentAt = input.sent ? new Date().toISOString() : null;
  const errorText = input.sent ? null : input.error?.slice(0, 500) || "send_failed";
  const payload = {
    welcome_email_sent: input.sent,
    welcome_email_sent_at: sentAt,
    welcome_email_error: errorText,
    lead_welcome_email_sent: input.sent,
    lead_welcome_email_sent_at: sentAt,
    lead_welcome_email_error: errorText,
  };

  const { error } = await supabase.from("leads").update(payload).eq("id", input.leadId);
  if (!error) return;

  const fallback = await supabase
    .from("leads")
    .update({
      welcome_email_sent: input.sent,
      welcome_email_sent_at: sentAt,
      welcome_email_error: errorText,
    })
    .eq("id", input.leadId);
  if (fallback.error) console.error("[leads:welcome-flag]", fallback.error);
}

export async function shouldSendWelcomeEmail(lead: LeadRecord) {
  return lead.welcomeEmailSent !== true;
}
