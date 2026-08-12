"use client";

import { useEffect, useId } from "react";
import { TeacherApplicationPanel } from "@/components/recruitment/TeacherApplicationPanel";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function TeacherApplicationModal({ open, onClose }: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ail-navy/60 p-3 sm:items-center sm:p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[1.75rem] bg-white p-5 shadow-[0_28px_90px_rgba(0,26,61,0.4)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <p id={titleId} className="sr-only">
            Postulación docente A-Inman Languages
          </p>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-full border border-navy/10 px-3 py-1.5 text-sm text-muted transition hover:border-ail-cyan hover:text-ink"
            aria-label="Cerrar"
          >
            Cerrar
          </button>
        </div>
        <TeacherApplicationPanel compact />
      </div>
    </div>
  );
}
