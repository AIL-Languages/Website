import { extractText, getMeta } from "unpdf";
import {
  documentKindLabel,
  type DocumentKind,
} from "@/lib/documents/kinds";

export type ExtractedField = {
  label: string;
  value: string;
};

export type ExtractedInfo = {
  kind: DocumentKind;
  summary: string;
  fields: ExtractedField[];
  text: string;
  pageCount: number;
  scanned: boolean;
};

const MAX_TEXT = 100_000;

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function unique(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const item = clean(value);
    const key = item.toLowerCase();
    if (!item || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function capture(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const value = match?.[1] ? clean(match[1]) : "";
    if (value) return value;
  }
  return "";
}

function captureAll(text: string, pattern: RegExp) {
  return unique([...text.matchAll(pattern)].map((match) => match[1] ?? match[0]));
}

function addField(fields: ExtractedField[], label: string, value?: string) {
  if (!value) return;
  if (fields.some((field) => field.label === label && field.value === value)) {
    return;
  }
  fields.push({ label, value });
}

function detectKind(text: string, filename: string): DocumentKind {
  const hay = fold(`${filename}\n${text}`);

  if (
    hay.includes("constancia de situacion fiscal") ||
    hay.includes("constancia de situacion") ||
    (hay.includes("sat.gob") && hay.includes("rfc")) ||
    (/\bcsf\b/.test(hay) && (hay.includes("rfc") || hay.includes("regimen")))
  ) {
    return "csf";
  }

  if (
    hay.includes("comprobante de pago") ||
    hay.includes("comprobante de transferencia") ||
    hay.includes("spei") ||
    hay.includes("deposito") ||
    hay.includes("transferencia electronica") ||
    hay.includes("clabe") ||
    hay.includes("folio fiscal") ||
    hay.includes("cfdi")
  ) {
    return "pago";
  }

  if (
    hay.includes("ielts") ||
    hay.includes("toefl") ||
    hay.includes("toeic") ||
    hay.includes("cambridge") ||
    hay.includes("celpe-bras") ||
    hay.includes("celpe bras") ||
    hay.includes("dele") ||
    hay.includes("siele") ||
    hay.includes("certificado") ||
    hay.includes("certificacion") ||
    hay.includes("certificate") ||
    hay.includes("diploma")
  ) {
    return "certificacion";
  }

  if (
    hay.includes("credencial para votar") ||
    hay.includes("instituto nacional electoral") ||
    hay.includes("pasaporte") ||
    (hay.includes("curp") && hay.includes("clave unica")) ||
    hay.includes("identificacion oficial")
  ) {
    return "identificacion";
  }

  if (hay.includes("contrato") || hay.includes("convenio") || hay.includes("clausula")) {
    return "contrato";
  }

  return "otro";
}

function extractCsF(text: string, fields: ExtractedField[]) {
  addField(
    fields,
    "RFC",
    capture(text, [
      /RFC\s*[:.]?\s*([A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2,3})/i,
      /\b([A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3})\b/,
    ]),
  );
  addField(
    fields,
    "Razón social / Nombre",
    capture(text, [
      /raz[oó]n social\s*[:.]?\s*([^\n]+)/i,
      /denominaci[oó]n o raz[oó]n social\s*[:.]?\s*([^\n]+)/i,
      /nombre,?\s*denominaci[oó]n o raz[oó]n social\s*[:.]?\s*([^\n]+)/i,
      /nombre\s*[:.]?\s*([A-ZÁÉÍÓÑÜ][^\n]{5,80})/i,
    ]),
  );
  addField(
    fields,
    "Régimen fiscal",
    capture(text, [
      /r[eé]gimen fiscal\s*[:.]?\s*([^\n]+)/i,
      /r[eé]gimen\s*[:.]?\s*([0-9]{3}\s*[^\n]+)/i,
    ]),
  );
  addField(
    fields,
    "Código postal",
    capture(text, [
      /c[oó]digo postal\s*[:.]?\s*(\d{5})/i,
      /\bC\.?\s*P\.?\s*[:.]?\s*(\d{5})\b/i,
    ]),
  );
  addField(
    fields,
    "Domicilio fiscal",
    capture(text, [/domicilio fiscal\s*[:.]?\s*([^\n]+)/i]),
  );
  addField(
    fields,
    "Fecha de emisión",
    capture(text, [
      /fecha de (?:emisi[oó]n|expedici[oó]n)\s*[:.]?\s*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})/i,
      /a ([0-9]{1,2} de [a-záéíóú]+ de [0-9]{4})/i,
    ]),
  );
}

