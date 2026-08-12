import { NextRequest, NextResponse } from "next/server";
import { createAssignment } from "@/lib/academic/store";
import { parseDetails } from "@/lib/academic/details";
import { canCoordinate } from "@/lib/auth/admin";
import {
  getCurrentProfile,
  getProfileById,
  listProfiles,
} from "@/lib/auth/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { findCompatibleTeachers } from "@/lib/scheduling/match";
import { ZoomService } from "@/lib/scheduling/zoom";
export const runtime = "nodejs";

export async function GET() {
  const current = await getCurrentProfile();
  if (!current || !canCoordinate(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const users = await listProfiles();
  const students = users.filter((item) => item.role === "student");
  const teachers = users.filter((item) => item.role === "teacher");

  const rows = [];
  for (const student of students) {
    const matches = await findCompatibleTeachers(student, teachers);
    rows.push({
      student,
      matches: matches.slice(0, 5).map((item) => ({
        teacherId: item.teacher.id,
        teacherName: item.teacher.name,
        score: item.score,
        reasons: item.reasons,
      })),
    });
  }

  return NextResponse.json({ ok: true, rows });
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current || !canCoordinate(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const body = (await request.json()) as {
    studentId?: string;
    teacherId?: string;
  };
  if (!body.studentId || !body.teacherId) {
    return NextResponse.json(
      { ok: false, error: "Selecciona alumno y profesor." },
      { status: 400 },
    );
  }

  const student = await getProfileById(body.studentId);
  const teacher = await getProfileById(body.teacherId);
  if (!student || student.role !== "student") {
    return NextResponse.json({ ok: false, error: "Alumno no encontrado." }, { status: 404 });
  }
  if (!teacher || teacher.role !== "teacher") {
    return NextResponse.json({ ok: false, error: "Profesor no encontrado." }, { status: 404 });
  }

  const assignment = await createAssignment({
    studentId: student.id,
    teacherId: teacher.id,
    createdBy: current.id,
    status: "active",
  });

  const details = parseDetails({
    ...student.details,
    teacherId: teacher.id,
    teacher: teacher.name,
    enrollmentStatus: student.details.enrollmentStatus || "active",
  });

  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(student.id, {
    user_metadata: {
      name: student.name,
      phone: student.phone ?? "",
      role: student.role,
      details,
      accountStatus: student.accountStatus,
    },
  });
  await admin
    .from("profiles")
    .update({ details })
    .eq("id", student.id);

  const paymentConfirmed =
    student.details.paymentStatus === "confirmed" ||
    student.details.paymentStatus === "pagado";

  const room = await ZoomService.maybeCreateForActiveStudent({
    student: { ...student, details },
    paymentConfirmed,
    teacherId: teacher.id,
    enrollmentStatus: details.enrollmentStatus,
  });

  return NextResponse.json({
    ok: true,
    assignment,
    room: room
      ? {
          id: room.id,
          meetingId: room.meetingId,
          joinUrl: room.joinUrl,
          status: room.status,
        }
      : null,
  });
}
