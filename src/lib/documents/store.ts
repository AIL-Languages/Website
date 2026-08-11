import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { APP_DATA_DIR } from "@/lib/paths";
import type { ExtractedInfo } from "@/lib/documents/extract";
import type { DocumentKind } from "@/lib/documents/kinds";
import type { UserRole } from "@/lib/auth/admin";

export type StoredDocument = {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  kind: DocumentKind;
  notes?: string;
  uploadedAt: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedByEmail: string;
  uploadedByRole: UserRole;
  extracted: ExtractedInfo;
  linkedUserId?: string;
};

export type PublicDocument = Omit<StoredDocument, "storedName">;

const DIR = path.join(APP_DATA_DIR, "documents");
const FILES_DIR = path.join(DIR, "files");
const INDEX = path.join(DIR, "index.json");

async function ensureDirs() {
  await mkdir(FILES_DIR, { recursive: true });
}

async function readIndex(): Promise<StoredDocument[]> {
  await ensureDirs();
  try {
    const raw = await readFile(INDEX, "utf8");
    const parsed = JSON.parse(raw) as StoredDocument[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeIndex(documents: StoredDocument[]) {
  await ensureDirs();
  await writeFile(INDEX, `${JSON.stringify(documents, null, 2)}\n`, "utf8");
}

export function toPublicDocument(document: StoredDocument): PublicDocument {
  const { storedName: _storedName, ...publicDocument } = document;
  return publicDocument;
}

export function filePathFor(document: StoredDocument) {
  return path.join(FILES_DIR, document.storedName);
}

export async function listDocuments() {
  return readIndex();
}

export async function getDocument(id: string) {
  const documents = await readIndex();
  return documents.find((item) => item.id === id) ?? null;
}

export async function saveDocument(input: {
  bytes: Buffer;
  originalName: string;
  mimeType: string;
  kind: DocumentKind;
  notes?: string;
  extracted: ExtractedInfo;
  linkedUserId?: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedByEmail: string;
  uploadedByRole: UserRole;
}) {
  await ensureDirs();
  const id = crypto.randomUUID();
  const storedName = `${id}.pdf`;
  const document: StoredDocument = {
    id,
    originalName: input.originalName,
    storedName,
    mimeType: input.mimeType || "application/pdf",
    size: input.bytes.length,
    kind: input.kind,
    notes: input.notes,
    uploadedAt: new Date().toISOString(),
    uploadedBy: input.uploadedBy,
    uploadedByName: input.uploadedByName,
    uploadedByEmail: input.uploadedByEmail,
    uploadedByRole: input.uploadedByRole,
    extracted: input.extracted,
    linkedUserId: input.linkedUserId,
  };

  await writeFile(path.join(FILES_DIR, storedName), input.bytes);
  const documents = await readIndex();
  documents.unshift(document);
  await writeIndex(documents);
  return document;
}

export async function deleteDocument(id: string) {
  const documents = await readIndex();
  const current = documents.find((item) => item.id === id);
  if (!current) return null;

  await writeIndex(documents.filter((item) => item.id !== id));
  try {
    await unlink(filePathFor(current));
  } catch {
    // File may already be gone
  }
  return current;
}
