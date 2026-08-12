"use client";

import { useEffect, useState } from "react";
import { calendlyEmbedUrl } from "@/lib/scheduling/calendly-url";

type Props = {
  url: string;
  title?: string;
  open: boolean;
  onClose: () => void;
};

export function CalendlyScheduler({
  url,
  title = "Agendar clase",
  open,
  onClose,
}: Props) {
  const [ready, setReady] = useState(false);
  const embed = calendlyEmbedUrl(url);

  useEffect(() => {
    if (!open) return;
    setReady(false);
    const timer = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(timer);
  }, [open, embed]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 p-0 sm:items-center sm:p-6">
      <div className="flex h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.5rem] bg-white sm:h-[85vh] sm:rounded-[1.5rem]">
        <div className="flex items-center justify-between border-b border-navy/10 px-4 py-3">
          <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-muted hover:bg-mist"
          >
            Cerrar
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {ready ? (
            <iframe
              title={title}
              src={embed}
              className="h-full min-h-[640px] w-full border-0"
              loading="lazy"
            />
          ) : (
            <p className="p-6 text-sm text-muted">Cargando agenda…</p>
          )}
        </div>
      </div>
    </div>
  );
}
