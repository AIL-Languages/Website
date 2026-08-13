import { z } from "zod";
import { interestLabels } from "@/lib/interests";
import { leadSourceFor } from "@/lib/leads/copy";
import type { LeadInput } from "@/lib/leads/types";

export const EMAIL_ERROR = "Ingresa un correo electrónico válido.";

const interestValues = Object.keys(interestLabels);

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return value;
  return value.trim().replace(/\s+/g, "").toLowerCase();
}

export const leadEmailSchema = z.preprocess(
  normalizeEmail,
  z.email(EMAIL_ERROR),
);

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Completa los campos obligatorios."),
  email: leadEmailSchema,
  phone: z.string().trim().max(40).optional().default(""),
  interest: z
    .string()
    .trim()
    .refine((value) => interestValues.includes(value), {
      message: "Selecciona un programa de interés.",
    }),
  goals: z.string().trim().min(2, "Completa los campos obligatorios."),
  availability: z.string().trim().max(240).optional().default(""),
  company: z.string().trim().max(160).optional().default(""),
  source: z.string().trim().optional(),
  requestId: z.string().trim().max(80).optional().default(""),
  website: z.string().optional().default(""),
});

export type ParsedLead = z.infer<typeof leadSchema>;

export function parseLeadBody(body: unknown) {
  return leadSchema.safeParse(body);
}

export function toLeadInput(parsed: ParsedLead): LeadInput {
  return {
    name: parsed.name,
    email: String(parsed.email),
    phone: parsed.phone,
    interest: parsed.interest,
    goals: parsed.goals,
    availability: parsed.availability,
    company: parsed.company,
    source: leadSourceFor(parsed.interest, parsed.source),
    requestId: parsed.requestId || crypto.randomUUID(),
  };
}

export function isHoneypotFilled(parsed: ParsedLead) {
  return Boolean(parsed.website?.trim());
}
