import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile, getProfileById, listProfiles } from "@/lib/auth/profile";
import {
  canCaptureAcademic,
  canViewStudentReports,
  visibleStudentsFor,
} from "@/lib/reports/access";
import {
  ATTENDANCE_STATUSES,
  type AttendanceStatus,
} from "@/lib/reports/types";
import { createAttendance, listAttendance } from "@/lib/reports/store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  const studentId = request.nextUrl.searchParams.get("studentId") ?? undefined;
  const users = await listProfiles();
  const visible = await visibleStudentsFor(current, users);
  const allowed = new Set(visible.map((item) => item.id));
  const records = await listAttendance(studentId);
  return NextResponse.json({
    ok: true,
    records: records.filter((item) => allowed.has(item.studentId)),
  });
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current || !canCaptureAcademic(current)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  const body = (await request.json()) as Record<string, string>;
  const student = await getProfileById(body.studentId);
  if (!student || student.role !== "student") {
    return NextResponse.json({ ok: false, error: "Selecciona un alumno." }, { status: 400 });
  }
  if (!(await canViewStudentReports(current, student))) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  if (!body.date || !ATTENDANCE_STATUSES.includes(body.status as AttendanceStatus)) {
    return NextResponse.json(
      { ok: false, error: "Completa fecha y estatus de la clase." },
      { status: 400 },
    );
  }
  const record = await createAttendance({
    studentId: student.id,
    studentName: student.name,
    teacherId: current.role === "teacher" ? current.id : body.teacherId,
    groupId: body.groupId || undefined,
    date: body.date,
    status: body.status as AttendanceStatus,
    notes: body.notes || undefined,
    createdBy: current.id,
  });
  return NextResponse.json({ ok: true, record });
}
