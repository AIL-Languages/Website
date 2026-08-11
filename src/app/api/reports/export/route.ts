import { NextRequest, NextResponse } from "next/server";
import { getAcademicBundle } from "@/lib/academic/store";
import { optionLabel, programs } from "@/lib/academic/options";
import { canCoordinate } from "@/lib/auth/admin";
import { getCurrentProfile, getProfileById, listProfiles } from "@/lib/auth/profile";
import { teacherLoad } from "@/lib/ops/load";
import { listPayments } from "@/lib/ops/payments";
import {
  canViewCorporateReport,
  canViewPaymentsReport,
  canViewStudentReports,
  canViewTeacherReport,
  isCompanyStudent,
  visibleStudentsFor,
} from "@/lib/reports/access";
import {
  buildAttendancePdf,
  buildCorporatePdf,
  buildDiplomaPdf,
  buildHistoryPdf,
  buildPaymentsPdf,
  buildProgressPdf,
  buildTeacherPdf,
} from "@/lib/reports/pdf";
import { attendanceSummary, latestProgress } from "@/lib/reports/stats";
import {
  getDiplomaByFolio,
  listAttendance,
  listCompletions,
  listDiplomas,
  listProgress,
} from "@/lib/reports/store";

export const runtime = "nodejs";

function fileResponse(
  payload: { bytes: Uint8Array; filename: string; headers: Record<string, string> },
) {
  return new NextResponse(new Uint8Array(payload.bytes), { headers: payload.headers });
}

export async function GET(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const kind = request.nextUrl.searchParams.get("kind");
  const studentId = request.nextUrl.searchParams.get("studentId") ?? undefined;
  const teacherId = request.nextUrl.searchParams.get("teacherId") ?? undefined;
  const from = request.nextUrl.searchParams.get("from") ?? undefined;
  const to = request.nextUrl.searchParams.get("to") ?? undefined;
  const folio = request.nextUrl.searchParams.get("folio") ?? undefined;

  if (kind === "diploma" && folio) {
    const diploma = await getDiplomaByFolio(folio);
    if (!diploma) {
      return NextResponse.json({ ok: false, error: "Diploma no encontrado." }, { status: 404 });
    }
    const student = await getProfileById(diploma.studentId);
    if (!student || !(await canViewStudentReports(current, student))) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
    }
    return fileResponse(await buildDiplomaPdf(diploma));
  }

  const users = await listProfiles();

  if (kind === "asistencia" || kind === "progreso" || kind === "historial") {
    const student = studentId
      ? users.find((item) => item.id === studentId)
      : current.role === "student"
        ? current
        : undefined;
    if (!student || student.role !== "student") {
      return NextResponse.json({ ok: false, error: "Selecciona un alumno." }, { status: 400 });
    }
    if (!(await canViewStudentReports(current, student))) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
    }
    if (kind === "asistencia") {
      return fileResponse(
        await buildAttendancePdf({
          studentName: student.name,
          language: student.details.language,
          level: student.details.level,
          from,
          to,
          records: await listAttendance(student.id),
        }),
      );
    }
    if (kind === "progreso") {
      const progress = await listProgress(student.id);
      const attendance = attendanceSummary(await listAttendance(student.id), from, to);
      return fileResponse(
        await buildProgressPdf({
          studentName: student.name,
          language: student.details.language,
          level: student.details.level,
          teacherName: student.details.teacher,
          snapshot: latestProgress(progress),
          attendancePercent: attendance.percent,
        }),
      );
    }
    return fileResponse(
      await buildHistoryPdf({
        studentName: student.name,
        completions: await listCompletions(student.id),
        diplomas: await listDiplomas(student.id),
        progress: await listProgress(student.id),
      }),
    );
  }

  if (kind === "pagos") {
    if (!canViewPaymentsReport(current)) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
    }
    const all = await listPayments();
    const visible = await visibleStudentsFor(current, users);
    const ids = new Set(visible.map((item) => item.id));
    const payments =
      current.role === "student"
        ? all.filter((item) => item.studentId === current.id)
        : all.filter((item) => ids.has(item.studentId));
    return fileResponse(
      await buildPaymentsPdf({
        title: "REPORTE DE PAGOS",
        payments,
      }),
    );
  }

  if (kind === "docente") {
    if (!canViewTeacherReport(current)) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
    }
    const teacher =
      current.role === "teacher"
        ? current
        : users.find((item) => item.id === teacherId && item.role === "teacher");
    if (!teacher) {
      return NextResponse.json({ ok: false, error: "Selecciona un profesor." }, { status: 400 });
    }
    if (current.role === "teacher" && teacher.id !== current.id) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
    }
    const academic = await getAcademicBundle();
    const load = teacherLoad(teacher, academic.groups);
    const assigned = academic.assignments.filter((item) => item.teacherId === teacher.id);
    return fileResponse(
      await buildTeacherPdf({
        teacherName: teacher.name,
        load: `Disponibilidad ${load.max || "—"} h · asignadas ${load.assigned} h · disponibles ${load.available} h`,
        groups: academic.groups
          .filter((item) => item.teacherId === teacher.id)
          .map((item) => `${item.name} · ${item.schedule}`),
        students: assigned.map((item) => {
          const student = users.find((user) => user.id === item.studentId);
          return student?.name || item.studentId;
        }),
        notes: [],
      }),
    );
  }

  if (kind === "corporativo") {
    if (!canViewCorporateReport(current)) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
    }
    const companyId = request.nextUrl.searchParams.get("companyId");
    const company =
      current.role === "company"
        ? current
        : users.find((item) => item.id === companyId && item.role === "company");
    const target =
      company?.role === "company"
        ? company
        : canCoordinate(current.role, current.email)
          ? current
          : null;
    if (!target) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
    }
    const students =
      target.role === "company"
        ? users.filter((item) => isCompanyStudent(target, item))
        : await visibleStudentsFor(current, users);
    const rows = await Promise.all(
      students.map(async (student) => {
        const attendance = attendanceSummary(await listAttendance(student.id));
        const progress = latestProgress(await listProgress(student.id));
        const diploma = (await listDiplomas(student.id))[0];
        return {
          name: student.name,
          language: student.details.language,
          level: student.details.level,
          attendance: attendance.percent,
          progress: progress?.progressPercent ?? 0,
          diploma: diploma?.folio,
        };
      }),
    );
    return fileResponse(
      await buildCorporatePdf({
        companyName:
          target.role === "company"
            ? target.details.companyLegalName || target.name
            : "A-Inman Languages",
        program: optionLabel(programs, target.details.program),
        rows,
      }),
    );
  }

  return NextResponse.json({ ok: false, error: "Tipo de reporte no válido." }, { status: 400 });
}
