import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { parsePublicRole } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Registro",
  description:
    "Crea tu cuenta en A-Inman Languages como alumno, profesor, coordinación académica o empresa.",
};

type Props = {
  searchParams: Promise<{ perfil?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const params = await searchParams;
  const defaultRole = parsePublicRole(params.perfil);

  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Elige tu perfil. Los campos del formulario cambian si eres alumno, profesor, coordinación académica o empresa."
    >
      <RegisterForm key={defaultRole} defaultRole={defaultRole} />
    </AuthShell>
  );
}
