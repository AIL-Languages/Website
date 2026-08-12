import { NextRequest, NextResponse } from "next/server";
import { canCoordinate } from "@/lib/auth/admin";
import { getCurrentProfile } from "@/lib/auth/profile";
import {
  listAvailability,
  replaceAvailability,
  WEEKDAYS,
  type Weekday,
} from "@/lib/scheduling/store";

export const runtime = "nodejs";

type SlotInput = {
  weekday: string;
  availableFrom: string;
  availableTo: string;
  timezone?: string;
};

function parseSlots(raw: unknown): SlotInput[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is SlotInput =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as SlotInput).weekday === "string" &&
      typeof (item as SlotInput).availableFrom === "string" &&
      typeof (item as SlotInput).availableTo === "string",
  );
}

export async function GET(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  const personId =
    request.nextUrl.searchParams.get("personId") || current.id;
  const roleParam = request.nextUrl.searchParams.get("role") as
    | "student"
    | "teacher"
    | null;

  if (
    personId !== current.id &&
    !canCoordinate(current.role, current.email)
  ) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const availability = await listAvailability(
    personId,
    roleParam || undefined,
  );
  return NextResponse.json({ ok: true, availability });
}

export async function PUT(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as {
    personId?: string;
    role?: "student" | "teacher";
    slots?: unknown;
  };

  const personId = body.personId || current.id;
  const role =
    body.role ||
    (current.role === "teacher" ? "teacher" : "student");

  if (
    personId !== current.id &&
    !canCoordinate(current.role, current.email)
  ) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  if (role === "teacher" && !canCoordinate(current.role, current.email) && current.id !== personId) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const slots = parseSlots(body.slots)
    .filter((slot) => WEEKDAYS.includes(slot.weekday as Weekday))
    .map((slot) => ({
      weekday: slot.weekday as Weekday,
      availableFrom: slot.availableFrom,
      availableTo: slot.availableTo,
      timezone: slot.timezone || "America/Chihuahua",
    }));

  const availability = await replaceAvailability(personId, role, slots);
  return NextResponse.json({ ok: true, availability });
}
