export type FaqAnalyticsEvent =
  | "faq_open"
  | "faq_search"
  | "faq_category_selected"
  | "faq_contact_clicked";

type FaqAnalyticsPayload = {
  event: FaqAnalyticsEvent;
  id?: string;
  category?: string;
  query?: string;
  source?: string;
};

export function trackFaqEvent(
  event: FaqAnalyticsEvent,
  extra: Omit<FaqAnalyticsPayload, "event"> = {},
) {
  if (typeof window === "undefined") return;

  const detail: FaqAnalyticsPayload = { event, ...extra };
  window.dispatchEvent(new CustomEvent("ail:analytics", { detail }));

  const w = window as Window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  };

  w.dataLayer?.push(detail);
  w.gtag?.("event", event, extra);
}
