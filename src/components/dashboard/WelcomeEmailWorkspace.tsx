"use client";

import { useEffect, useMemo, useState } from "react";
import { roleLabel } from "@/lib/auth/admin";
import {
  leadWelcomeVarsFrom,
  renderLeadWelcomeEmail,
} from "@/lib/email/emails/LeadWelcomeEmail";
import { renderStudentWelcomeEmail } from "@/lib/email/emails/StudentWelcomeEmail";
import { renderWelcomeEmail } from "@/lib/email/welcome-render";
import {
  defaultWelcomeTemplates,
  WELCOME_ROLES,
  type WelcomeRole,
  type WelcomeTemplate,
  type WelcomeTemplateMap,
} from "@/lib/email/welcome-types";
import { site, whatsappLink } from "@/lib/site";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-navy/10 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-cyan";

type Journey = "lead" | "student" | "staff";

function sampleStudentHtml(name: string, origin: string) {
  return renderStudentWelcomeEmail({
    firstName: name.split(/\s+/)[0] || name,
    dashboardUrl: `${origin}/dashboard`,
    courseLabel: "Inglés",
    courseLanguage: "english",
    showEvaluation: true,
    hasValidatedLevel: false,
    evaluationUrl: `${origin}/dashboard/perfil`,
    scheduleUrl: `${origin}/dashboard/calendario`,
    policiesUrl: `${origin}/dashboard/documentos`,
    rcaUrl: `${origin}/dashboard/documentos`,
    paymentsUrl: `${origin}/dashboard/pagos`,
    smrtEnabled: true,
    smrtUrl: site.smrtAccessUrl,
    academicSupportUrl: `https://wa.me/${site.coordinationPhoneE164}?text=${encodeURIComponent("Hola, necesito apoyo de Coordinación Académica.")}`,
    adminSupportUrl: whatsappLink(
      "Hola, necesito apoyo administrativo (pagos, facturación o cuenta).",
    ),
    logoUrl: `${origin}/brand/logo-ail-light.png`,
  }).html;
}

