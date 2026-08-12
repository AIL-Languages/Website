import Image from "next/image";
import { brandAssets, type LogoVariant } from "@/lib/theme";

type Props = {
  variant?: LogoVariant;
  /** Fuerza un asset concreto (p. ej. banda navy fija). */
  forceTheme?: "light" | "dark";
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  alt?: string;
};

/**
 * Logo oficial AIL. Cambia por clase `.dark` en <html> (sin filtros CSS).
 * Variantes: horizontal (institucional), vertical (hero/footer), isotype (header).
 */
export function BrandLogo({
  variant = "horizontal",
  forceTheme,
  className = "h-12 w-auto",
  width = 220,
  height = 72,
  priority = false,
  alt = "A-Inman Languages",
}: Props) {
  const light = brandAssets[variant].light;
  const dark = brandAssets[variant].dark;

  const imageClass = `object-contain ${className}`;

  if (forceTheme === "light") {
    return (
      <Image
        src={light}
        alt={alt}
        width={width}
        height={height}
        className={imageClass}
        priority={priority}
      />
    );
  }

  if (forceTheme === "dark") {
    return (
      <Image
        src={dark}
        alt={alt}
        width={width}
        height={height}
        className={imageClass}
        priority={priority}
      />
    );
  }

  return (
    <span className="relative inline-flex items-center">
      <Image
        src={light}
        alt={alt}
        width={width}
        height={height}
        className={`${imageClass} dark:hidden`}
        priority={priority}
      />
      <Image
        src={dark}
        alt={alt}
        width={width}
        height={height}
        className={`${imageClass} hidden dark:block`}
        priority={priority}
      />
    </span>
  );
}
