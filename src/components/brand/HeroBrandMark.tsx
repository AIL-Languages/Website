import { BrandLogo } from "@/components/brand/BrandLogo";
import { site } from "@/lib/site";

type Props = {
  className?: string;
};

/**
 * Marca completa del hero con transparencia real (sin PNG rectangular).
 */
export function HeroBrandMark({ className = "" }: Props) {
  return (
    <div
      className={`relative flex w-full max-w-[300px] flex-col items-center gap-4 lg:max-w-[320px] lg:items-start ${className}`}
    >
      <BrandLogo
        variant="isotype"
        className="h-auto w-[min(100%,220px)] object-contain sm:w-[240px] lg:w-[260px]"
        width={320}
        height={140}
        priority
        alt=""
      />
      <div className="text-center lg:text-left">
        <p className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
          {site.name}
        </p>
        <p className="mt-1.5 text-[11px] font-medium tracking-[0.16em] text-ail-aqua sm:text-xs">
          • {site.tagline} •
        </p>
      </div>
    </div>
  );
}
