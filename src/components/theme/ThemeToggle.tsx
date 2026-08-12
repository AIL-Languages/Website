"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

type Props = {
  className?: string;
};

export function ThemeToggle({ className = "" }: Props) {
  const { theme, toggleTheme, ready } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
      }
      aria-pressed={isDark}
      title={isDark ? "Modo oscuro activo" : "Modo claro activo"}
      className={`group relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition-[background-color,border-color,color,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ail-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
        isDark
          ? "border-white/25 bg-white/10 text-white hover:border-[var(--ail-cyan)]/60 hover:bg-white/15"
          : "border-[color:var(--border)] bg-[var(--card)] text-[var(--ail-navy)] hover:border-[var(--ail-cyan)] hover:text-[var(--ail-blue)]"
      } ${className}`}
    >
      <span className="sr-only">
        {ready ? (isDark ? "Modo oscuro" : "Modo claro") : "Tema"}
      </span>
      {/* Sol — visible en modo oscuro (acción: pasar a claro) */}
      <svg
        viewBox="0 0 24 24"
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-50 -rotate-90 opacity-0"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path
          strokeLinecap="round"
          d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        />
      </svg>
      {/* Luna — visible en modo claro (acción: pasar a oscuro) */}
      <svg
        viewBox="0 0 24 24"
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark
            ? "scale-50 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        }`}
        fill="currentColor"
        aria-hidden
      >
        <path d="M21 14.3A8.5 8.5 0 0 1 9.7 3a7 7 0 1 0 11.3 11.3z" />
      </svg>
    </button>
  );
}