function extractPayment(text: string, fields: ExtractedField[]) {
  addField(
    fields,
    "Importe",
    capture(text, [
      /(?:importe|monto|total(?: a pagar)?|cantidad)\s*[:.]?\s*(\$?\s*[\d,]+\.\d{2}(?:\s*MXN)?)/i,
      /\$\s*([\d,]+\.\d{2})/,
    ]),
  );
  addField(
    fields,
    "Fecha",
    capture(text, [
      /fecha(?: de (?:operaci[oó]n|pago|abono))?\s*[:.]?\s*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})/i,
      /\b([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{4})\b/,
    ]),
  );
  addField(
    fields,
    "CLABE",
    capture(text, [/CLABE(?:\s*interbancaria)?\s*[:.]?\s*(\d{18})/i]),
  );
  addField(
    fields,
    "Referencia",
    capture(text, [
      /referencia(?: num[eé]rica)?\s*[:.]?\s*([A-Z0-9-]{4,30})/i,
      /n[uú]m(?:ero|\.)?\s*de referencia\s*[:.]?\s*([A-Z0-9-]{4,30})/i,
    ]),
  );
  addField(
    fields,
    "Folio fiscal",
    capture(text, [
      /folio fiscal\s*[:.]?\s*([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/i,
    ]),
  );
  addField(
    fields,
    "Banco",
    capture(text, [
      /banco\s*[:.]?\s*([^\n]+)/i,
      /instituci[oó]n(?: bancaria)?\s*[:.]?\s*([^\n]+)/i,
    ]),
  );
  addField(
    fields,
    "Concepto",
    capture(text, [/concepto\s*[:.]?\s*([^\n]+)/i]),
  );
  addField(
    fields,
    "Ordenante",
    capture(text, [/(?:ordenante|emisor|pagador)\s*[:.]?\s*([^\n]+)/i]),
  );
  addField(
    fields,
    "Beneficiario",
    capture(text, [/(?:beneficiario|receptor|destinatario)\s*[:.]?\s*([^\n]+)/i]),
  );
}

function extractCertification(text: string, fields: ExtractedField[]) {
  addField(
    fields,
    "Certificación",
    capture(text, [
      /(IELTS(?: Academic| General Training)?)/i,
      /(TOEFL\s*iBT|TOEFL|TOEIC|DELE|SIELE|CELPE-BRAS)/i,
      /(Cambridge\s*(?:B1|B2|C1|C2|FCE|CAE|CPE|KET|PET)[^\n]{0,20})/i,
      /certificad[oa] de\s+([^\n]+)/i,
    ]),
  );
  addField(
    fields,
    "Nivel",
    capture(text, [
      /\b((?:CEFR\s*)?[A-C][12](?:\+)?)\b/,
      /nivel\s*[:.]?\s*([A-C][12]|principiante|intermedio|avanzado)[^\n]{0,20}/i,
    ]),
  );
  addField(
    fields,
    "Puntaje",
    capture(text, [
      /(?:overall\s*band\s*score|band\s*score|score|puntaje|calificaci[oó]n)\s*[:.]?\s*([0-9]{1,3}(?:[.,][0-9]+)?)/i,
    ]),
  );
  addField(
    fields,
    "Candidato",
    capture(text, [
      /(?:candidate(?:'s)? name|nombre del (?:candidato|alumno|sustentante))\s*[:.]?\s*([^\n]+)/i,
    ]),
  );
  addField(
    fields,
    "Folio / ID",
    capture(text, [
      /(?:certificate\s*(?:number|no\.?)|n[uú]mero de (?:certificado|folio)|candidate\s*number)\s*[:.]?\s*([A-Z0-9-]{4,30})/i,
    ]),
  );
  addField(
    fields,
    "Fecha",
    capture(text, [
      /(?:date of (?:issue|exam|test)|fecha(?: de (?:emisi[oó]n|examen|aplicaci[oó]n))?)\s*[:.]?\s*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[0-9]{1,2}\s+\w+\s+[0-9]{4})/i,
    ]),
  );
  addField(
    fields,
    "Institución",
    capture(text, [
      /(?:awarding body|instituci[oó]n|universidad|centro(?: de aplicaci[oó]n)?)\s*[:.]?\s*([^\n]+)/i,
    ]),
  );
}

function extractIdentity(text: string, fields: ExtractedField[]) {
  addField(
    fields,
    "Nombre",
    capture(text, [/nombre\s*[:.]?\s*([A-ZÁÉÍÓÚÑÜ][^\n]{5,80})/i]),
  );
  addField(
    fields,
    "CURP",
    capture(text, [
      /CURP\s*[:.]?\s*([A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d)/i,
      /\b([A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d)\b/,
    ]),
  );
  addField(
    fields,
    "Clave de elector",
    capture(text, [/clave de elector\s*[:.]?\s*([A-Z0-9]{10,20})/i]),
  );
}

function extractGeneric(text: string, fields: ExtractedField[]) {
  const emails = captureAll(text, /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi);
  emails.slice(0, 3).forEach((email, index) => {
    addField(fields, emails.length > 1 ? `Correo ${index + 1}` : "Correo", email);
  });

  const phones = captureAll(
    text,
    /(?:tel(?:[eé]fono)?|whatsapp)?\s*[:.]?\s*(\+?\d[\d\s()-]{9,16}\d)/gi,
  ).filter((item) => item.replace(/\D/g, "").length >= 10);
  phones.slice(0, 2).forEach((phone, index) => {
    addField(fields, phones.length > 1 ? `Teléfono ${index + 1}` : "Teléfono", phone);
  });

  if (!fields.some((field) => field.label === "RFC")) {
    const rfc = capture(text, [/\b([A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3})\b/]);
    addField(fields, "RFC", rfc);
  }
}

function buildSummary(kind: DocumentKind, fields: ExtractedField[], scanned: boolean) {
  if (scanned) {
    return "El PDF parece una imagen escaneada y no se pudo extraer texto automáticamente. Ábrelo para revisarlo.";
  }
  const highlights = fields
    .slice(0, 4)
    .map((field) => `${field.label}: ${field.value}`)
    .join(" · ");
  if (highlights) {
    return `${documentKindLabel(kind)}. ${highlights}`;
  }
  return `Se leyó el archivo como ${documentKindLabel(kind).toLowerCase()}. Revisa el texto extraído.`;
}

export async function analyzePdf(
  bytes: Uint8Array,
  filename: string,
  requested: DocumentKind | "auto",
): Promise<ExtractedInfo> {
  let text = "";
  let pageCount = 1;

  try {
    const extracted = await extractText(bytes, { mergePages: true });
    text = clean(extracted.text).slice(0, MAX_TEXT);
    pageCount = extracted.totalPages || 1;
  } catch (error) {
    console.error("[documents] extractText", error);
  }

  const scanned = text.length < 40;
  const detected = detectKind(`${filename}\n${text}`, filename);
  const kind = requested === "auto" ? detected : requested;
  const fields: ExtractedField[] = [];

  try {
    const meta = await getMeta(bytes, { parseDates: true });
    const title = typeof meta.info?.Title === "string" ? clean(meta.info.Title) : "";
    const author = typeof meta.info?.Author === "string" ? clean(meta.info.Author) : "";
    if (title && title.length < 120) addField(fields, "Título del PDF", title);
    if (author && author.length < 80) addField(fields, "Autor del PDF", author);
  } catch {
    // Metadata is optional
  }

  if (!scanned) {
    if (kind === "csf") extractCsF(text, fields);
    if (kind === "pago") extractPayment(text, fields);
    if (kind === "certificacion") extractCertification(text, fields);
    if (kind === "identificacion") extractIdentity(text, fields);
    extractGeneric(text, fields);
  }

  if (requested === "auto" && detected !== kind) {
    addField(fields, "Tipo detectado", documentKindLabel(detected));
  }

  return {
    kind,
    summary: buildSummary(kind, fields, scanned),
    fields,
    text,
    pageCount,
    scanned,
  };
}
