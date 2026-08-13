"use client";

import { useEffect, useId, useState } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-navy/10 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-cyan";

const buttonClass =
  "ail-btn ail-btn--ghost";

export function SendTestEmailButton() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Prueba Resend · A-Inman Languages");
  const [message, setMessage] = useState(
    "Hola,\n\nEste es un correo de prueba enviado desde la landing de A-Inman Languages para verificar Resend.\n\nA-Inman Languages\nLinking Worldwide",
  );
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  async function send() {
    setStatus("sending");
    setFeedback("");
    try {
      const response = await fetch("/api/email/test/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo enviar el correo.");
      }
      setStatus("sent");
      setFeedback("Correo enviado con Resend. Revisa la bandeja de entrada (y spam).");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error ? error.message : "No se pudo enviar el correo.",
      );
    }
  }

  return (
    <>
      <button type="button" className={buttonClass} onClick={() => setOpen(true)}>
        Enviar correo
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-navy/55 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="my-4 w-full max-w-lg rounded-[1.75rem] bg-mist p-5 shadow-[0_24px_80px_rgba(0,26,61,0.28)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">
                  Prueba de Resend
                </p>
                <h2
                  id={titleId}
                  className="mt-1 font-display text-2xl font-semibold text-navy"
                >
                  Enviar correo
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Completa destinatario, asunto y mensaje. El remitente es el
                  configurado en Resend.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-semibold text-navy"
              >
                Cerrar
              </button>
            </div>

            <form
              className="mt-5 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void send();
              }}
            >
              <label className="block text-sm font-medium text-ink">
                Destinatario
                <input
                  required
                  type="email"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  className={fieldClass}
                  placeholder="correo@dominio.com"
                  autoComplete="email"
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Asunto
                <input
                  required
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className={fieldClass}
                  maxLength={180}
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Mensaje
                <textarea
                  required
                  rows={8}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className={fieldClass}
                  maxLength={5000}
                />
              </label>

              {feedback ? (
                <p
                  className={`text-sm ${status === "sent" ? "text-lime-deep" : "text-red-600"}`}
                  role="status"
                >
                  {feedback}
                </p>
              ) : null}

              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-navy/15 bg-white px-5 py-2.5 text-sm font-semibold text-navy"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="rounded-full bg-ail-green px-5 py-2.5 text-sm font-semibold text-ail-navy disabled:opacity-70"
                >
                  {status === "sending" ? "Enviando..." : "Enviar con Resend"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
