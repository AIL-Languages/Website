import type { ProfileDetails } from "@/lib/academic/details";
import { createAdminClient } from "@/lib/supabase/admin";

export type LeadEmailFlags = {
  id: string;
  email: string;
  respuestas: Record<string, unknown>;
  leadWelcomeEmailSent: boolean;
  leadWelcomeEmailSentAt?: string;
  leadWelcomeEmailError?: string;
};

export type StudentEmailFlags = {
  id: string;
  email: string;
  name: string;
  role: string;
  details: ProfileDetails;
  leadId?: string;
  studentWelcomeEmailSent: boolean;
  studentWelcomeEmailSentAt?: string;
  studentWelcomeEmailError?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function flagFrom(value: unknown) {
  return value === true || value === "true";
}

export async function findLeadByEmail(email: string): Promise<LeadEmailFlags | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .ilike("email", email.trim())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return leadFlagsFromRow(data as Record<string, unknown>);
  } catch (error) {
    console.error("[email:leads:find]", error);
    return null;
  }
}

export function leadFlagsFromRow(row: Record<string, unknown>): LeadEmailFlags {
  const respuestas = asRecord(row.respuestas);
  return {
    id: String(row.id),
    email: String(row.email ?? ""),
    respuestas,
    leadWelcomeEmailSent:
      flagFrom(row.lead_welcome_email_sent) ||
      flagFrom(row.welcome_email_sent) ||
      flagFrom(respuestas.leadWelcomeEmailSent),
    leadWelcomeEmailSentAt:
      (typeof row.lead_welcome_email_sent_at === "string"
        ? row.lead_welcome_email_sent_at
        : undefined) ||
      (typeof row.welcome_email_sent_at === "string"
        ? row.welcome_email_sent_at
        : undefined) ||
      (typeof respuestas.leadWelcomeEmailSentAt === "string"
        ? respuestas.leadWelcomeEmailSentAt
        : undefined),
    leadWelcomeEmailError:
      (typeof row.lead_welcome_email_error === "string"
        ? row.lead_welcome_email_error
        : undefined) ||
      (typeof row.welcome_email_error === "string"
        ? row.welcome_email_error
        : undefined) ||
      (typeof respuestas.leadWelcomeEmailError === "string"
        ? respuestas.leadWelcomeEmailError
        : undefined),
  };
}

export async function markLeadWelcomeStatus(
  lead: LeadEmailFlags,
  status: { sent: boolean; error?: string; at?: string },
) {
  const at = status.at || new Date().toISOString();
  const respuestas = {
    ...lead.respuestas,
    leadWelcomeEmailSent: status.sent,
    leadWelcomeEmailSentAt: at,
    leadWelcomeEmailError: status.error || null,
  };
  const supabase = createAdminClient();
  const withColumns = await supabase
    .from("leads")
    .update({
      lead_welcome_email_sent: status.sent,
      lead_welcome_email_sent_at: status.sent ? at : null,
      lead_welcome_email_error: status.error || null,
      respuestas,
    })
    .eq("id", lead.id);
  if (!withColumns.error) return;
  const fallback = await supabase
    .from("leads")
    .update({ respuestas })
    .eq("id", lead.id);
  if (fallback.error) {
    console.error("[email:leads:mark]", fallback.error);
  }
}

export async function markStudentWelcomeStatus(
  student: StudentEmailFlags,
  status: { sent: boolean; error?: string; at?: string },
) {
  const at = status.at || new Date().toISOString();
  const details: ProfileDetails = {
    ...student.details,
    studentWelcomeEmailSent: status.sent ? "true" : "false",
    studentWelcomeEmailSentAt: at,
    studentWelcomeEmailError: status.error || "",
    leadId: student.leadId || student.details.leadId,
  };
  const supabase = createAdminClient();
  const withColumns = await supabase
    .from("profiles")
    .update({
      student_welcome_email_sent: status.sent,
      student_welcome_email_sent_at: status.sent ? at : null,
      student_welcome_email_error: status.error || null,
      details,
    })
    .eq("id", student.id);
  if (!withColumns.error) return;
  const fallback = await supabase
    .from("profiles")
    .update({ details })
    .eq("id", student.id);
  if (fallback.error) {
    console.error("[email:student:mark]", fallback.error);
  }
}

export async function linkLeadToStudent(studentId: string, email: string, details: ProfileDetails) {
  const lead = await findLeadByEmail(email);
  if (!lead) return { leadId: details.leadId, details };
  if (details.leadId) {
    return { leadId: details.leadId, details };
  }

  const nextDetails: ProfileDetails = { ...details, leadId: lead.id };
  const supabase = createAdminClient();
  const withColumn = await supabase
    .from("profiles")
    .update({ lead_id: lead.id, details: nextDetails })
    .eq("id", studentId);
  if (withColumn.error) {
    await supabase
      .from("profiles")
      .update({ details: nextDetails })
      .eq("id", studentId);
  }
  return { leadId: lead.id, details: nextDetails };
}

export function studentFlagsFrom(
  profile: {
    id: string;
    email: string;
    name: string;
    role: string;
    details?: ProfileDetails | null;
    lead_id?: string | null;
    student_welcome_email_sent?: boolean | null;
    student_welcome_email_sent_at?: string | null;
    student_welcome_email_error?: string | null;
  },
): StudentEmailFlags {
  const details = profile.details ?? {};
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    details,
    leadId: profile.lead_id || details.leadId,
    studentWelcomeEmailSent:
      profile.student_welcome_email_sent === true ||
      details.studentWelcomeEmailSent === "true",
    studentWelcomeEmailSentAt:
      profile.student_welcome_email_sent_at || details.studentWelcomeEmailSentAt,
    studentWelcomeEmailError:
      profile.student_welcome_email_error || details.studentWelcomeEmailError,
  };
}
