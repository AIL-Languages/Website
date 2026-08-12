"use client";

import { useId } from "react";

type Props = { className?: string; title?: string };

/** Banderas SVG compactas (sin dependencia externa). */
export function FlagMX({ className = "h-12 w-12", title = "México" }: Props) {
  return (
    <svg viewBox="0 0 36 36" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <circle cx="18" cy="18" r="18" fill="#006847" />
      <path fill="#fff" d="M12 0h12v36H12z" />
      <path fill="#ce1126" d="M24 0h12v36H24z" />
      <circle cx="18" cy="18" r="3.2" fill="#8b4513" />
    </svg>
  );
}

export function FlagUS({ className = "h-12 w-12", title = "Estados Unidos" }: Props) {
  const clipId = useId();
  return (
    <svg viewBox="0 0 36 36" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <defs>
        <clipPath id={clipId}>
          <circle cx="18" cy="18" r="18" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="36" height="36" fill="#b22234" />
        {[4.5, 9, 13.5, 18, 22.5, 27, 31.5].map((y) => (
          <rect key={y} y={y} width="36" height="2.25" fill="#fff" />
        ))}
        <rect width="16" height="16" fill="#3c3b6e" />
      </g>
    </svg>
  );
}

export function FlagBR({ className = "h-12 w-12", title = "Brasil" }: Props) {
  return (
    <svg viewBox="0 0 36 36" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <circle cx="18" cy="18" r="18" fill="#009c3b" />
      <path fill="#ffdf00" d="M18 6.5 31 18 18 29.5 5 18z" />
      <circle cx="18" cy="18" r="6.2" fill="#002776" />
    </svg>
  );
}

export function FlagGB({ className = "h-12 w-12", title = "Reino Unido" }: Props) {
  const clipId = useId();
  return (
    <svg viewBox="0 0 36 36" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <defs>
        <clipPath id={clipId}>
          <circle cx="18" cy="18" r="18" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="36" height="36" fill="#012169" />
        <path stroke="#fff" strokeWidth="6" d="M0 0l36 36M36 0 0 36" />
        <path stroke="#c8102e" strokeWidth="2.5" d="M0 0l36 36M36 0 0 36" />
        <path stroke="#fff" strokeWidth="8" d="M18 0v36M0 18h36" />
        <path stroke="#c8102e" strokeWidth="5" d="M18 0v36M0 18h36" />
      </g>
    </svg>
  );
}

export function FlagCA({ className = "h-12 w-12", title = "Canadá" }: Props) {
  return (
    <svg viewBox="0 0 36 36" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <circle cx="18" cy="18" r="18" fill="#ff0000" />
      <path fill="#fff" d="M10 0h16v36H10z" />
      <path
        fill="#ff0000"
        d="M18 9.5 20.2 15l5.8.2-4.5 3.6 1.5 5.5L18 21.2l-4.9 3.1 1.5-5.5-4.5-3.6 5.8-.2z"
      />
    </svg>
  );
}

export function FlagIT({ className = "h-12 w-12", title = "Italia" }: Props) {
  return (
    <svg viewBox="0 0 36 36" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <circle cx="18" cy="18" r="18" fill="#009246" />
      <path fill="#fff" d="M12 0h12v36H12z" />
      <path fill="#ce2b37" d="M24 0h12v36H24z" />
    </svg>
  );
}

/** Saltire — bandera de Escocia */
export function FlagScotland({
  className = "h-12 w-12",
  title = "Escocia",
}: Props) {
  const clipId = useId();
  return (
    <svg viewBox="0 0 36 36" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <defs>
        <clipPath id={clipId}>
          <circle cx="18" cy="18" r="18" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="36" height="36" fill="#005eb8" />
        <path
          stroke="#fff"
          strokeWidth="6"
          strokeLinecap="square"
          d="M0 0l36 36M36 0 0 36"
        />
      </g>
    </svg>
  );
}

const flags = {
  MX: FlagMX,
  US: FlagUS,
  BR: FlagBR,
  GB: FlagGB,
  CA: FlagCA,
  IT: FlagIT,
} as const;

export function CountryFlag({
  code,
  className,
  title,
}: {
  code: keyof typeof flags;
  className?: string;
  title?: string;
}) {
  const Flag = flags[code];
  return <Flag className={className} title={title} />;
}
