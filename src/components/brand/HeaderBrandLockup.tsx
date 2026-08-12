import { BrandLogo } from "@/components/brand/BrandLogo";
import { site } from "@/lib/site";

type Props = {
  scrolled?: boolean;
  href?: string;
};

/**
 * Branding del header: isotipo + nombre (sin slogan).
 * Evita el PNG horizontal con fondo rectangular.
 */
export function HeaderBrandLockup({
  scrolled = false,
  href = "#inicio",
}: Props) {
  return (
    <a
      href={href}
      aria-label={`${site.name} — Ir al inicio`}
      className="group relative z-10 inline-flex min-w-0 shrink-0 items-center gap-2.5 transition duration-200 hover:scale-[1.01] hover:opacity-90 sm:gap-3"
    >
      <BrandLogo
        variant="isotype"
        forceTheme="dark"
        alt=""
        priority
        width={140}
        height={60}
        className={`w-auto shrink-0 object-contain transition-[height] duration-300 ${
          scrolled ? "h-10" : "h-11"
        }`}
      />
      <span className="hidden min-w-0 flex-col justify-center leading-none min-[420px]:flex">
        <span className="truncate font-display text-[16px] font-medium tracking-tight text-white sm:text-[18px]">
          {site.name}
        </span>
      </span>
    </a>
  );
}
