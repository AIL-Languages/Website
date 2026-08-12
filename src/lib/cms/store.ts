import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { APP_DATA_DIR } from "@/lib/paths";
import {
  defaultCmsAuth,
  defaultCmsContent,
  type CmsAuthState,
  type CmsSiteContent,
  type CmsStoreFile,
} from "@/lib/cms/types";

const FILE = path.join(APP_DATA_DIR, "cms.json");
const SALT_ROUNDS = 12;

async function readFileStore(): Promise<CmsStoreFile> {
  await mkdir(APP_DATA_DIR, { recursive: true });
  try {
    const parsed = JSON.parse(await readFile(FILE, "utf8")) as Partial<CmsStoreFile>;
    return {
      auth: { ...defaultCmsAuth(), ...(parsed.auth ?? {}) },
      content: {
        ...defaultCmsContent(),
        ...(parsed.content ?? {}),
        hero: { ...defaultCmsContent().hero, ...(parsed.content?.hero ?? {}) },
        about: { ...defaultCmsContent().about, ...(parsed.content?.about ?? {}) },
        programs: {
          ...defaultCmsContent().programs,
          ...(parsed.content?.programs ?? {}),
        },
        contact: {
          ...defaultCmsContent().contact,
          ...(parsed.content?.contact ?? {}),
        },
      },
    };
  } catch {
    return {
      auth: defaultCmsAuth(),
      content: defaultCmsContent(),
    };
  }
}

async function writeFileStore(store: CmsStoreFile) {
  await mkdir(APP_DATA_DIR, { recursive: true });
  await writeFile(FILE, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export async function getCmsContent(): Promise<CmsSiteContent> {
  return (await readFileStore()).content;
}

export async function saveCmsContent(
  content: CmsSiteContent,
  updatedBy: string,
): Promise<CmsSiteContent> {
  const store = await readFileStore();
  store.content = {
    ...content,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  await writeFileStore(store);
  return store.content;
}

export async function getCmsAuth(): Promise<CmsAuthState> {
  return (await readFileStore()).auth;
}

export async function hasCmsPassword(): Promise<boolean> {
  const auth = await getCmsAuth();
  return Boolean(auth.passwordHash);
}

export async function setCmsPassword(plainPassword: string): Promise<void> {
  const trimmed = plainPassword.trim();
  if (trimmed.length < 10) {
    throw new Error("La contraseña del CMS debe tener al menos 10 caracteres.");
  }
  const store = await readFileStore();
  store.auth = {
    passwordHash: await bcrypt.hash(trimmed, SALT_ROUNDS),
    passwordUpdatedAt: new Date().toISOString(),
  };
  await writeFileStore(store);
}

export async function verifyCmsPassword(plainPassword: string): Promise<boolean> {
  const auth = await getCmsAuth();
  if (!auth.passwordHash) return false;
  return bcrypt.compare(plainPassword.trim(), auth.passwordHash);
}
