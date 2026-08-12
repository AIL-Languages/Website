"use client";

import { SocialBrandIcon } from "@/components/social/SocialBrandIcons";
import { getActiveSocialLinks, type SocialPlatform } from "@/lib/social";

type Variant = "onDark" | "onLight";
type Layout = "icons" | "labeled";

type Props = {
  variant?: Variant;
  layout?: Layout;
  className?: string;
  align?: "start" | "center";
};

function trackSocialClick(platform: SocialPlatform) {
  if (typeof window === "undefined") return;
  const detail = { event: "social_click", platform };
  window.dispatchEvent(new CustomEvent("ail:analytics", { detail }));
  const w = window as Window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer?.push(detail);
  w.gtag?.("event", "social_click", { platform });
}

export function SocialLinks({
  variant = "onDark",
  layout = "icons",
  className = "",
  align = "start",
}: Props) {
  const links = getActiveSocialLinks();
  const isDark = variant === "onDark";

  return (
    <ul
      className={`flex flex-wrap gap-3 ${
        align === "center" ? "justify-center" : "justify-start"
      } ${className}`}
    >
      {links.map((link) => {
        const href = link.href!;
        return (
          <li key={link.platform}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.name}
              aria-label={`Visitar ${link.name} de A-Inman Languages`}
              onClick={() => trackSocialClick(link.platform)}
              className={`group inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan/60 ${
                layout === "labeled"
                  ? "px-4 py-2.5 sm:min-w-0"
                  : "h-11 w-11 sm:h-12 sm:w-12"
              } ${
                isDark
                  ? `border-ail-cyan/45 bg-white/12 hover:bg-white/18 ${link.brandHover}`
                  : `border-ail-cyan/45 bg-white shadow-sm hover:bg-white dark:border-ail-cyan/45 dark:bg-white/12 dark:shadow-none dark:hover:bg-white/18 ${link.brandHover}`
              }`}
            >
              <SocialBrandIcon
                platform={link.platform}
                className={`h-[22px] w-[22px] sm:h-6 sm:w-6 ${link.brandColor}`}
              />
              {layout === "labeled" ? (
                <span
                  className={`text-sm font-semibold ${
                    isDark
                      ? "text-white"
                      : "text-ink dark:text-white"
                  }`}
                >
                  {link.name}
                </span>
              ) : (
                <span className="sr-only">{link.name}</span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
