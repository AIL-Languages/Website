import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  dispatchEmailEvent,
  EMAIL_EVENTS,
  type DispatchEmailEventInput,
  type LeadEmailRecord,
  type StudentEmailRecord,
} from "./journey-dispatch.ts";

function lead(overrides: Partial<LeadEmailRecord> = {}): LeadEmailRecord {
  return {
    id: "lead-1",
    email: "ana@example.com",
    leadWelcomeEmailSent: false,
    ...overrides,
  };
}

function student(overrides: Partial<StudentEmailRecord> = {}): StudentEmailRecord {
  return {
    id: "student-1",
    email: "ana@example.com",
    role: "student",
    enrollmentStatus: "active",
    studentWelcomeEmailSent: false,
    ...overrides,
  };
}

function harness(overrides: Partial<DispatchEmailEventInput> = {}) {
  const calls = {
    lead: 0,
    student: 0,
    markLead: [] as Array<{ sent: boolean; error?: string }>,
    markStudent: [] as Array<{ sent: boolean; error?: string }>,
    track: [] as string[],
  };

  const input: DispatchEmailEventInput = {
    event: EMAIL_EVENTS.LEAD_CREATED,
    sendLeadWelcomeEmail: async () => {
      calls.lead += 1;
    },
    sendStudentWelcomeEmail: async () => {
      calls.student += 1;
    },
    markLead: async (status) => {
      calls.markLead.push(status);
    },
    markStudent: async (status) => {
      calls.markStudent.push(status);
    },
    track: (event) => {
      calls.track.push(event);
    },
    ...overrides,
  };

  return { input, calls };
}

describe("journey de emails AIL", () => {
  it("Test 1: un lead nuevo recibe correo comercial y no académico", async () => {
    const { input, calls } = harness({
      event: EMAIL_EVENTS.LEAD_CREATED,
      lead: lead(),
      student: student({ enrollmentStatus: "pending" }),
    });
    const result = await dispatchEmailEvent(input);
    assert.equal(result.leadEmail, "sent");
    assert.equal(result.studentEmail, "not_applicable");
    assert.equal(calls.lead, 1);
    assert.equal(calls.student, 0);
    assert.deepEqual(calls.track, ["lead_welcome_email_sent"]);
  });

  it("Test 2: al convertir lead en alumno se envía académico y no se repite el comercial", async () => {
    const { input, calls } = harness({
      event: EMAIL_EVENTS.STUDENT_ENROLLED,
      lead: lead({ leadWelcomeEmailSent: true }),
      student: student({ leadId: "lead-1" }),
    });
    const result = await dispatchEmailEvent(input);
    assert.equal(result.studentEmail, "sent");
    assert.equal(result.leadEmail, "not_applicable");
    assert.equal(calls.lead, 0);
    assert.equal(calls.student, 1);
    assert.deepEqual(calls.track, ["student_welcome_email_sent"]);
  });

  it("Test 3: alumno creado directamente por admin recibe correo académico", async () => {
    const { input, calls } = harness({
      event: EMAIL_EVENTS.STUDENT_ENROLLED,
      student: student(),
    });
    const result = await dispatchEmailEvent(input);
    assert.equal(result.studentEmail, "sent");
    assert.equal(calls.student, 1);
    assert.equal(calls.lead, 0);
  });

  it("Test 4: error de proveedor marca el email como fallido y no lanza", async () => {
    const { input, calls } = harness({
      event: EMAIL_EVENTS.STUDENT_ENROLLED,
      student: student(),
      sendStudentWelcomeEmail: async () => {
        throw new Error("Resend timeout");
      },
    });
    const result = await dispatchEmailEvent(input);
    assert.equal(result.studentEmail, "failed");
    assert.equal(result.reason, "provider");
    assert.equal(calls.markStudent[0]?.sent, false);
    assert.equal(calls.markStudent[0]?.error, "Resend timeout");
  });

  it("Test 5: un evento duplicado envía un solo correo por etapa", async () => {
    const state = { leadSent: false, studentSent: false };
    const counts = { lead: 0, student: 0 };

    const leadInput = (): DispatchEmailEventInput => ({
      event: EMAIL_EVENTS.LEAD_CREATED,
      lead: lead({ leadWelcomeEmailSent: state.leadSent }),
      sendLeadWelcomeEmail: async () => {
        counts.lead += 1;
      },
      sendStudentWelcomeEmail: async () => {
        counts.student += 1;
      },
      markLead: async (status) => {
        state.leadSent = status.sent;
      },
      markStudent: async (status) => {
        state.studentSent = status.sent;
      },
      track: () => undefined,
    });

    await dispatchEmailEvent(leadInput());
    await dispatchEmailEvent(leadInput());
    assert.equal(counts.lead, 1);

    const studentInput = (): DispatchEmailEventInput => ({
      ...leadInput(),
      event: EMAIL_EVENTS.STUDENT_ENROLLED,
      student: student({ studentWelcomeEmailSent: state.studentSent }),
    });
    await dispatchEmailEvent(studentInput());
    await dispatchEmailEvent(studentInput());
    assert.equal(counts.student, 1);
    assert.equal(counts.lead, 1);
  });

  it("nunca deriva el correo académico solo porque exista un email en base de datos", async () => {
    const { input, calls } = harness({
      event: EMAIL_EVENTS.STUDENT_ENROLLED,
      student: student({ enrollmentStatus: "pending" }),
    });
    const result = await dispatchEmailEvent(input);
    assert.equal(result.studentEmail, "not_applicable");
    assert.equal(result.reason, "not_enrolled");
    assert.equal(calls.student, 0);
  });
});
