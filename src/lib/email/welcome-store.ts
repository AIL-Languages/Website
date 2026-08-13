import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { APP_DATA_DIR } from "@/lib/paths";
import {
  defaultWelcomeTemplates,
  WELCOME_ROLES,
  type WelcomeRole,
  type WelcomeTemplate,
  type WelcomeTemplateMap,
} from "@/lib/email/welcome-types";

const FILE = path.join(APP_DATA_DIR, "welcome-emails.json");

function mergeTemplate(
  base: WelcomeTemplate,
  patch?: Partial<WelcomeTemplate> | null,
): WelcomeTemplate {
  return {
    autoSend: patch?.autoSend ?? base.autoSend,
    subject: patch?.subject?.trim() || base.subject,
    heading: patch?.heading?.trim() || base.heading,
    body: patch?.body?.trim() || base.body,
    ctaLabel: patch?.ctaLabel?.trim() || base.ctaLabel,
    ctaHref: patch?.ctaHref?.trim() || base.ctaHref,
  };
}

async function readStore(): Promise<WelcomeTemplateMap> {
  const defaults = defaultWelcomeTemplates();
  try {
    const parsed = JSON.parse(await readFile(FILE, "utf8")) as Partial<
      Record<WelcomeRole, Partial<WelcomeTemplate>>
    >;
    return WELCOME_ROLES.reduce((acc, role) => {
      acc[role] = mergeTemplate(defaults[role], parsed[role]);
      return acc;
    }, {} as WelcomeTemplateMap);
  } catch {
    return defaults;
  }
}

async function writeStore(templates: WelcomeTemplateMap) {
  await mkdir(APP_DATA_DIR, { recursive: true });
  await writeFile(FILE, `${JSON.stringify(templates, null, 2)}\n`, "utf8");
}

export async function getWelcomeTemplates() {
  await mkdir(APP_DATA_DIR, { recursive: true });
  return readStore();
}

export async function getWelcomeTemplate(role: WelcomeRole) {
  const templates = await getWelcomeTemplates();
  return templates[role];
}

export async function saveWelcomeTemplates(
  patch: Partial<Record<WelcomeRole, Partial<WelcomeTemplate>>>,
) {
  const current = await getWelcomeTemplates();
  const next = WELCOME_ROLES.reduce((acc, role) => {
    acc[role] = mergeTemplate(current[role], patch[role]);
    return acc;
  }, {} as WelcomeTemplateMap);
  await writeStore(next);
  return next;
}

export async function saveWelcomeTemplate(
  role: WelcomeRole,
  patch: Partial<WelcomeTemplate>,
) {
  const templates = await saveWelcomeTemplates({ [role]: patch });
  return templates[role];
}
