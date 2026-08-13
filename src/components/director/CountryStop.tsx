"use client";

import { useId, useState } from "react";
import type { JourneyStop } from "@/lib/director/data";
import { CountryFlag } from "@/components/director/CountryFlags";
import { IconGraduationCap, IconMapPin } from "@/components/director/icons";
import { RotaryBadge } from "@/components/director/RotaryBadge";

type Props = {
  stop: JourneyStop;
  revealed: boolean;
  delayMs: number;
  layout?: "station" | "card";
};

function KindCaption({ stop, compact }: { stop: JourneyStop; compact?: boolean }) {
  if (stop.viaRotary) {
    return (
      <RotaryBadge
        size={compact ? 22 : 24}
        className={compact ? "mt-1.5" : "mt-2"}
      />
    );
  }

  const tone =
    stop.kind === "origin"
      ? "text-ail-green"
      : stop.kind === "academic"
        ? "text-ail-cyan"
        : "text-cyan-soft";

  return (
    <span
      className={`${compact ? "mt-1" : "mt-1.5"} text-[10px] font-semibold uppercase tracking-wide ${tone}`}
    >
      {stop.kindLabel}
    </span>
  );
}

function GlasgowDetail({
  stop,
  defaultOpen,
  align = "center",
}: {
  stop: JourneyStop;
  defaultOpen: boolean;
  align?: "center" | "left";
}) {
  const panelId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const education = stop.education;
  if (!education) return null;

  return (
    <div className={`mt-2 w-full ${align === "center" ? "text-center" : "text-left"}`}>
      <p className="text-xs font-medium text-white/78">{education.institution}</p>
      <button
        type="button"
        className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-ail-cyan bg-ail-cyan/18 px-3 py-2 text-center text-[11px] font-semibold leading-snug text-white transition hover:bg-ail-cyan/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#071b3a]"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Ocultar experiencia en Glasgow" : "Conocer experiencia en Glasgow →"}
      </button>
      {open ? (
        <div
          id={panelId}
          className="mt-2 rounded-xl border border-ail-cyan/35 bg-white/8 px-2.5 py-2 text-left"
        >
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ail-cyan">
            <IconGraduationCap className="h-3.5 w-3.5" />
            {education.institution}
          </p>
          <p className="mt-1 text-[11px] text-white">{education.degree}</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/70">
            {education.years}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function FlagMark({ stop, size }: { stop: JourneyStop; size: string }) {
  return (
    <span className="relative inline-flex">
      <span className="overflow-hidden rounded-full border-2 border-white shadow-[0_6px_16px_rgba(0,0,0,0.28)]">
        <CountryFlag code={stop.code} className={size} />
      </span>
      <span
        className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md"
        style={{
          backgroundColor: stop.pinColor === "#071B3A" ? "#168BFF" : stop.pinColor,
        }}
        aria-hidden
      >
        <IconMapPin className="h-3.5 w-3.5" />
      </span>
    </span>
  );
}

export function CountryStop({
  stop,
  revealed,
  delayMs,
  layout = "station",
}: Props) {
  const label = stop.region ? `${stop.country} · ${stop.region}` : stop.country;
  const hasDetail = Boolean(stop.education);

  if (layout === "card") {
    return (
      <article
        className={`flex h-full flex-col rounded-2xl border px-3.5 py-3.5 transition-[opacity,transform] duration-500 ${
          hasDetail
            ? "border-ail-cyan/45 bg-white/10"
            : "border-white/15 bg-white/5"
        } ${revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
        style={{ transitionDelay: revealed ? `${delayMs}ms` : "0ms" }}
      >
        <div className="flex items-start gap-3">
          <FlagMark stop={stop} size="h-11 w-11" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">{label}</p>
            <KindCaption stop={stop} compact />
          </div>
        </div>
        <p className="mt-2 text-xs leading-snug text-white/75">{stop.description}</p>
        {hasDetail ? <GlasgowDetail stop={stop} defaultOpen={false} align="left" /> : null}
      </article>
    );
  }

  return (
    <article
      className={`flex h-full flex-col items-center rounded-2xl border px-2 py-3 text-center transition-[opacity,transform] duration-500 ease-out ${
        hasDetail
          ? "border-ail-cyan/45 bg-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.25)]"
          : "border-transparent"
      } ${revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      style={{ transitionDelay: revealed ? `${delayMs}ms` : "0ms" }}
    >
      <FlagMark stop={stop} size="h-12 w-12" />
      <p className="mt-3 text-sm font-semibold leading-snug text-white">{label}</p>
      <KindCaption stop={stop} />
      {hasDetail ? <GlasgowDetail stop={stop} defaultOpen={false} /> : null}
    </article>
  );
}
