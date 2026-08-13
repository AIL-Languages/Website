export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "ail-theme";

export const brandAssets = {
  horizontal: {
    light: "/brand/logo-ail-light.png",
    dark: "/brand/logo-ail-dark.png",
  },
  vertical: {
    light: "/brand/logo-ail-vertical-light.png",
    dark: "/brand/logo-ail-vertical-dark.png",
  },
  /** Isotipo AIL + avión (fondo transparente) — header / favicon */
  isotype: {
    light: "/brand/ail-logo-header-transparent-light.png",
    dark: "/brand/ail-logo-header-transparent.png",
  },
} as const;

export type LogoVariant = keyof typeof brandAssets;

/** Theme for which the asset was designed (opposite of page chrome sometimes). */
export function logoSrcFor(variant: LogoVariant, theme: Theme) {
  return brandAssets[variant][theme];
}

export function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    /* ignore */
  }
  return null;
}

export function systemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? "dark";
}
