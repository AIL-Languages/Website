import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { TeacherApplicationPanel } from "@/components/recruitment/TeacherApplicationPanel";
import { parsePublicRole } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Registro",
  description:
    "Crea tu cuenta en A-Inman Languages o inicia tu postulación docente mediante el proceso de selección.",
};

type Props = {
  searchParams: Promise<{ perfil?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const params = await searchParams;
  const perfil = params.perfil?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const isTeacherApply =
    perfil === "profesor" || perfil === "teacher" || perfil === "docente";

  if (isTeacherApply) {
    return (
      <AuthShell
        title="Postulación docente"
        subtitle="Completa el proceso de selección. La alta como profesor en la plataforma ocurre solo tras aprobación de AIL."
      >
        <TeacherApplicationPanel />
        <p className="mt-8 text-center text-sm text-muted">
          ¿Buscas otro perfil?{" "}
          <Link href="/registro" className="font-semibold text-cyan hover:text-navy">
            Volver al registro
          </Link>
        </p>
      </AuthShell>
    );
  }

  const defaultRole = parsePublicRole(params.perfil);
  const safeRole = defaultRole === "teacher" ? "student" : defaultRole;

  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Elige tu perfil. Los campos del formulario cambian si eres alumno, coordinación académica o empresa. La postulación docente usa un proceso aparte."
    >
      <RegisterForm key={safeRole} defaultRole={safeRole} />
    </AuthShell>
  );
}
