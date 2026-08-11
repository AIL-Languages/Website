import {
  languages,
  levels,
  optionLabel,
  plans,
  programs,
  teacherStatuses,
} from "@/lib/academic/options";

export type ProfileDetails = {
  language?: string;
  level?: string;
  teacher?: string;
  plan?: string;
  startDate?: string;
  companyId?: string;
  companyName?: string;
  languagesTaught?: string;
  availability?: string;
  certifications?: string;
  status?: string;
  companyLegalName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  program?: string;
  studentCount?: string;
  coordinatedLanguages?: string;
  coordinationFocus?: string;
  accountStatus?: string;
  teacherId?: string;
  academicStatus?: string;
  observations?: string;
  smrtCourse?: string;
  smrtProgress?: string;
  weeklyHoursMax?: string;
  weeklyHoursAssigned?: string;
  education?: string;
  hireDate?: string;
  daysAvailable?: string;
  proficiencyLevel?: string;
};

const KEYS: (keyof ProfileDetails)[] = [
  "language",
  "level",
  "teacher",
  "plan",
  "startDate",
  "companyId",
  "companyName",
  "languagesTaught",
  "availability",
  "certifications",
  "status",
  "companyLegalName",
  "contactName",
  "contactEmail",
  "contactPhone",
  "program",
  "studentCount",
  "coordinatedLanguages",
  "coordinationFocus",
  "accountStatus",
  "teacherId",
  "academicStatus",
  "observations",
  "smrtCourse",
  "smrtProgress",
  "weeklyHoursMax",
  "weeklyHoursAssigned",
  "education",
  "hireDate",
  "daysAvailable",
  "proficiencyLevel",
];

export function parseDetails(value: unknown): ProfileDetails {
  if (!value || typeof value !== "object") return {};
  const source = value as Record<string, unknown>;
  const details: ProfileDetails = {};
  for (const key of KEYS) {
    const item = source[key];
    if (typeof item === "string" && item.trim()) {
      details[key] = item.trim();
    }
  }
  return details;
}

export function detailsFromForm(
  form: FormData,
  extras: Partial<ProfileDetails> = {},
): ProfileDetails {
  const details: ProfileDetails = { ...extras };
  for (const key of KEYS) {
    const raw = form.get(key);
    if (typeof raw === "string" && raw.trim()) {
      details[key] = raw.trim();
    }
  }
  const taught = form.getAll("languagesTaught").filter((item) => typeof item === "string");
  if (taught.length) {
    details.languagesTaught = taught.join(", ");
  }
  const coordinated = form
    .getAll("coordinatedLanguages")
    .filter((item) => typeof item === "string");
  if (coordinated.length) {
    details.coordinatedLanguages = coordinated.join(", ");
  }
  return details;
}

function labelsForList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => optionLabel(languages, item))
    .join(", ");
}

export function detailRows(
  role: string,
  details: ProfileDetails,
): { label: string; value: string }[] {
  if (role === "student") {
    return [
      { label: "Idioma", value: optionLabel(languages, details.language) },
      { label: "Nivel", value: optionLabel(levels, details.level) },
      { label: "Profesor", value: details.teacher || "Por asignar" },
      { label: "Plan", value: optionLabel(plans, details.plan) },
      { label: "Fecha de inicio", value: details.startDate || "—" },
    ];
  }
  if (role === "teacher") {
    return [
      { label: "Idiomas que imparte", value: labelsForList(details.languagesTaught) || "—" },
      { label: "Disponibilidad", value: details.availability || "—" },
      { label: "Certificaciones", value: details.certifications || "—" },
      { label: "Estatus", value: optionLabel(teacherStatuses, details.status) },
    ];
  }
  if (role === "company") {
    return [
      { label: "Empresa", value: details.companyLegalName || "—" },
      { label: "Contacto responsable", value: details.contactName || "—" },
      { label: "Correo de contacto", value: details.contactEmail || "—" },
      { label: "Teléfono", value: details.contactPhone || "—" },
      { label: "Programa contratado", value: optionLabel(programs, details.program) },
      { label: "Número de alumnos", value: details.studentCount || "—" },
    ];
  }
  if (role === "coordinator") {
    return [
      {
        label: "Idiomas que coordina",
        value: labelsForList(details.coordinatedLanguages) || "—",
      },
      { label: "Enfoque operativo", value: details.coordinationFocus || "—" },
    ];
  }
  return [];
}
