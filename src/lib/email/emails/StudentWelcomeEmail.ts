import type { CourseLanguage } from "@/lib/email/course-language";
import { escapeHtml } from "@/lib/email/escape";
import {
  emailPrimaryButton,
  emailSecondaryButton,
} from "@/lib/email/emails/buttons";
import { renderEmailLayout } from "@/lib/email/emails/EmailLayout";
import { emailTokens } from "@/lib/email/emails/tokens";
import { site } from "@/lib/site";

export const STUDENT_WELCOME_SUBJECT =
  "¡Bienvenid@ oficialmente a A-Inman Languages! 🎓";
export const STUDENT_WELCOME_SUBJECT_ALT =
  "Tu proceso de aprendizaje en AIL comienza aquí";
export const STUDENT_WELCOME_PREHEADER =
  "Ya formas parte de AIL. Aquí encontrarás tus próximos pasos para comenzar.";

export type StudentWelcomeVars = {
  firstName: string;
  dashboardUrl: string;
  courseLabel?: string;
  courseLanguage?: CourseLanguage;
  studentLevel?: string;
  teacherName?: string;
  startDate?: string;
  scheduleUrl?: string;
  platformName?: string;
  platformUrl?: string;
  evaluationUrl?: string;
  policiesUrl?: string;
  rcaUrl?: string;
  paymentsUrl?: string;
  smrtUrl?: string;
  smrtEnabled?: boolean;
  hasValidatedLevel?: boolean;
  showEvaluation?: boolean;
  classJoinUrl?: string;
  academicSupportUrl?: string;
  adminSupportUrl?: string;
  logoUrl?: string;
};

