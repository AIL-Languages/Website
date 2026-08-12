"use client";

import { useId, useState } from "react";
import type { LanguageProfile } from "@/lib/director/data";
import { IconAward } from "@/components/director/icons";

type Props = {
  language: LanguageProfile;
};

export function CertificationAccordion({ language }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (!language.certifications.length) {
    return (
      <p className="mt-4 text-sm leading-relaxed text-muted">{language.summary}</p>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm leading-relaxed text-muted">{language.summary}</p>
      <button
        type="button"
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-semibold text-ail-blue transition hover:text-ail-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <IconAward className="h-4 w-4" />
        {open ? "Ver certificaciones −" : "Ver certificaciones +"}
      </button>
      <div
        id={panelId}
        role="region"
        aria-label={`Certificaciones de ${language.name}`}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="mt-3 space-y-2 border-t border-[color:var(--border)] pt-3">
            {language.certifications.map((item) => (
              <li
                key={item.id}
                className="rounded-xl bg-mist/70 px-3 py-2.5 text-sm text-ink"
              >
                <span className="font-semibold">{item.name}</span>
                {item.cefr ? (
                  <span className="ml-2 text-xs text-muted">· {item.cefr}</span>
                ) : null}
                {item.year ? (
                  <span className="ml-2 text-xs text-muted">· {item.year}</span>
                ) : null}
                {item.score ? (
                  <span className="ml-2 text-xs text-muted">· {item.score}</span>
                ) : null}
                {item.notes ? (
                  <p className="mt-1 text-xs text-muted">{item.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
