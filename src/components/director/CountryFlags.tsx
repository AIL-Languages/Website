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
        <g transform="scale(0.00375 0.0075)">
          <path fill="#d52b1e" d="M0 0h9600v4800H0z" />
          <path
            fill="#fff"
            fillRule="evenodd"
            d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"
          />
        </g>
      </g>
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
