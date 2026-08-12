import { BrandLogo } from "@/components/brand/BrandLogo";
import { site } from "@/lib/site";

type Props = {
  scrolled?: boolean;
  href?: string;
};

/**
 * Lockup compacto del header: isotipo AIL + divisor + nombre + slogan.
 * No usa el PNG horizontal institucional.
 */
export function HeaderBrandLockup({
  scrolled = false,
  href = "#inicio",
}: Props) {
  return (
    <a
      href={href}
      aria-label={`${site.name} — Ir al inicio`}
      className="group relative z-10 inline-flex min-w-0 max-w-[min(100%,22rem)] shrink items-center gap-2.5 transition duration-200 hover:scale-[1.01] hover:opacity-90 sm:gap-3 sm:max-w-none"
    >
      <BrandLogo
        variant="isotype"
        forceTheme="dark"
        alt={site.name}
        priority
        width={160}
        height={70}
        className={`w-auto shrink-0 object-contain transition-[height] duration-300 ${
          scrolled ? "h-11" : "h-12"
        }`}
      />

      <span
        aria-hidden
        className="hidden h-9 w-px shrink-0 bg-white/30 min-[480px]:block sm:h-10"
      />

      <span className="hidden min-w-0 flex-col justify-center leading-tight min-[480px]:flex">
        <span className="truncate font-display text-[17px] font-medium tracking-tight text-white sm:text-[19px] md:text-[20px]">
          {site.name}
        </span>
        <span className="mt-0.5 hidden text-[10px] font-medium tracking-[0.16em] text-ail-green md:block md:text-[11px]">
          • {site.tagline} •
        </span>
      </span>
    </a>
  );
}
