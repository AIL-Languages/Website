import type { PublicProfileRole } from "@/lib/auth/admin";

export const WELCOME_ROLES = [
  "teacher",
  "coordinator",
  "company",
] as const satisfies readonly PublicProfileRole[];

export type WelcomeRole = (typeof WELCOME_ROLES)[number];

export type WelcomeTemplate = {
  /** Envío automático al registrarse desde la landing. */
  autoSend: boolean;
  subject: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export type WelcomeTemplateMap = Record<WelcomeRole, WelcomeTemplate>;

export type WelcomeVars = {
  name: string;
  email: string;
  roleLabel: string;
  loginUrl: string;
  dashboardUrl: string;
  siteName: string;
  password?: string;
};

export function isWelcomeRole(value: string): value is WelcomeRole {
  return (WELCOME_ROLES as readonly string[]).includes(value);
}

export function defaultWelcomeTemplates(): WelcomeTemplateMap {
  return {
    teacher: {
      autoSend: false,
      subject: "Bienvenido/a al equipo docente AIL",
      heading: "Tu cuenta de profesor está lista",
      body: `Hola {{name}},

Te damos la bienvenida al equipo docente de A-Inman Languages.

Tu cuenta ya está activa. Inicia sesión con {{email}} para consultar tu agenda, alumnos asignados y disponibilidad.

El equipo académico te acompañará en los siguientes pasos.`,
      ctaLabel: "Entrar al dashboard",
      ctaHref: "{{dashboardUrl}}",
    },
    coordinator: {
      autoSend: false,
      subject: "Acceso a coordinación académica AIL",
      heading: "Tu cuenta de coordinación está lista",
      body: `Hola {{name}},

Tu cuenta de coordinación académica en A-Inman Languages ya está activa.

Ingresa con {{email}} para gestionar alumnos, profesores, horarios y seguimiento.

Cualquier duda, escribe a ainman.languages@gmail.com.`,
      ctaLabel: "Abrir dashboard",
      ctaHref: "{{dashboardUrl}}",
    },
    company: {
      autoSend: true,
      subject: "Cuenta corporativa A-Inman Languages",
      heading: "Tu cuenta de empresa está lista",
      body: `Hola {{name}},

Tu cuenta corporativa en A-Inman Languages ya está activa.

Ingresa con {{email}} para gestionar alumnos de tu empresa, pagos, facturación y reportes.

Estamos listos para acompañar la capacitación de tu equipo.`,
      ctaLabel: "Iniciar sesión",
      ctaHref: "{{loginUrl}}",
    },
  };
}
