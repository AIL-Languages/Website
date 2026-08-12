import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/profile";
import {
  listClasses,
  upsertClass,
  type ClassStatus,
  CLASS_STATUSES,
} from "@/lib/scheduling/store";
import { canCoordinate } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const studentId = request.nextUrl.searchParams.get("studentId");
  if (studentId && studentId !== current.id && !canCoordinate(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const classes = await listClasses({
    studentId:
      studentId ||
      (current.role === "student" ? current.id : undefined),
    teacherId: current.role === "teacher" ? current.id : undefined,
  });

  return NextResponse.json({ ok: true, classes });
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current || !canCoordinate(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const body = (await request.json()) as Record<string, string>;
  if (!body.studentId || !body.startDatetime || !body.endDatetime) {
    return NextResponse.json(
      { ok: false, error: "Faltan datos de la clase." },
      { status: 400 },
    );
  }

  const status = (CLASS_STATUSES.includes(body.status as ClassStatus)
    ? body.status
    : "scheduled") as ClassStatus;

  const item = await upsertClass({
    studentId: body.studentId,
    teacherId: body.teacherId || undefined,
    groupId: body.groupId || undefined,
    calendlyEventId: body.calendlyEventId || undefined,
    calendlyInviteeId: body.calendlyInviteeId || undefined,
    startDatetime: body.startDatetime,
    endDatetime: body.endDatetime,
    status,
    notes: body.notes || undefined,
  });

  return NextResponse.json({ ok: true, class: item });
}
