import { NextRequest, NextResponse } from "next/server";
import { canCoordinate } from "@/lib/auth/admin";
import { getCurrentProfile, getProfileById } from "@/lib/auth/profile";
import { getRoomForStudent, saveVirtualRoom } from "@/lib/scheduling/store";
import { ZoomService } from "@/lib/scheduling/zoom";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  const studentId =
    request.nextUrl.searchParams.get("studentId") || current.id;
  if (
    studentId !== current.id &&
    !canCoordinate(current.role, current.email)
  ) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  const room = await getRoomForStudent(studentId);
  if (!room) return NextResponse.json({ ok: true, room: null });
  const publicRoom =
    canCoordinate(current.role, current.email)
      ? room
      : { ...room, encryptedHostUrl: undefined };
  return NextResponse.json({ ok: true, room: publicRoom });
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current || !canCoordinate(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const body = (await request.json()) as {
    studentId?: string;
    joinUrl?: string;
    meetingId?: string;
    password?: string;
    createPlaceholder?: boolean;
  };

  if (!body.studentId) {
    return NextResponse.json({ ok: false, error: "Falta studentId." }, { status: 400 });
  }

  const student = await getProfileById(body.studentId);
  if (!student || student.role !== "student") {
    return NextResponse.json({ ok: false, error: "Alumno no encontrado." }, { status: 404 });
  }

  if (body.createPlaceholder) {
    const room = await ZoomService.createStudentRoom(student);
    return NextResponse.json({
      ok: true,
      room: { ...room, encryptedHostUrl: undefined },
    });
  }

  if (!body.joinUrl) {
    return NextResponse.json({ ok: false, error: "Falta joinUrl." }, { status: 400 });
  }

  // Never accept /myhome as classroom URL
  if (body.joinUrl.includes("/myhome")) {
    return NextResponse.json(
      {
        ok: false,
        error: "No uses el portal /myhome de Zoom como aula virtual del alumno.",
      },
      { status: 400 },
    );
  }

  const room = await saveVirtualRoom({
    studentId: student.id,
    provider: "zoom",
    meetingId: body.meetingId || `manual-${student.id.slice(0, 8)}`,
    joinUrl: body.joinUrl.trim(),
    password: body.password?.trim() || undefined,
    topic: ZoomService.topicFor(student),
    status: "active",
  });

  return NextResponse.json({
    ok: true,
    room: { ...room, encryptedHostUrl: undefined },
  });
}
