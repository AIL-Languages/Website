"use client";

import { FormEvent, useState } from "react";
import { whatsappLink } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          interest: data.get("interest"),
          goals: data.get("goals"),
          availability: data.get("availability"),
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo enviar la solicitud.");
      }

      setStatus("success");
      setMessage("Gracias. Recibimos tu solicitud y te contactaremos pronto.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Ocurrió un error. Intenta de nuevo o escríbenos por WhatsApp.",
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-[1.75rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,26,61,0.12)] sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Nombre
          <input
            required
            name="name"
            className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
            placeholder="Tu nombre"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Correo
          <input
            required
            type="email"
            name="email"
            className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
            placeholder="correo@ejemplo.com"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Teléfono / WhatsApp
          <input
            name="phone"
            className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
            placeholder="+52 ..."
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Interés
          <select
            required
            name="interest"
            defaultValue=""
            className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            <option value="ingles">Inglés</option>
            <option value="portugues">Portugués</option>
            <option value="espanol">Español para extranjeros</option>
            <option value="certificaciones">Preparación para certificaciones</option>
            <option value="empresas">Programas corporativos</option>
            <option value="traduccion">Traducción / Interpretación</option>
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-ink">
        Objetivos
        <textarea
          required
          name="goals"
          rows={3}
          className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          placeholder="Académicos, profesionales, viaje, certificación..."
        />
      </label>

      <label className="block text-sm font-medium text-ink">
        Disponibilidad
        <input
          name="availability"
          className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
          placeholder="Días y horarios preferidos"
        />
      </label>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-navy-deep transition hover:bg-cyan-bright disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Enviando..." : "Quiero información"}
        </button>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-full border border-navy/15 bg-white px-6 py-3 text-sm font-semibold text-navy transition hover:border-lime hover:text-navy-mid"
        >
          Enviar WhatsApp
        </a>
      </div>

      {message ? (
        <p
          className={`text-sm ${status === "success" ? "text-lime-deep" : "text-red-600"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
