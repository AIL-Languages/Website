"use client";

import { useId, useState } from "react";
import type { JourneyStop } from "@/lib/director/data";
import { CountryFlag } from "@/components/director/CountryFlags";
import { IconGraduationCap, IconMapPin } from "@/components/director/icons";

type Props = {
  stop: JourneyStop;
  active: boolean;
  revealed: boolean;
  delayMs: number;
  alwaysShowDetail?: boolean;
  layout?: "station" | "timeline";
  onSelect: () => void;
  onToggle: () => void;
};

export function CountryStop({
  stop,
  active,
  revealed,
  delayMs,
  alwaysShowDetail = false,
  layout = "station",
  onSelect,
  onToggle,
}: Props) {
  const panelId = useId();
  const [glasgowOpen, setGlasgowOpen] = useState(Boolean(alwaysShowDetail && stop.education));
  const label = stop.region ? `${stop.country} · ${stop.region}` : stop.country;
  const showDetail = alwaysShowDetail || active;

  if (layout === "timeline") {
    return (
      <div
        className={`flex gap-4 transition-[opacity,transform] duration-500 ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        style={{ transitionDelay: revealed ? `${delayMs}ms` : "0ms" }}
      >
        <div className="relative shrink-0">
          <span className="relative inline-flex overflow-hidden rounded-full border-2 border-white shadow-lg">
            <CountryFlag code={stop.code} className="h-11 w-11" />
          </span>
          <span
            className="absolute -bottom-0.5 -right-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: stop.pinColor === "#071B3A" ? "#168BFF" : stop.pinColor }}
            aria-hidden
          >
            <IconMapPin className="h-3 w-3" />
          </span>
        </div>
        <div className="min-w-0 flex-1 pb-1">
          <p className="text-sm font-semibold text-white">{label}</p>
          {stop.origin ? (
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ail-green">
              Punto de origen
            </p>
          ) : null}
          <p className="mt-1 text-xs leading-snug text-white/70">{stop.description}</p>
          {stop.education ? (
            <div className="mt-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ail-cyan">
                <IconGraduationCap className="h-3.5 w-3.5" />
                {stop.education.institution}
              </p>
              <p className="mt-1 text-[11px] text-white/85">{stop.education.degree}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/55">
                {stop.education.years}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center text-center transition-[opacity,transform] duration-500 ease-out ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{ transitionDelay: revealed ? `${delayMs}ms` : "0ms" }}
    >
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={() => {
          if (
            typeof window !== "undefined" &&
            window.matchMedia("(hover: hover)").matches
          ) {
            onSelect();
          }
        }}
        onFocus={onSelect}
        aria-expanded={active}
        aria-controls={panelId}
        className={`group flex w-full max-w-[9.75rem] flex-col items-center rounded-2xl border px-2.5 py-3 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan ${
          active
            ? "border-ail-cyan/45 bg-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.25)]"
            : "border-transparent hover:-translate-y-0.5 hover:border-ail-cyan/30 hover:bg-white/5"
        }`}
      >
        <span className="relative inline-flex">
          <span
            className={`overflow-hidden rounded-full border-2 border-white shadow-[0_6px_16px_rgba(0,0,0,0.28)] transition duration-300 ${
              active ? "scale-110" : "group-hover:scale-105"
            }`}
          >
            <CountryFlag code={stop.code} className="h-[48px] w-[48px]" />
          </span>
          <span
            className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md"
            style={{
              backgroundColor:
                stop.pinColor === "#071B3A" ? "#168BFF" : stop.pinColor,
            }}
            aria-hidden
          >
            <IconMapPin className="h-3.5 w-3.5" />
          </span>
        </span>

        <span className="mt-3 text-sm font-semibold text-white">{label}</span>
        {stop.origin ? (
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-ail-green">
            Punto de origen
          </span>
        ) : null}
      </button>

      <div
        id={panelId}
        role="region"
        className={`mt-2 w-full max-w-[10.5rem] overflow-hidden transition-[max-height,opacity] duration-300 ${
          showDetail ? "max-h-44 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-xs leading-snug text-white/70">{stop.description}</p>

        {stop.education ? (
          <div className="mt-2">
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold text-ail-cyan"
              aria-expanded={glasgowOpen}
              onClick={(event) => {
                event.stopPropagation();
                setGlasgowOpen((value) => !value);
              }}
            >
              <IconGraduationCap className="h-3.5 w-3.5" />
              {glasgowOpen ? "Ocultar detalle −" : "Ver Glasgow +"}
            </button>
            {glasgowOpen ? (
              <div className="mt-2 rounded-xl border border-ail-cyan/30 bg-white/5 px-2.5 py-2 text-left">
                <p className="text-[11px] font-semibold text-white">
                  {stop.education.degree}
                </p>
                <p className="mt-0.5 text-[11px] text-white/70">
                  {stop.education.institution}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/55">
                  {stop.education.years}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
