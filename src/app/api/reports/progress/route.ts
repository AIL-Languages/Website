import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile, getProfileById, listProfiles } from "@/lib/auth/profile";
import {
  canCaptureAcademic,
  canViewStudentReports,
  visibleStudentsFor,
} from "@/lib/reports/access";
import { createProgress, listProgress } from "@/lib/reports/store";

export const runtime = "nodejs";

function score(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(100, Math.max(0, n));
}

export async function GET(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  const studentId = request.nextUrl.searchParams.get("studentId") ?? undefined;
  const users = await listProfiles();
  const allowed = new Set((await visibleStudentsFor(current, users)).map((item) => item.id));
  const items = await listProgress(studentId);
  return NextResponse.json({
    ok: true,
    progress: items.filter((item) => allowed.has(item.studentId)),
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

  const snapshot = await createProgress({
    studentId: student.id,
    studentName: student.name,
    language: String(body.language || student.details.language || "ingles"),
    level: String(body.level || student.details.level || "A1"),
    teacherId: current.role === "teacher" ? current.id : String(body.teacherId || ""),
    teacherName:
      current.role === "teacher" ? current.name : String(body.teacherName || student.details.teacher || ""),
    periodStart: body.periodStart ? String(body.periodStart) : undefined,
    periodEnd: body.periodEnd ? String(body.periodEnd) : undefined,
    progressPercent: score(body.progressPercent) ?? 0,
    skills: {
      listening: score(body.listening),
      speaking: score(body.speaking),
      reading: score(body.reading),
      writing: score(body.writing),
      grammar: score(body.grammar),
    },
    teacherObservations: body.teacherObservations
      ? String(body.teacherObservations)
      : undefined,
    academicRecommendation: body.academicRecommendation
      ? String(body.academicRecommendation)
      : undefined,
    source: "manual",
    createdBy: current.id,
  });

  return NextResponse.json({ ok: true, progress: snapshot });
}
