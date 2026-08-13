"use client";

import { useEffect, useId, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function DetailSheet({ open, onClose, title, children, wide = true }: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeButton = dialogRef.current?.querySelector<HTMLElement>("[data-sheet-close]");
    closeButton?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="animate-sheet-fade fixed inset-0 z-[70] flex items-end justify-center bg-ail-navy/60 p-0 sm:items-center sm:p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`animate-sheet-rise flex max-h-[95dvh] w-full flex-col overflow-hidden rounded-t-[1.5rem] bg-white shadow-[0_28px_90px_rgba(0,26,61,0.4)] sm:max-h-[90vh] sm:rounded-[1.75rem] ${
          wide ? "sm:max-w-[1100px]" : "sm:max-w-[900px]"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-navy/8 bg-white px-4 py-3 sm:px-6">
          <h2 id={titleId} className="font-display text-lg font-semibold text-navy sm:text-xl">
            {title}
          </h2>
          <button
            type="button"
            data-sheet-close
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-navy/15 px-3 text-sm font-semibold text-navy"
          >
            ✕ Cerrar
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">{children}</div>
      </div>
    </div>
  );
}
