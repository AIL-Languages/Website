import { languages, levels, optionLabel } from "@/lib/academic/options";
import type { ProfileDetails } from "@/lib/academic/details";
import {
  courseLabelFor,
  resolveCourseLanguage,
} from "@/lib/email/course-language";
import type { StudentWelcomeVars } from "@/lib/email/emails/StudentWelcomeEmail";
import { firstNameFrom } from "@/lib/email/names";
import { getRoomForStudent } from "@/lib/scheduling/store";
import { ZoomService } from "@/lib/scheduling/zoom";
import { publicSiteUrl, site, whatsappLink } from "@/lib/site";

function hasSmrtAccess(details: ProfileDetails) {
  if (details.smrtCourse?.trim()) return true;
  const flag = details.smrtAccess?.trim().toLowerCase();
  return flag === "enabled" || flag === "true" || flag === "si" || flag === "sí";
}

function isAuthorizedClassUrl(url?: string) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "zoom.us" || parsed.hostname.endsWith(".zoom.us"))
    );
  } catch {
    return false;
  }
}

export async function buildStudentWelcomeVars(input: {
  name: string;
  details: ProfileDetails;
  studentId?: string;
  origin?: string;
}): Promise<StudentWelcomeVars> {
  const base = (input.origin || publicSiteUrl()).replace(/\/$/, "");
  const courseLanguage = resolveCourseLanguage(
    input.details.language || input.details.program,
  );
  const levelValue = input.details.level?.trim();
  const hasValidatedLevel = Boolean(
    levelValue && levelValue !== "diagnostico",
  );
  const smrtEnabled = hasSmrtAccess(input.details);

  let classJoinUrl: string | undefined;
  if (input.studentId && ZoomService.isConfigured()) {
    const room = await getRoomForStudent(input.studentId);
    if (room?.status === "active" && isAuthorizedClassUrl(room.joinUrl)) {
      classJoinUrl = room.joinUrl;
    }
  }

  return {
    firstName: firstNameFrom(input.name),
    courseLabel: courseLabelFor(
      courseLanguage,
      optionLabel(languages, input.details.language),
    ),
    courseLanguage,
    studentLevel: hasValidatedLevel
      ? optionLabel(levels, levelValue)
      : undefined,
    teacherName: input.details.teacher,
    startDate: input.details.startDate || input.details.preferredStartDate,
    scheduleUrl: input.details.calendlyUrl?.trim() || `${base}/dashboard/calendario`,
    dashboardUrl: `${base}/dashboard`,
    platformName: classJoinUrl ? "Zoom" : undefined,
    platformUrl: classJoinUrl,
    evaluationUrl: `${base}/dashboard/perfil`,
    policiesUrl: `${base}/dashboard/documentos`,
    rcaUrl: `${base}/dashboard/documentos`,
    paymentsUrl: `${base}/dashboard/pagos`,
    smrtUrl: site.smrtAccessUrl,
    smrtEnabled,
    hasValidatedLevel,
    showEvaluation: Boolean(courseLanguage),
    classJoinUrl,
    academicSupportUrl: `https://wa.me/${site.coordinationPhoneE164}?text=${encodeURIComponent(
      "Hola, necesito apoyo de Coordinación Académica.",
    )}`,
    adminSupportUrl: whatsappLink(
      "Hola, necesito apoyo administrativo (pagos, facturación o cuenta).",
    ),
    logoUrl: `${base}/brand/logo-ail-light.png`,
  };
}
