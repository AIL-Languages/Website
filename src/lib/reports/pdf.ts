import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import QRCode from "qrcode";
import {
  languageNamesEn,
  languages,
  levels,
  optionLabel,
} from "@/lib/academic/options";
import { certificateVerifyUrl, site } from "@/lib/site";
import type { Payment } from "@/lib/ops/payments";
import type {
  AttendanceRecord,
  Diploma,
  LevelCompletion,
  ProgressSnapshot,
} from "@/lib/reports/types";
import { attendanceSummary, skillAverage } from "@/lib/reports/stats";

const navy = rgb(0, 26 / 255, 61 / 255);
const cyan = rgb(0, 184 / 255, 230 / 255);
const ink = rgb(12 / 255, 27 / 255, 51 / 255);
const muted = rgb(90 / 255, 111 / 255, 138 / 255);

function pdfResponse(bytes: Uint8Array, filename: string) {
  return {
    bytes,
    filename,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      "Cache-Control": "private, no-store",
    },
  };
}

async function setup() {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const serif = await pdf.embedFont(StandardFonts.TimesRomanBold);
  return { pdf, regular, bold, italic, serif };
}

function drawHeader(page: PDFPage, bold: PDFFont, regular: PDFFont, subtitle: string) {
  const { width, height } = page.getSize();
  page.drawRectangle({ x: 0, y: height - 72, width, height: 72, color: navy });
  page.drawText(site.name.toUpperCase(), {
    x: 48,
    y: height - 38,
    size: 16,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText(`${site.tagline}  ·  ${subtitle}`, {
    x: 48,
    y: height - 56,
    size: 10,
    font: regular,
    color: cyan,
  });
}

function drawFooter(page: PDFPage, regular: PDFFont, extra?: string) {
  page.drawText(
    extra ||
      `${site.name}  ·  Documentos de salida  ·  Distinto al módulo Documentos PDF`,
    {
      x: 48,
      y: 28,
      size: 8,
      font: regular,
      color: muted,
    },
  );
}

function wrap(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  maxWidth: number,
  color = ink,
) {
  const words = text.split(/\s+/);
  let line = "";
  let cursor = y;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth) {
      page.drawText(line, { x, y: cursor, size, font, color });
      cursor -= size + 4;
      line = word;
    } else {
      line = next;
    }
  }
  if (line) {
    page.drawText(line, { x, y: cursor, size, font, color });
    cursor -= size + 4;
  }
  return cursor;
}

