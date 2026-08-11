import { notFound } from "next/navigation";
import { SmrtStudentGuide } from "@/components/dashboard/SmrtStudentGuide";
import { SmrtTeacherGuide } from "@/components/dashboard/SmrtTeacherGuide";
import { requireProfile } from "@/lib/auth/profile";

export const metadata = {
  title: "Guía Smrt English",
};

type Props = {
  params: Promise<{ perfil: string }>;
};

export default async function SmrtGuidePage({ params }: Props) {
  await requireProfile();
  const { perfil } = await params;

  if (perfil === "alumno") return <SmrtStudentGuide />;
  if (perfil === "profesor") return <SmrtTeacherGuide />;
  notFound();
}
