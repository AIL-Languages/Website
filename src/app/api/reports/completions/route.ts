import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile, getProfileById, listProfiles } from "@/lib/auth/profile";
import {
  canAuthorizeDiploma,
  canCaptureAcademic,
  canViewStudentReports,
  visibleStudentsFor,
} from "@/lib/reports/access";
import { listCompletions, upsertCompletion } from "@/lib/reports/store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  const studentId = request.nextUrl.searchParams.get("studentId") ?? undefined;
  const users = await listProfiles();
  const allowed = new Set((await visibleStudentsFor(current, users)).map((item) => item.id));
  const items = await listCompletions(studentId);
  return NextResponse.json({
    ok: true,
    completions: items.filter((item) => allowed.has(item.studentId)),
  });
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current || !canCaptureAcademic(current)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const student = await getProfileById(String(body.studentId ?? ""));
  if (!student || student.role !== "student") {
    return NextResponse.json({ ok: false, error: "Selecciona un alumno." }, { status: 400 });
  }
  if (!(await canViewStudentReports(current, student))) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const staff = canAuthorizeDiploma(current);
  const language = String(body.language || student.details.language || "ingles");
  const level = String(body.level || student.details.level || "A1");
  const existing = (await listCompletions(student.id)).find(
    (item) => item.language === language && item.level === level,
  );
  const levelCompleted = staff
    ? Boolean(body.levelCompleted)
    : Boolean(existing?.levelCompleted);
  const academicAuthorized = staff
    ? Boolean(body.academicAuthorized)
    : Boolean(existing?.academicAuthorized);
  const completion = await upsertCompletion({
    studentId: student.id,
    studentName: student.name,
    language,
    level,
    progressPercent: Number(body.progressPercent) || 0,
    finalExamPassed: Boolean(body.finalExamPassed),
    speakingPassed: Boolean(body.speakingPassed),
    levelCompleted,
    academicAuthorized,
    hoursCompleted: body.hoursCompleted
      ? Number(body.hoursCompleted)
      : existing?.hoursCompleted,
    authorizedBy: academicAuthorized
      ? staff
        ? current.id
        : existing?.authorizedBy
      : undefined,
    authorizedByName: academicAuthorized
      ? staff
        ? current.name
        : existing?.authorizedByName
      : undefined,
    authorizedAt: academicAuthorized
      ? staff
        ? new Date().toISOString()
        : existing?.authorizedAt
      : undefined,
    completedAt: levelCompleted
      ? existing?.completedAt || new Date().toISOString()
      : undefined,
  });

  return NextResponse.json({ ok: true, completion });
}
