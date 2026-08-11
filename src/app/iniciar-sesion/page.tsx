import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu dashboard de A-Inman Languages.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Inicia sesión"
      subtitle="Entra a tu espacio personal para ver tu información y continuar tu proceso con AIL."
    >
      <Suspense fallback={<p className="text-sm text-muted">Cargando...</p>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
