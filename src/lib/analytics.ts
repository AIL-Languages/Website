/** Eventos de analítica sin PII (nombre, correo, teléfono). */
export function trackEvent(
  event: string,
  extra: Record<string, string | number | boolean | undefined> = {},
) {
  if (typeof window === "undefined") return;

  const safe = Object.fromEntries(
    Object.entries(extra).filter(([, value]) => value !== undefined),
  );
  const detail = { event, ...safe };

  window.dispatchEvent(new CustomEvent("ail:analytics", { detail }));

  const w = window as Window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  };

  w.dataLayer?.push(detail);
  w.gtag?.("event", event, safe);
}
