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
 * Variantes: horizontal (navbar), vertical (hero/footer), isotype (mobile/favicon).
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

  if (forceTheme === "light") {
    return (
      <Image
        src={light}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ width: "auto", height: "auto" }}
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
        className={className}
        style={{ width: "auto", height: "auto" }}
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
        className={`${className} dark:hidden`}
        style={{ width: "auto", height: "auto" }}
        priority={priority}
      />
      <Image
        src={dark}
        alt={alt}
        width={width}
        height={height}
        className={`${className} hidden dark:block`}
        style={{ width: "auto", height: "auto" }}
        priority={priority}
      />
    </span>
  );
}
