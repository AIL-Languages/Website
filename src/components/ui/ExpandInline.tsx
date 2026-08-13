"use client";

import { useId, useState } from "react";

type Props = {
  summary?: string;
  children: React.ReactNode;
};

export function ExpandInline({
  summary = "Conocer más",
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="mt-5 text-sm font-semibold text-ail-cyan transition hover:text-ail-navy"
      >
        {open ? "Mostrar menos ↑" : `${summary} ↓`}
      </button>
      <div
        id={panelId}
        className={`overflow-hidden transition-all duration-200 ${
          open ? "mt-5 max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
