import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/profile";
import { smrtGuideForRole } from "@/lib/smrt";

export default async function SmrtGuideIndexPage() {
  const user = await requireProfile();
  const guide = smrtGuideForRole(user.role);
  redirect(
    guide === "teacher"
      ? "/dashboard/smrt-english/guia/profesor"
      : "/dashboard/smrt-english/guia/alumno",
  );
}
