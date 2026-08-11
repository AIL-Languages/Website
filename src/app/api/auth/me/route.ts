import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/profile";

export async function GET() {
  const user = await getCurrentProfile();
  if (!user) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user });
}
