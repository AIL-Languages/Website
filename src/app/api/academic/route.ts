import { NextRequest, NextResponse } from "next/server";
import {
  createAssignment,
  createFollowUp,
  createGroup,
  createSchedule,
  getAcademicBundle,
  updateGroup,
} from "@/lib/academic/store";
import { parseDetails } from "@/lib/academic/details";
import { canAccessCoordination } from "@/lib/auth/admin";
import { getCurrentProfile, getProfileById } from "@/lib/auth/profile";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const current = await getCurrentProfile();
  if (!current || !canAccessCoordination(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  const data = await getAcademicBundle();
  return NextResponse.json({ ok: true, ...data });
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current || !canAccessCoordination(current.role, current.email)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const body = (await request.json()) as Record<string, string | string[]>;
  const type = String(body.type ?? "group");

  if (type === "followup") {
    if (!body.studentName || !body.notes) {
      return NextResponse.json(
        { ok: false, error: "Completa alumno y notas de seguimiento." },
        { status: 400 },
      );
    }
    const followUp = await createFollowUp({
      studentName: String(body.studentName),
      studentId: body.studentId ? String(body.studentId) : undefined,
      notes: String(body.notes),
      createdBy: current.id,
    });
    return NextResponse.json({ ok: true, followUp });
  }

  if (type === "assignment") {
    if (!body.studentId || !body.teacherId) {
      return NextResponse.json(
        { ok: false, error: "Selecciona alumno y profesor." },
        { status: 400 },
      );
    }
    const groupId = body.groupId ? String(body.groupId) : undefined;
    const assignment = await createAssignment({
      studentId: String(body.studentId),
      teacherId: String(body.teacherId),
      groupId,
      createdBy: current.id,
      status: "active",
    });
    const student = await getProfileById(String(body.studentId));
    const teacher = await getProfileById(String(body.teacherId));
    if (student && teacher) {
      const details = parseDetails({
        ...student.details,
        teacherId: teacher.id,
        teacher: teacher.name,
      });
      const admin = createAdminClient();
      await admin.from("profiles").update({ details }).eq("id", student.id);
    }
    if (groupId) {
      const { groups } = await getAcademicBundle();
      const group = groups.find((item) => item.id === groupId);
      if (group && !group.studentIds.includes(String(body.studentId))) {
        await updateGroup(groupId, {
          studentIds: [...group.studentIds, String(body.studentId)],
        });
      }
    }
    return NextResponse.json({ ok: true, assignment });
  }

  if (type === "schedule") {
    if (!body.day || !body.start || !body.end) {
      return NextResponse.json(
        { ok: false, error: "Completa día y horario." },
        { status: 400 },
      );
    }
    const slot = await createSchedule({
      day: String(body.day),
      start: String(body.start),
      end: String(body.end),
      teacherId: body.teacherId ? String(body.teacherId) : undefined,
      studentId: body.studentId ? String(body.studentId) : undefined,
      groupId: body.groupId ? String(body.groupId) : undefined,
      notes: body.notes ? String(body.notes) : undefined,
      createdBy: current.id,
    });
    return NextResponse.json({ ok: true, slot });
  }

  if (type === "group-update") {
    const group = await updateGroup(String(body.id), {
      studentIds: Array.isArray(body.studentIds)
        ? body.studentIds.map(String)
        : typeof body.studentIds === "string" && body.studentIds
          ? body.studentIds.split(",").filter(Boolean)
          : undefined,
      teacherId: body.teacherId ? String(body.teacherId) : undefined,
      teacher: body.teacher ? String(body.teacher) : undefined,
      schedule: body.schedule ? String(body.schedule) : undefined,
    });
    if (!group) {
      return NextResponse.json({ ok: false, error: "Grupo no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, group });
  }

  if (!body.name || !body.language || !body.level || !body.schedule) {
    return NextResponse.json(
      { ok: false, error: "Completa nombre, idioma, nivel y horario del grupo." },
      { status: 400 },
    );
  }

  const group = await createGroup({
    name: String(body.name),
    language: String(body.language),
    level: String(body.level),
    teacher: String(body.teacher || "Por asignar"),
    teacherId: body.teacherId ? String(body.teacherId) : undefined,
    schedule: String(body.schedule),
    weeklyHours: body.weeklyHours ? String(body.weeklyHours) : undefined,
    createdBy: current.id,
  });
  return NextResponse.json({ ok: true, group });
}
