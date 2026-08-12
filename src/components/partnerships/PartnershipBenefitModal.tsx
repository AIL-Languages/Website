"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import type { Partnership } from "@/lib/partnerships";
import { partnershipTypeLabels } from "@/lib/partnerships";
import { interestOptions } from "@/lib/interests";

type Props = {
  partnership: Partnership | null;
  open: boolean;
  onClose: () => void;
};

export function PartnershipBenefitModal({ partnership, open, onClose }: Props) {
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      return;
    }
    firstFieldRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !partnership) return null;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Estructura lista: cuando el convenio esté activo se conectará a la API.
    setStatus("sent");
  }

  const typeLabel = partnershipTypeLabels[partnership.partnershipType];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ail-navy/55 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.5rem] bg-white p-6 shadow-[0_24px_80px_rgba(0,26,61,0.35)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ail-cyan">
              Consultar beneficio
            </p>
            <h3 id={titleId} className="mt-2 font-display text-2xl font-bold text-ink">
              {partnership.name}
            </h3>
            <p className="mt-1 text-sm text-muted">{typeLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-navy/10 px-3 py-1 text-sm text-muted transition hover:border-ail-cyan hover:text-ink"
            aria-label="Cerrar"
          >
            Cerrar
          </button>
        </div>

        {status === "sent" ? (
          <p className="mt-6 rounded-2xl border border-ail-green/30 bg-ail-green/10 px-4 py-3 text-sm text-ink">
            Recibimos tu solicitud. Te contactaremos para confirmar elegibilidad y
            condiciones del beneficio.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input type="hidden" name="partnershipId" value={partnership.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-ink">
                Nombre
                <input
                  ref={firstFieldRef}
                  required
                  name="firstName"
                  className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Apellidos
                <input
                  required
                  name="lastName"
                  className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-ink">
                Correo
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                WhatsApp
                <input
                  required
                  name="whatsapp"
                  className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
                  placeholder="+52 ..."
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-ink">
              Organización / programa
              <input
                name="organization"
                defaultValue={partnership.name}
                readOnly
                className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/40 px-4 py-3 text-muted outline-none"
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Programa de idiomas de interés
              <select
                required
                name="languageInterest"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                {interestOptions
                  .filter((option) =>
                    ["ingles", "portugues", "espanol", "ielts", "toefl-ibt", "toefl-itp", "celpe-bras"].includes(
                      option.value,
                    ),
                  )
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-ink">
              Dato de elegibilidad (opcional)
              <textarea
                name="eligibility"
                rows={2}
                className="mt-2 w-full rounded-xl border border-navy/10 bg-mist/60 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30"
                placeholder="Solo si aplica (membresía, folio, etc.). No envíes documentos sensibles."
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-ail-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-ail-cyan hover:text-ail-navy"
            >
              Enviar solicitud
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
