import { NextRequest, NextResponse } from "next/server";
import {
  listClasses,
  upsertClass,
  type ClassStatus,
} from "@/lib/scheduling/store";

export const runtime = "nodejs";

/**
 * Phase 2 stub: accepts Calendly webhook payloads and upserts local classes.
 * Configure CALENDLY_WEBHOOK_SIGNING_KEY before enabling signature checks.
 */
export async function POST(request: NextRequest) {
  const raw = await request.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const event = String(payload.event || payload.event_type || "");
  const payloadData =
    (payload.payload as Record<string, unknown> | undefined) || payload;
  const scheduledEvent =
    (payloadData.scheduled_event as Record<string, unknown> | undefined) ||
    payloadData;
  const invitee =
    (payloadData.invitee as Record<string, unknown> | undefined) || {};

  const calendlyEventId = String(
    scheduledEvent.uri || scheduledEvent.uuid || payloadData.event || "",
  );
  const calendlyInviteeId = String(invitee.uri || invitee.uuid || "");
  const startDatetime = String(
    scheduledEvent.start_time || payloadData.start_time || "",
  );
  const endDatetime = String(
    scheduledEvent.end_time || payloadData.end_time || "",
  );

  let status: ClassStatus = "scheduled";
  if (event.includes("canceled") || event.includes("cancelled")) {
    status = "cancelled";
  } else if (event.includes("rescheduled")) {
    status = "rescheduled";
  }

  if (!startDatetime || !endDatetime) {
    return NextResponse.json({
      ok: true,
      ignored: true,
      reason: "Sin horarios en el payload (fase 1 stub).",
      event,
    });
  }

  const existing = (await listClasses()).find(
    (item) =>
      item.calendlyEventId &&
      calendlyEventId &&
      item.calendlyEventId === calendlyEventId,
  );

  const studentId =
    String(
      (payloadData.tracking as Record<string, string> | undefined)?.utm_content ||
        existing?.studentId ||
        "",
    ) || existing?.studentId;

  if (!studentId) {
    return NextResponse.json({
      ok: true,
      ignored: true,
      reason: "Sin student_id mapeado aún.",
      event,
    });
  }

  const item = await upsertClass({
    id: existing?.id,
    studentId,
    teacherId: existing?.teacherId,
    calendlyEventId: calendlyEventId || undefined,
    calendlyInviteeId: calendlyInviteeId || undefined,
    startDatetime,
    endDatetime,
    status,
  });

  return NextResponse.json({ ok: true, class: item });
}
