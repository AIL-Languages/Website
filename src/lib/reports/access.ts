import { getAcademicBundle } from "@/lib/academic/store";
import { canCoordinate } from "@/lib/auth/admin";
import type { PublicUser } from "@/lib/auth/types";

export function isCompanyStudent(company: PublicUser, student: PublicUser) {
  return (
    student.role === "student" &&
    (student.details.companyId === company.id ||
      student.createdBy === company.id ||
      Boolean(
        company.details.companyLegalName &&
          student.details.companyName === company.details.companyLegalName,
      ))
  );
}

export async function canViewStudentReports(
  actor: PublicUser,
  student: PublicUser,
) {
  if (actor.id === student.id) return true;
  if (canCoordinate(actor.role, actor.email)) return true;
  if (actor.role === "company") return isCompanyStudent(actor, student);
  if (actor.role === "teacher") {
    if (student.details.teacherId === actor.id) return true;
    const { assignments } = await getAcademicBundle();
    return assignments.some(
      (item) => item.teacherId === actor.id && item.studentId === student.id,
    );
  }
  return false;
}

export async function visibleStudentsFor(
  actor: PublicUser,
  users: PublicUser[],
) {
  const students = users.filter((item) => item.role === "student");
  if (canCoordinate(actor.role, actor.email)) return students;
  if (actor.role === "student") {
    return students.filter((item) => item.id === actor.id);
  }
  if (actor.role === "company") {
    return students.filter((item) => isCompanyStudent(actor, item));
  }
  if (actor.role === "teacher") {
    const { assignments, groups } = await getAcademicBundle();
    const ids = new Set(
      [
        ...assignments
          .filter((item) => item.teacherId === actor.id)
          .map((item) => item.studentId),
        ...groups
          .filter((item) => item.teacherId === actor.id)
          .flatMap((item) => item.studentIds),
      ],
    );
    return students.filter(
      (item) => ids.has(item.id) || item.details.teacherId === actor.id,
    );
  }
  return [];
}

export function canCaptureAcademic(actor: PublicUser) {
  return (
    canCoordinate(actor.role, actor.email) || actor.role === "teacher"
  );
}

export function canAuthorizeDiploma(actor: PublicUser) {
  return canCoordinate(actor.role, actor.email);
}

export function canViewPaymentsReport(actor: PublicUser) {
  return canCoordinate(actor.role, actor.email) || actor.role === "company";
}

export function canViewTeacherReport(actor: PublicUser) {
  return canCoordinate(actor.role, actor.email) || actor.role === "teacher";
}

export function canViewCorporateReport(actor: PublicUser) {
  return canCoordinate(actor.role, actor.email) || actor.role === "company";
}