export async function buildDiplomaPdf(diploma: Diploma) {
  const { pdf, regular, bold, italic, serif } = await setup();
  const page = pdf.addPage([842, 595]);
  const { width, height } = page.getSize();

  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });
  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, borderColor: navy, borderWidth: 2 });
  page.drawRectangle({ x: 32, y: 32, width: width - 64, height: height - 64, borderColor: cyan, borderWidth: 1 });

  page.drawText(site.name.toUpperCase(), {
    x: 60,
    y: height - 90,
    size: 22,
    font: bold,
    color: navy,
  });
  page.drawText(site.tagline, {
    x: 60,
    y: height - 112,
    size: 13,
    font: italic,
    color: muted,
  });
  page.drawText("Certificate of Completion", {
    x: 60,
    y: height - 160,
    size: 28,
    font: serif,
    color: navy,
  });
  page.drawText("This certifies that", {
    x: 60,
    y: height - 200,
    size: 12,
    font: italic,
    color: muted,
  });
  page.drawText(diploma.studentName, {
    x: 60,
    y: height - 238,
    size: 26,
    font: serif,
    color: ink,
  });
  page.drawText("has successfully completed", {
    x: 60,
    y: height - 270,
    size: 12,
    font: regular,
    color: muted,
  });
  page.drawText(optionLabel(levels, diploma.level), {
    x: 60,
    y: height - 302,
    size: 18,
    font: bold,
    color: navy,
  });
  page.drawText(`Language: ${languageNamesEn[diploma.language] || optionLabel(languages, diploma.language)}`, {
    x: 60,
    y: height - 332,
    size: 12,
    font: regular,
    color: ink,
  });
  const issued = new Date(diploma.issuedAt).toLocaleDateString("en-GB");
  page.drawText(`Completion date: ${issued}`, {
    x: 60,
    y: height - 352,
    size: 12,
    font: regular,
    color: ink,
  });
  if (diploma.hours) {
    page.drawText(`Certified hours: ${diploma.hours}`, {
      x: 60,
      y: height - 372,
      size: 12,
      font: regular,
      color: ink,
    });
  }
  page.drawText(`Folio: ${diploma.folio}`, {
    x: 60,
    y: height - 400,
    size: 12,
    font: bold,
    color: navy,
  });
  page.drawText("Academic Direction", {
    x: 60,
    y: 90,
    size: 10,
    font: regular,
    color: muted,
  });
  page.drawLine({ start: { x: 60, y: 108 }, end: { x: 240, y: 108 }, thickness: 1, color: navy });
  page.drawText(diploma.issuedByName, {
    x: 60,
    y: 114,
    size: 11,
    font: italic,
    color: ink,
  });

  const verify = certificateVerifyUrl(diploma.folio);
  const qr = await QRCode.toBuffer(verify, { type: "png", margin: 1, width: 160 });
  const image = await pdf.embedPng(qr);
  page.drawImage(image, { x: width - 210, y: 70, width: 110, height: 110 });
  page.drawText("Verify authenticity", {
    x: width - 210,
    y: 58,
    size: 8,
    font: regular,
    color: muted,
  });

  return pdfResponse(
    await pdf.save(),
    `diploma-${diploma.folio}.pdf`,
  );
}

export async function buildAttendancePdf(input: {
  studentName: string;
  language?: string;
  level?: string;
  from?: string;
  to?: string;
  records: AttendanceRecord[];
}) {
  const { pdf, regular, bold } = await setup();
  const page = pdf.addPage([595, 842]);
  drawHeader(page, bold, regular, "Reporte de asistencia");
  const summary = attendanceSummary(input.records, input.from, input.to);
  let y = 740;
  page.drawText("REPORTE DE ASISTENCIA", { x: 48, y, size: 16, font: bold, color: navy });
  y -= 28;
  page.drawText(`Alumno: ${input.studentName}`, { x: 48, y, size: 11, font: regular, color: ink });
  y -= 16;
  page.drawText(
    `Idioma: ${optionLabel(languages, input.language)}   Nivel: ${optionLabel(levels, input.level)}`,
    { x: 48, y, size: 11, font: regular, color: ink },
  );
  y -= 16;
  page.drawText(
    `Periodo: ${input.from || "inicio"} – ${input.to || "hoy"}`,
    { x: 48, y, size: 11, font: regular, color: ink },
  );
  y -= 32;
  const lines = [
    `Clases programadas: ${summary.programmed}`,
    `Clases asistidas: ${summary.attended}`,
    `Inasistencias: ${summary.absences}`,
    `Cancelaciones: ${summary.cancelled}`,
    `Reprogramaciones: ${summary.rescheduled}`,
    `Asistencia: ${summary.percent} %`,
  ];
  for (const line of lines) {
    page.drawText(line, { x: 48, y, size: 12, font: bold, color: navy });
    y -= 20;
  }
  drawFooter(page, regular);
  return pdfResponse(await pdf.save(), `asistencia-${input.studentName.replace(/\s+/g, "-")}.pdf`);
}