export function WelcomeEmailWorkspace() {
  const [journey, setJourney] = useState<Journey>("lead");
  const [templates, setTemplates] = useState<WelcomeTemplateMap>(
    defaultWelcomeTemplates(),
  );
  const [role, setRole] = useState<WelcomeRole>("teacher");
  const [draft, setDraft] = useState<WelcomeTemplate>(
    defaultWelcomeTemplates().teacher,
  );
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testName, setTestName] = useState("Denisse");
  const [testInterest, setTestInterest] = useState("ingles");

  useEffect(() => {
    fetch("/api/email/welcome")
      .then(async (response) => {
        const payload = (await response.json()) as {
          ok?: boolean;
          templates?: WelcomeTemplateMap;
        };
        if (payload.ok && payload.templates) {
          setTemplates(payload.templates);
          setDraft(payload.templates.teacher);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setDraft(templates[role]);
  }, [role, templates]);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://ail.local";

  const preview = useMemo(() => {
    if (journey === "lead") {
      return renderLeadWelcomeEmail(
        leadWelcomeVarsFrom({
          name: testName || "Nombre",
          interest: testInterest,
          origin,
        }),
      ).html;
    }
    if (journey === "student") {
      return sampleStudentHtml(testName || "Nombre", origin);
    }
    return renderWelcomeEmail(draft, {
      name: testName || "Nombre",
      email: testEmail || "correo@ejemplo.com",
      roleLabel: roleLabel(role),
      loginUrl: `${origin}/iniciar-sesion`,
      dashboardUrl: `${origin}/dashboard`,
      siteName: site.name,
    }).html;
  }, [draft, journey, origin, role, testEmail, testInterest, testName]);

  async function save() {
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const response = await fetch("/api/email/welcome", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, template: draft }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        template?: WelcomeTemplate;
      };
      if (!response.ok || !payload.ok || !payload.template) {
        throw new Error(payload.error || "No se pudo guardar.");
      }
      setTemplates((current) => ({ ...current, [role]: payload.template! }));
      setStatus("Plantilla guardada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function sendTest() {
    setError("");
    setStatus("");
    try {
      const endpoint =
        journey === "lead"
          ? "/api/email/lead-welcome/send"
          : journey === "student"
            ? "/api/email/student-welcome/send"
            : "/api/email/welcome/send";
      const body =
        journey === "lead"
          ? { name: testName || "Denisse", email: testEmail, interest: testInterest }
          : journey === "student"
            ? {
                name: testName || "Denisse",
                email: testEmail,
                persist: false,
                details: { language: "ingles", enrollmentStatus: "active" },
              }
            : {
                name: testName || "Denisse",
                email: testEmail,
                role,
                template: draft,
              };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo enviar la prueba.");
      }
      setStatus("Correo de prueba enviado.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar.");
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["lead", "Prospecto / lead"],
            ["student", "Alumno inscrito"],
            ["staff", "Equipo"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setJourney(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              journey === id ? "bg-navy text-white" : "bg-white text-navy"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {journey === "staff" ? (
        <div className="flex flex-wrap gap-2">
          {WELCOME_ROLES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRole(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                role === item ? "bg-cyan text-navy" : "bg-white text-navy"
              }`}
            >
              {roleLabel(item)}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">
          {journey === "lead"
            ? "Se envía solo con el evento lead_created, cuando un visitante completa el formulario de interés. Nunca incluye datos académicos privados."
            : "Se envía solo con student_enrolled, cuando el prospecto ya fue dado de alta como alumno activo. No vuelve a mandar el correo comercial."}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3 rounded-[1.75rem] bg-white p-5 sm:p-6">
          {journey === "staff" ? (
            <>
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={draft.autoSend}
                  onChange={(event) =>
                    setDraft({ ...draft, autoSend: event.target.checked })
                  }
                />
                Enviar automáticamente al registrarse desde la landing
              </label>
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
                  rows={12}
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
                  Enlace
                  <input
                    value={draft.ctaHref}
                    onChange={(event) =>
                      setDraft({ ...draft, ctaHref: event.target.value })
                    }
                    className={fieldClass}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
              >
                {saving ? "Guardando..." : "Guardar plantilla"}
              </button>
            </>
          ) : journey === "lead" ? (
            <div className="space-y-3 text-sm text-ink">
              <p className="font-display text-lg font-semibold text-navy">
                Correo comercial de prospecto
              </p>
              <p>
                Asunto: <strong>¡Gracias por contactar a A-Inman Languages! 🌎</strong>
              </p>
              <p>
                CTA principal: Conocer AIL. Secundario: Ver programas. No incluye
                CLABE, Zoom, SMRT, dashboard ni reglamento.
              </p>
              <label className="block text-sm font-medium text-ink">
                Interés de prueba
                <select
                  value={testInterest}
                  onChange={(event) => setTestInterest(event.target.value)}
                  className={fieldClass}
                >
                  <option value="ingles">Inglés</option>
                  <option value="portugues">Portugués</option>
                  <option value="espanol">Español para extranjeros</option>
                  <option value="empresas">Programas corporativos</option>
                  <option value="traduccion">Traducción e interpretación</option>
                </select>
              </label>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-ink">
              <p className="font-display text-lg font-semibold text-navy">
                Correo académico de onboarding
              </p>
              <p>
                Asunto:{" "}
                <strong>¡Bienvenid@ oficialmente a A-Inman Languages! 🎓</strong>
              </p>
              <p>
                CTA principal: Entrar a mi dashboard. Bloques condicionales para
                evaluación, agenda, SMRT, políticas y pagos. No reutiliza el
                correo de prospecto.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-[1.75rem] bg-white">
            <p className="border-b border-navy/8 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Vista previa
            </p>
            <iframe
              title="Vista previa"
              className="h-[420px] w-full bg-white"
              srcDoc={preview}
            />
          </div>
          <div className="rounded-[1.75rem] bg-white p-5">
            <h3 className="font-display text-lg font-semibold text-navy">
              Enviar prueba
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={testName}
                onChange={(event) => setTestName(event.target.value)}
                placeholder="Nombre de prueba"
                className={fieldClass}
              />
              <input
                type="email"
                value={testEmail}
                onChange={(event) => setTestEmail(event.target.value)}
                placeholder="tu-correo@dominio.com"
                className={fieldClass}
              />
            </div>
            <button
              type="button"
              onClick={() => void sendTest()}
              disabled={!testEmail}
              className="mt-4 rounded-full bg-ail-green px-5 py-2.5 text-sm font-semibold text-ail-navy disabled:opacity-60"
            >
              Enviar a este correo
            </button>
          </div>
        </div>
      </div>

      {status ? <p className="text-sm text-lime-deep">{status}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </section>
  );
}
