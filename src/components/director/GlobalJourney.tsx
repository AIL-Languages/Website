"use client";

import { useEffect, useRef, useState } from "react";
import { journeyStops } from "@/lib/director/data";
import { CountryStop } from "@/components/director/CountryStop";
import { IconPlane } from "@/components/director/icons";
import { RotaryBadge } from "@/components/director/RotaryBadge";

export function GlobalJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [planeOn, setPlaneOn] = useState(false);
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMotionOk(!reduced);
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        if (!reduced) {
          setPlaneOn(true);
          window.setTimeout(() => setPlaneOn(false), 2100);
        }
        observer.disconnect();
      },
      { threshold: 0.22 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="overflow-x-hidden rounded-[1.75rem] border border-white/10 bg-ail-navy p-5 text-white sm:p-8"
    >
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ail-cyan">
          AIL GLOBAL JOURNEY
        </p>
        <p className="mt-1 text-sm font-semibold text-ail-green">
          Linking Worldwide · trayectoria internacional
        </p>
        <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
          Trayectoria internacional AIL
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/82">
          Experiencias académicas, profesionales, culturales y lingüísticas que
          han contribuido a construir la visión internacional de A-Inman
          Languages.
        </p>
      </div>

      <div className="relative hidden lg:block">
        <div className="relative px-1 pb-2 pt-10">
          <svg
            viewBox="0 0 1000 100"
            className="pointer-events-none absolute inset-x-0 top-2 h-[100px] w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="ail-route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#168BFF" />
                <stop offset="50%" stopColor="#00E0E6" />
                <stop offset="100%" stopColor="#00F0A3" />
              </linearGradient>
            </defs>
            <path
              id="ail-route-path"
              d="M55 58 C 170 22, 290 82, 415 42 S 650 18, 770 58 S 900 78, 945 40"
              fill="none"
              stroke="url(#ail-route-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={revealed ? 0 : 1}
              style={{
                transition: motionOk
                  ? "stroke-dashoffset 1.15s ease-out"
                  : "none",
              }}
            />
            {planeOn && motionOk ? (
              <path
                d="M0 4 L16 0 L20 4 L16 8 Z M5 4 L-1 -2 L1 2 L-6 4 L1 6 L-1 10 Z"
                fill="#00F0A3"
              >
                <animateMotion dur="2s" fill="freeze" rotate="auto">
                  <mpath href="#ail-route-path" />
                </animateMotion>
              </path>
            ) : null}
          </svg>

          <ol className="relative z-10 grid grid-cols-6 gap-2">
            {journeyStops.map((stop, index) => (
              <li
                key={stop.id}
                className={index % 2 === 1 ? "translate-y-5" : "translate-y-0"}
              >
                <CountryStop
                  stop={stop}
                  revealed={revealed}
                  delayMs={index * 100}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
        {journeyStops.map((stop, index) => (
          <li key={stop.id}>
            <CountryStop
              stop={stop}
              layout="card"
              revealed={revealed}
              delayMs={index * 90}
            />
          </li>
        ))}
      </ol>

      <p className="mt-6 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-white/82 sm:items-center">
        <RotaryBadge size={22} showLabel={false} decorative className="mt-0.5 shrink-0 sm:mt-0" />
        <span>
          Brasil, Canadá e Italia: experiencias internacionales realizadas a
          través de Rotary International.
        </span>
      </p>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/75">
        <IconPlane className="h-3.5 w-3.5 text-ail-green" />
        México → mundo · idiomas · experiencia internacional
      </p>
    </div>
  );
}