function step(title: string, inner: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
      <tr>
        <td style="padding:16px 16px 4px;background:${emailTokens.mist};border-radius:14px;">
          <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${emailTokens.muted};font-weight:700;">${escapeHtml(title)}</p>
          ${inner}
        </td>
      </tr>
    </table>
  `;
}

function quote(text: string) {
  return `<p style="margin:0 0 12px;padding:0;color:${emailTokens.navy};">${text}</p>`;
}

export function renderStudentWelcomeEmail(vars: StudentWelcomeVars) {
  const courseBlock = vars.courseLabel
    ? `<p style="margin:0 0 8px;">Nos da mucho gusto acompañarte en tu proceso de aprendizaje de:</p>
       <p style="margin:0 0 18px;padding:14px 16px;background:${emailTokens.mist};border-left:4px solid ${emailTokens.lime};font-family:Arial,sans-serif;font-size:18px;font-weight:700;">${escapeHtml(vars.courseLabel)}</p>`
    : `<p style="margin:0 0 18px;">Nos da mucho gusto acompañarte en tu proceso de aprendizaje.</p>`;

  const evaluationInner = vars.hasValidatedLevel && vars.studentLevel
    ? quote(`Tu nivel registrado es: <strong>${escapeHtml(vars.studentLevel)}</strong>`)
    : `${quote("Antes de iniciar formalmente tus clases, será necesario realizar la evaluación diagnóstica correspondiente para determinar tu nivel inicial.")}
       ${vars.evaluationUrl ? `<p style="margin:0 0 12px;">${emailSecondaryButton("Ver mi evaluación", vars.evaluationUrl)}</p>` : ""}`;

  const smrtInner = vars.smrtEnabled
    ? `${quote("Tu programa puede incluir acceso a <strong>SMRT English</strong> como plataforma académica y material complementario.")}
       ${vars.smrtUrl ? `<p style="margin:0 0 12px;">${emailSecondaryButton("Ir a SMRT English", vars.smrtUrl)}</p>` : ""}`
    : vars.courseLanguage === "portuguese"
      ? quote("Material académico disponible en tu cuenta AIL.")
      : vars.courseLanguage === "spanish"
        ? quote("Material académico correspondiente a tu programa de español para extranjeros.")
        : quote("Consulta el material académico asignado dentro de tu cuenta AIL.");

  const classAccessInner = vars.classJoinUrl
    ? `${quote("Tus clases se imparten en modalidad virtual. Este es tu acceso autorizado:")}
       <p style="margin:0 0 12px;">${emailSecondaryButton("Entrar a clase", vars.classJoinUrl)}</p>`
    : quote("Tus clases se imparten en modalidad virtual. Los accesos correspondientes estarán disponibles dentro de tu cuenta o agenda.");

  const rcaCta =
    vars.rcaUrl
      ? `<p style="margin:0 0 12px;">${emailSecondaryButton("Revisar y aceptar reglamento", vars.rcaUrl)}</p>`
      : "";

  const body = `
    <p style="margin:0 0 16px;">Hola <strong>${escapeHtml(vars.firstName)}</strong>:</p>
    <p style="margin:0 0 16px;">¡Bienvenid@ oficialmente a <strong>A-Inman Languages</strong>!</p>
    ${courseBlock}
    <p style="margin:0 0 18px;">A partir de ahora tendrás acceso a las herramientas y recursos correspondientes a tu programa. Para comenzar, sigue estos pasos:</p>

    ${step(
      "Paso 1 — Accede a tu cuenta AIL",
      `${quote("Desde tu cuenta podrás consultar las funciones disponibles de acuerdo con tu programa.")}
       <p style="margin:0 0 12px;">${emailPrimaryButton("Entrar a mi dashboard →", vars.dashboardUrl)}</p>`,
    )}

    ${vars.showEvaluation ? step("Paso 2 — Revisa tu nivel / evaluación diagnóstica", evaluationInner) : ""}

    ${step(
      "Paso 3 — Agenda tus clases",
      `${quote("Consulta la disponibilidad de horarios y programa tus clases conforme a tu plan y la disponibilidad docente.")}
       ${vars.scheduleUrl ? `<p style="margin:0 0 12px;">${emailSecondaryButton("Agendar mis clases", vars.scheduleUrl)}</p>` : ""}`,
    )}

    ${step("Paso 4 — Accede a tus clases", classAccessInner)}

    ${step("Paso 5 — Material académico", `${smrtInner}`)}

    ${step(
      "Información importante",
      `${quote("Antes de comenzar, revisa las políticas académicas y administrativas vigentes de AIL.")}
       ${vars.policiesUrl ? `<p style="margin:0 0 12px;">${emailSecondaryButton("Consultar políticas", vars.policiesUrl)}</p>` : ""}
       ${rcaCta}`,
    )}

    ${step(
      "Pagos y facturación",
      `${quote("Puedes consultar tus opciones de pago, facturación y datos vigentes desde tu cuenta AIL.")}
       ${vars.paymentsUrl ? `<p style="margin:0 0 12px;">${emailSecondaryButton("Ir a Pagos y facturación", vars.paymentsUrl)}</p>` : ""}`,
    )}

    <h2 style="margin:8px 0 12px;font-size:18px;">¿Necesitas ayuda?</h2>
    <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-weight:700;">Académico</p>
    <p style="margin:0 0 12px;">Para dudas relacionadas con clases, contenidos, avance, plataforma o evaluación.</p>
    ${vars.academicSupportUrl ? `<p style="margin:0 0 16px;">${emailSecondaryButton("Contactar Coordinación Académica", vars.academicSupportUrl)}</p>` : ""}
    <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-weight:700;">Administrativo</p>
    <p style="margin:0 0 12px;">Para pagos, facturación, cuenta o documentos.</p>
    ${vars.adminSupportUrl ? `<p style="margin:0 0 18px;">${emailSecondaryButton("Contactar Administración", vars.adminSupportUrl)}</p>` : ""}
    <p style="margin:0;">Estamos para acompañarte durante todo tu proceso de aprendizaje.</p>
  `;

  const textLines = [
    `Hola ${vars.firstName}:`,
    "",
    "¡Bienvenid@ oficialmente a A-Inman Languages!",
    vars.courseLabel ? `Programa: ${vars.courseLabel}` : "",
    `Dashboard: ${vars.dashboardUrl}`,
    vars.scheduleUrl ? `Agendar clases: ${vars.scheduleUrl}` : "",
    vars.paymentsUrl ? `Pagos y facturación: ${vars.paymentsUrl}` : "",
    vars.policiesUrl ? `Políticas: ${vars.policiesUrl}` : "",
    "Estamos para acompañarte durante todo tu proceso de aprendizaje.",
    "A-Inman Languages",
    "Linking Worldwide",
  ].filter(Boolean);

  return {
    subject: STUDENT_WELCOME_SUBJECT,
    preheader: STUDENT_WELCOME_PREHEADER,
    html: renderEmailLayout({
      title: "¡Bienvenid@ oficialmente a AIL!",
      preheader: STUDENT_WELCOME_PREHEADER,
      body,
      logoUrl: vars.logoUrl,
    }),
    text: textLines.join("\n"),
  };
}
