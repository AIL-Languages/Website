import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile, listProfiles } from "@/lib/auth/profile";
import { canAuthorizeDiploma, visibleStudentsFor } from "@/lib/reports/access";
import { getReportsStore, issueDiploma, listDiplomas } from "@/lib/reports/store";

export const runtime = "nodejs";

export async function GET() {
  const current = await getCurrentProfile();
  if (!current) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  const users = await listProfiles();
  const allowed = new Set((await visibleStudentsFor(current, users)).map((item) => item.id));
  const diplomas = (await listDiplomas()).filter((item) => allowed.has(item.studentId));
  return NextResponse.json({ ok: true, diplomas });
}

export async function POST(request: NextRequest) {
  const current = await getCurrentProfile();
  if (!current || !canAuthorizeDiploma(current)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  const body = (await request.json()) as { completionId?: string };
  const { completions } = await getReportsStore();
  const completion = completions.find((item) => item.id === body.completionId);
  if (!completion) {
    return NextResponse.json({ ok: false, error: "No hay un nivel listo para certificar." }, { status: 400 });
  }
  try {
    const diploma = await issueDiploma({
      completion,
      issuedBy: current.id,
      issuedByName: current.name,
    });
    return NextResponse.json({ ok: true, diploma });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "No se pudo emitir el diploma.",
      },
      { status: 400 },
    );
  }
}
