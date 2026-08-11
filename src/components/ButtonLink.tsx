import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "lime";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-cyan text-navy-deep hover:bg-cyan-bright shadow-[0_10px_30px_rgba(0,184,230,0.28)]",
  secondary:
    "bg-white/10 text-white border border-white/35 hover:bg-white/18 backdrop-blur-sm",
  ghost:
    "bg-transparent text-navy border border-navy/15 hover:border-cyan hover:text-navy-mid",
  lime: "bg-lime text-navy-deep hover:bg-lime-deep",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: Props) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition duration-300 ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
