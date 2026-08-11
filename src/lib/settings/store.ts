import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { APP_DATA_DIR } from "@/lib/paths";
import type { PublicProfileRole } from "@/lib/auth/admin";
import { site } from "@/lib/site";

export type AdminLogEntry = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
};

export type InstitutionSettings = {
  institutionName: string;
  slogan: string;
  email: string;
  phone: string;
  coordinationPhone: string;
  location: string;
  weeklySmrtHours: number;
  maxGroupSize: number;
  classDurationMinutes: number;
  allowPublicRegistration: boolean;
  enabledProfiles: PublicProfileRole[];
  classModalities: string;
  classTypes: string;
  timezone: string;
  notifyPayments: boolean;
  notifyClasses: boolean;
  notifySchedule: boolean;
  notifyAdmin: boolean;
  notifyAcademic: boolean;
  log: AdminLogEntry[];
};

const FILE = path.join(APP_DATA_DIR, "settings.json");

export function defaultSettings(): InstitutionSettings {
  return {
    institutionName: site.name,
    slogan: site.tagline,
    email: site.email,
    phone: site.phoneDisplay,
    coordinationPhone: site.coordinationPhoneDisplay,
    location: site.location,
    weeklySmrtHours: 1,
    maxGroupSize: 5,
    classDurationMinutes: 60,
    allowPublicRegistration: true,
    enabledProfiles: ["student", "teacher", "coordinator", "company"],
    classModalities: "Clases personalizadas y grupos reducidos (máximo 5) en Zoom.",
    classTypes: "Personalizada, grupo reducido, English for Business, English + STEM, certificaciones.",
    timezone: "America/Chihuahua",
    notifyPayments: true,
    notifyClasses: true,
    notifySchedule: true,
    notifyAdmin: false,
    notifyAcademic: true,
    log: [],
  };
}

async function readSettings(): Promise<InstitutionSettings> {
  await mkdir(APP_DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(FILE, "utf8");
    return { ...defaultSettings(), ...(JSON.parse(raw) as Partial<InstitutionSettings>) };
  } catch {
    return defaultSettings();
  }
}

async function writeSettings(settings: InstitutionSettings) {
  await mkdir(APP_DATA_DIR, { recursive: true });
  await writeFile(FILE, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}

export async function getSettings() {
  return readSettings();
}

export async function updateSettings(patch: Partial<InstitutionSettings>) {
  const current = await readSettings();
  const next: InstitutionSettings = {
    ...current,
    ...patch,
    log: patch.log ?? current.log,
    enabledProfiles: patch.enabledProfiles ?? current.enabledProfiles,
  };
  await writeSettings(next);
  return next;
}

export async function addAdminLog(entry: Omit<AdminLogEntry, "id" | "createdAt">) {
  const current = await readSettings();
  const item: AdminLogEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  current.log.unshift(item);
  await writeSettings(current);
  return item;
}