export async function buildProgressPdf(input: {
  studentName: string;
  language?: string;
  level?: string;
  teacherName?: string;
  snapshot: ProgressSnapshot | null;
  attendancePercent?: number;
}) {
  const { pdf, regular, bold } = await setup();
  const page = pdf.addPage([595, 842]);
  drawHeader(page, bold, regular, "Reporte de progreso académico");
  let y = 740;
  page.drawText("REPORTE DE PROGRESO ACADÉMICO", { x: 48, y, size: 16, font: bold, color: navy });
  y -= 28;
  const snap = input.snapshot;
  const rows = [
    `Alumno: ${input.studentName}`,
    `Idioma: ${optionLabel(languages, snap?.language || input.language)}`,
    `Nivel: ${optionLabel(levels, snap?.level || input.level)}`,
    `Profesor: ${snap?.teacherName || input.teacherName || "—"}`,
    `Periodo: ${snap?.periodStart || "—"} – ${snap?.periodEnd || "—"}`,
    `Progreso: ${snap?.progressPercent ?? 0} %`,
    `Asistencia: ${input.attendancePercent ?? "—"} %`,
    `Fuente: ${snap?.source === "smrt" ? "Smrt English" : "Registro académico AIL (manual)"}`,
  ];
  for (const row of rows) {
    page.drawText(row, { x: 48, y, size: 11, font: regular, color: ink });
    y -= 18;
  }
  y -= 8;
  const skills = [
    ["Listening", snap?.skills.listening],
    ["Speaking", snap?.skills.speaking],
    ["Reading", snap?.skills.reading],
    ["Writing", snap?.skills.writing],
    ["Grammar", snap?.skills.grammar],
  ] as const;
  for (const [label, value] of skills) {
    page.drawText(`${label} — ${value ?? "—"} %`, { x: 48, y, size: 12, font: bold, color: navy });
    y -= 20;
  }
  const avg = snap ? skillAverage(snap.skills) : null;
  if (avg !== null) {
    page.drawText(`Promedio de habilidades: ${avg} %`, { x: 48, y, size: 11, font: regular, color: ink });
    y -= 24;
  }
  y = wrap(page, `Observaciones del profesor: ${snap?.teacherObservations || "—"}`, 48, y, regular, 11, 500);
  y -= 8;
  wrap(page, `Recomendación académica: ${snap?.academicRecommendation || "—"}`, 48, y, regular, 11, 500);
  drawFooter(page, regular);
  return pdfResponse(await pdf.save(), `progreso-${input.studentName.replace(/\s+/g, "-")}.pdf`);
}

export async function buildHistoryPdf(input: {
  studentName: string;
  completions: LevelCompletion[];
  diplomas: Diploma[];
  progress: ProgressSnapshot[];
}) {
  const { pdf, regular, bold } = await setup();
  const page = pdf.addPage([595, 842]);
  drawHeader(page, bold, regular, "Historial académico");
  let y = 740;
  page.drawText("HISTORIAL ACADÉMICO", { x: 48, y, size: 16, font: bold, color: navy });
  y -= 24;
  page.drawText(`Alumno: ${input.studentName}`, { x: 48, y, size: 11, font: regular, color: ink });
  y -= 28;
  if (!input.completions.length) {
    page.drawText("Aún no hay niveles registrados en el historial.", { x: 48, y, size: 11, font: regular, color: muted });
  }
  for (const item of input.completions) {
    const diploma = input.diplomas.find(
      (doc) => doc.language === item.language && doc.level === item.level,
    );
    page.drawText(
      `${optionLabel(languages, item.language)} · ${optionLabel(levels, item.level)}`,
      { x: 48, y, size: 12, font: bold, color: navy },
    );
    y -= 16;
    page.drawText(
      `Progreso ${item.progressPercent}% · Final ${item.finalExamPassed ? "aprobada" : "pendiente"} · Speaking ${item.speakingPassed ? "aprobado" : "pendiente"} · ${item.levelCompleted ? "Nivel completado" : "En curso"}`,
      { x: 48, y, size: 10, font: regular, color: ink },
    );
    y -= 14;
    page.drawText(
      diploma ? `Diploma: ${diploma.folio}` : "Diploma: no emitido",
      { x: 48, y, size: 10, font: regular, color: muted },
    );
    y -= 22;
    if (y < 80) break;
  }
  drawFooter(page, regular);
  return pdfResponse(await pdf.save(), `historial-${input.studentName.replace(/\s+/g, "-")}.pdf`);
}

