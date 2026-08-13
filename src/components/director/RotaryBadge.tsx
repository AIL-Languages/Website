import Image from "next/image";

type Props = {
  size?: 22 | 24 | 28;
  showLabel?: boolean;
  label?: string;
  className?: string;
  /** Si el texto vecino ya explica Rotary, el icono se trata como decorativo. */
  decorative?: boolean;
};

export function RotaryBadge({
  size = 24,
  showLabel = true,
  label = "Experiencia Rotary",
  className = "",
  decorative = false,
}: Props) {
  return (
    <span
      className={`inline-flex max-w-full items-center justify-center gap-1.5 ${className}`}
      title="Experiencia internacional a través de Rotary"
    >
      <Image
        src="/images/rotary-international.png"
        alt={decorative ? "" : "Rotary International"}
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
        aria-hidden={decorative ? true : undefined}
        aria-label={
          decorative
            ? undefined
            : "Experiencia internacional realizada a través de Rotary"
        }
      />
      {showLabel ? (
        <span className="text-[10px] font-semibold leading-tight text-white/88 sm:text-[11px]">
          {label}
        </span>
      ) : null}
    </span>
  );
}
