"use client";

import { useEffect, useMemo, useState } from "react";
import { roleLabel, type PublicProfileRole } from "@/lib/auth/admin";
import { renderStudentWelcomeEmail } from "@/lib/email/emails/StudentWelcomeEmail";
import { renderWelcomeEmail } from "@/lib/email/welcome-render";
import {
  defaultWelcomeTemplates,
  type WelcomeRole,
  type WelcomeTemplate,
  type WelcomeTemplateMap,
} from "@/lib/email/welcome-types";
import { site } from "@/lib/site";

export type WelcomeDraftRecipient = {
  id?: string;
  name: string;
  email: string;
  role: PublicProfileRole;
  password?: string;
};

type Props = {
  open: boolean;
  recipient: WelcomeDraftRecipient | null;
  onClose: () => void;
};

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-navy/10 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-cyan";

export function WelcomeEmailModal({ open, recipient, onClose }: Props) {
  const [templates, setTemplates] = useState<WelcomeTemplateMap>(
    defaultWelcomeTemplates(),
  );
  const [draft, setDraft] = useState<WelcomeTemplate | null>(null);
  const [includePassword, setIncludePassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    let active = true;
    fetch("/api/email/welcome")
      .then(async (response) => {
        const payload = (await response.json()) as {
          ok?: boolean;
          templates?: WelcomeTemplateMap;
        };
        if (active && payload.ok && payload.templates) {
          setTemplates(payload.templates);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !recipient) return;
    if (recipient.role === "student") {
      setDraft(null);
    } else {
      const role = recipient.role as WelcomeRole;
      setDraft(templates[role] ?? defaultWelcomeTemplates()[role]);
    }
    setIncludePassword(Boolean(recipient.password));
    setStatus("idle");
    setMessage(
      recipient.role === "student"
        ? "El correo académico se envía al dar de alta al alumno. Puedes reenviarlo aquí si hace falta."
        : "",
    );
  }, [open, recipient, templates]);

  const preview = useMemo(() => {
    if (!recipient) return "";
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://ail.local";
    if (recipient.role === "student") {
      return renderStudentWelcomeEmail({
        firstName: recipient.name.split(/\s+/)[0] || recipient.name,
        dashboardUrl: `${origin}/dashboard`,
        courseLabel: "tu programa AIL",
        showEvaluation: true,
        hasValidatedLevel: false,
        evaluationUrl: `${origin}/dashboard/perfil`,
        scheduleUrl: `${origin}/dashboard/calendario`,
        policiesUrl: `${origin}/dashboard/documentos`,
        rcaUrl: `${origin}/dashboard/documentos`,
        paymentsUrl: `${origin}/dashboard/pagos`,
        logoUrl: `${origin}/brand/logo-ail-light.png`,
      }).html;
    }
    if (!draft) return "";
    return renderWelcomeEmail(draft, {
      name: recipient.name,
      email: recipient.email,
      roleLabel: roleLabel(recipient.role),
      loginUrl: `${origin}/iniciar-sesion`,
      dashboardUrl: `${origin}/dashboard`,
      siteName: site.name,
      password: includePassword ? recipient.password : undefined,
    }).html;
  }, [draft, includePassword, recipient]);

  if (!open || !recipient) return null;
  if (recipient.role !== "student" && !draft) return null;

  async function send() {
    if (!recipient) return;
    if (recipient.role !== "student" && !draft) return;
    setStatus("sending");
    setMessage("");
    try {
      const endpoint =
        recipient.role === "student"
          ? "/api/email/student-welcome/send"
          : "/api/email/welcome/send";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          recipient.role === "student"
            ? {
                name: recipient.name,
                email: recipient.email,
                studentId: recipient.id,
                force: true,
              }
            : {
                name: recipient.name,
                email: recipient.email,
                role: recipient.role,
                password: includePassword ? recipient.password : undefined,
                template: draft,
              },
        ),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo enviar.");
      }
      setStatus("sent");
      setMessage("Correo de bienvenida enviado.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Error al enviar.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-navy/55 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-email-title"
    >
      <div className="my-4 w-full max-w-5xl rounded-[1.75rem] bg-mist p-4 shadow-[0_24px_80px_rgba(0,26,61,0.28)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">
              Correo de bienvenida
            </p>
            <h2
              id="welcome-email-title"
              className="mt-1 font-display text-2xl font-semibold text-navy"
            >
              {recipient.name} · {roleLabel(recipient.role)}
            </h2>
            <p className="mt-1 text-sm text-muted">{recipient.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-semibold text-navy"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-3 rounded-[1.5rem] bg-white p-4 sm:p-5">
            {recipient.role === "student" || !draft ? (
              <div className="space-y-3 text-sm text-ink">
                <p className="font-display text-lg font-semibold text-navy">
                  Correo académico de onboarding
                </p>
                <p>
                  Este envío usa StudentWelcomeEmail. No reutiliza el correo de
                  prospecto ni incluye datos bancarios.
                </p>
              </div>
            ) : (
              <>
            <label className="block text-sm font-medium text-ink">
              Asunto
              <input
                value={draft.subject}
                onChange={(event) =>
                  setDraft({ ...draft, subject: event.target.value })
                }
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Título
              <input
                value={draft.heading}
                onChange={(event) =>
                  setDraft({ ...draft, heading: event.target.value })
                }
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Mensaje
              <textarea
                rows={10}
                value={draft.body}
                onChange={(event) =>
                  setDraft({ ...draft, body: event.target.value })
                }
                className={fieldClass}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-medium text-ink">
                Botón
                <input
                  value={draft.ctaLabel}
                  onChange={(event) =>
                    setDraft({ ...draft, ctaLabel: event.target.value })
                  }
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Enlace del botón
                <input
                  value={draft.ctaHref}
                  onChange={(event) =>
                    setDraft({ ...draft, ctaHref: event.target.value })
                  }
                  className={fieldClass}
                />
              </label>
            </div>
            {recipient.password ? (
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={includePassword}
                  onChange={(event) => setIncludePassword(event.target.checked)}
                />
                Incluir contraseña temporal (usa {"{{password}}"} en el mensaje)
              </label>
            ) : null}
            <p className="text-xs text-muted">
              Variables: {"{{name}}"} {"{{email}}"} {"{{role}}"} {"{{loginUrl}}"}{" "}
              {"{{dashboardUrl}}"} {"{{siteName}}"} {"{{password}}"}
            </p>
              </>
            )}
          </div>

          <div className="overflow-hidden rounded-[1.5rem] bg-white">
            <p className="border-b border-navy/8 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Vista previa
            </p>
            <iframe
              title="Vista previa del correo"
              className="h-[420px] w-full bg-white"
              srcDoc={preview}
            />
          </div>
        </div>

        {message ? (
          <p
            className={`mt-4 text-sm ${
              status === "sent"
                ? "text-lime-deep"
                : status === "error"
                  ? "text-red-600"
                  : "text-muted"
            }`}
            role="status"
          >
            {message}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-navy/15 bg-white px-5 py-2.5 text-sm font-semibold text-navy"
          >
            Ahora no
          </button>
          <button
            type="button"
            onClick={() => void send()}
            disabled={status === "sending"}
            className="rounded-full bg-ail-green px-5 py-2.5 text-sm font-semibold text-ail-navy disabled:opacity-70"
          >
            {status === "sending" ? "Enviando..." : "Enviar bienvenida"}
          </button>
        </div>
      </div>
    </div>
  );
}
