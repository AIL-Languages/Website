"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  CONTACT_INTEREST_EVENT,
  interestLabels,
  interestOptions,
  readContactInterest,
} from "@/lib/interests";
import { EMAIL_ERROR } from "@/lib/leads/validate";
import { whatsappLink } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function newRequestId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [interest, setInterest] = useState("");
  const [emailError, setEmailError] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [welcomeEmailSent, setWelcomeEmailSent] = useState(false);
  const submittingRef = useRef(false);
  const requestIdRef = useRef(newRequestId());

  const showCompany = interest === "empresas" || interest === "convenios";

  useEffect(() => {
    function applyInterest(value: string | null) {
      if (value && value in interestLabels) {
        setInterest(value);
      }
    }

    applyInterest(readContactInterest());

    function onCustom(event: Event) {
      const detail = (event as CustomEvent<string>).detail;
      applyInterest(detail);
    }

    window.addEventListener(CONTACT_INTEREST_EVENT, onCustom);
    return () => window.removeEventListener(CONTACT_INTEREST_EVENT, onCustom);
  }, []);

  function validateEmailField(value: string) {
    const normalized = value.trim().replace(/\s+/g, "").toLowerCase();
    if (!normalized || !EMAIL_PATTERN.test(normalized)) {
      setEmailError(EMAIL_ERROR);
      return false;
    }
    setEmailError("");
    return true;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current || status === "loading") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    if (!validateEmailField(email)) {
      form.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
      return;
    }

    submittingRef.current = true;
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email,
          phone: data.get("phone"),
          interest: data.get("interest"),
          goals: data.get("goals"),
          availability: data.get("availability"),
          company: data.get("company"),
          website: data.get("website"),
          requestId: requestIdRef.current,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        welcomeEmailSent?: boolean;
        maskedEmail?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo enviar la solicitud.");
      }

      trackEvent("lead_submitted", { interest: String(data.get("interest") ?? "") });
      if (payload.welcomeEmailSent) {
        trackEvent("lead_welcome_email_sent");
      }

      setWelcomeEmailSent(Boolean(payload.welcomeEmailSent));
      setMaskedEmail(payload.maskedEmail ?? "");
      setStatus("success");
      form.reset();
      setInterest("");
    } catch (error) {
      submittingRef.current = false;
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Ocurrió un error. Intenta de nuevo o escríbenos por WhatsApp.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="ail-card ail-card--plain space-y-5 sm:p-8">
        <h3 className="font-display text-2xl font-semibold text-ink">
          {welcomeEmailSent
            ? "¡Gracias por tu interés! 🌎"
            : "Solicitud recibida correctamente"}
        </h3>
        <p className="text-sm leading-relaxed text-muted">
          {welcomeEmailSent && maskedEmail
            ? `Hemos recibido tu información correctamente. También te enviamos un correo de bienvenida a ${maskedEmail}.`
            : "Hemos recibido tu información correctamente."}
        </p>
        <p className="text-sm leading-relaxed text-ink/85">
          Nuestro equipo se pondrá en contacto contigo para continuar con tu
          solicitud.
        </p>
        <a
          href="#inicio"
          className="ail-btn w-full sm:w-auto"
        >
          Continuar explorando AIL →
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative space-y-4 overflow-x-hidden ail-card ail-card--plain sm:p-8"
    >
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label>
          Sitio web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Nombre
          <input
            required
            name="name"
            autoComplete="given-name"
            className="mt-2 w-full rounded-xl border border-navy/10 bg-white px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
            placeholder="Tu nombre"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Correo electrónico
          <input
            required
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? "lead-email-error" : undefined}
            onInvalid={(event) => {
              event.preventDefault();
              event.currentTarget.setCustomValidity(EMAIL_ERROR);
              setEmailError(EMAIL_ERROR);
            }}
            onInput={(event) => {
              event.currentTarget.setCustomValidity("");
              if (emailError) setEmailError("");
            }}
            onBlur={(event) => {
              if (event.currentTarget.value.trim()) {
                validateEmailField(event.currentTarget.value);
              }
            }}
            className="mt-2 w-full max-w-full rounded-xl border border-navy/10 bg-white px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
            placeholder="nombre@correo.com"
          />
          {emailError ? (
            <span id="lead-email-error" className="mt-1 block text-sm text-red-600">
              {emailError}
            </span>
          ) : null}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Teléfono / WhatsApp
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className="mt-2 w-full rounded-xl border border-navy/10 bg-white px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
            placeholder="+52 ..."
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Programa de interés
          <select
            required
            name="interest"
            value={interest}
            onChange={(event) => setInterest(event.target.value)}
            className="mt-2 w-full rounded-xl border border-navy/10 bg-white px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            {interestOptions
              .filter((option) => option.value !== "")
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        </label>
      </div>

      {showCompany ? (
        <label className="block text-sm font-medium text-ink">
          Empresa
          <input
            name="company"
            autoComplete="organization"
            className="mt-2 w-full rounded-xl border border-navy/10 bg-white px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
            placeholder="Nombre de tu organización"
          />
        </label>
      ) : null}

      <label className="block text-sm font-medium text-ink">
        Objetivos
        <textarea
          required
          name="goals"
          rows={3}
          className="mt-2 w-full rounded-xl border border-navy/10 bg-white px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          placeholder="Académicos, profesionales, viaje, certificación..."
        />
      </label>

      <label className="block text-sm font-medium text-ink">
        Disponibilidad
        <input
          name="availability"
          className="mt-2 w-full rounded-xl border border-navy/10 bg-white px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          placeholder="Días y horarios preferidos"
        />
      </label>

      <p className="text-xs leading-relaxed text-muted">
        Al enviar este formulario aceptas que A-Inman Languages utilice tus datos
        para responder a tu solicitud y dar seguimiento al servicio de tu interés.
      </p>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={status === "loading"}
          className="ail-btn flex-1 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Enviando..." : "Quiero información"}
        </button>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="ail-btn ail-btn--secondary flex-1"
        >
          Enviar WhatsApp
        </a>
      </div>

      {message ? (
        <p className="text-sm text-red-600" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