export async function buildPaymentsPdf(input: {
  title: string;
  payments: Payment[];
}) {
  const { pdf, regular, bold } = await setup();
  const page = pdf.addPage([595, 842]);
  drawHeader(page, bold, regular, "Reporte de pagos");
  let y = 740;
  page.drawText(input.title, { x: 48, y, size: 16, font: bold, color: navy });
  y -= 28;
  for (const item of input.payments.slice(0, 28)) {
    page.drawText(
      `${item.studentName} · ${item.concept} · $${item.amount} · ${item.status} · ${item.paidAt || item.dueDate || "—"}`,
      { x: 48, y, size: 9, font: regular, color: ink },
    );
    y -= 16;
    if (y < 60) break;
  }
  drawFooter(page, regular);
  return pdfResponse(await pdf.save(), "reporte-pagos.pdf");
}

export async function buildTeacherPdf(input: {
  teacherName: string;
  load: string;
  students: string[];
  groups: string[];
  notes: string[];
}) {
  const { pdf, regular, bold } = await setup();
  const page = pdf.addPage([595, 842]);
  drawHeader(page, bold, regular, "Reporte docente");
  let y = 740;
  page.drawText("REPORTE DOCENTE", { x: 48, y, size: 16, font: bold, color: navy });
  y -= 24;
  page.drawText(input.teacherName, { x: 48, y, size: 13, font: bold, color: ink });
  y -= 18;
  page.drawText(input.load, { x: 48, y, size: 11, font: regular, color: ink });
  y -= 24;
  page.drawText("Grupos", { x: 48, y, size: 12, font: bold, color: navy });
  y -= 16;
  for (const group of input.groups.slice(0, 12)) {
    page.drawText(group, { x: 48, y, size: 10, font: regular, color: ink });
    y -= 14;
  }
  y -= 8;
  page.drawText("Alumnos", { x: 48, y, size: 12, font: bold, color: navy });
  y -= 16;
  for (const student of input.students.slice(0, 20)) {
    page.drawText(student, { x: 48, y, size: 10, font: regular, color: ink });
    y -= 14;
  }
  drawFooter(page, regular);
  return pdfResponse(await pdf.save(), `reporte-docente-${input.teacherName.replace(/\s+/g, "-")}.pdf`);
}

export async function buildCorporatePdf(input: {
  companyName: string;
  program?: string;
  rows: {
    name: string;
    language?: string;
    level?: string;
    attendance: number;
    progress: number;
    diploma?: string;
  }[];
}) {
  const { pdf, regular, bold } = await setup();
  const page = pdf.addPage([595, 842]);
  drawHeader(page, bold, regular, "Reporte corporativo");
  let y = 740;
  page.drawText("PROGRAMA DE IDIOMAS CORPORATIVO", { x: 48, y, size: 15, font: bold, color: navy });
  y -= 22;
  page.drawText(input.companyName, { x: 48, y, size: 13, font: bold, color: ink });
  y -= 16;
  page.drawText(
    `${input.rows.length} colaboradores inscritos · ${input.program || "Programa AIL"}`,
    { x: 48, y, size: 11, font: regular, color: ink },
  );
  y -= 28;
  for (const row of input.rows.slice(0, 24)) {
    page.drawText(
      `${row.name} · ${optionLabel(languages, row.language)} ${optionLabel(levels, row.level)} · asistencia ${row.attendance}% · progreso ${row.progress}%${row.diploma ? ` · ${row.diploma}` : ""}`,
      { x: 48, y, size: 9, font: regular, color: ink },
    );
    y -= 16;
    if (y < 60) break;
  }
  drawFooter(page, regular);
  return pdfResponse(await pdf.save(), `reporte-corporativo-${input.companyName.replace(/\s+/g, "-")}.pdf`);
}
