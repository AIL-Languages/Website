import type { PublicProfileRole } from "@/lib/auth/admin";
import type { BankTransferDetails } from "@/lib/billing/transfer";

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
  /** Fuente única: Admin → Configuración → Métodos de pago */
  bankTransfer: BankTransferDetails;
  log: AdminLogEntry[];
};
