type Props = {
  className?: string;
  height?: number;
};

export function SmrtLogo({ className = "h-8 w-auto", height = 32 }: Props) {
  return (
    // Official Smrt wordmark is white; keep it on a dark chip so it stays visible.
    <span className="inline-flex items-center rounded-lg bg-[#0b3a6e] px-2 py-1">
      <img
        src="/logo-smrt.svg"
        alt="Smrt English"
        height={height}
        className={className}
      />
    </span>
  );
}

export function SmrtLogoOnDark({ className = "h-10 w-auto", height = 40 }: Props) {
  return (
    <img
      src="/logo-smrt.svg"
      alt="Smrt English"
      height={height}
      className={className}
    />
  );
}
