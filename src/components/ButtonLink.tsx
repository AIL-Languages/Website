import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "lime";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-ail-blue text-white hover:bg-ail-cyan hover:text-ail-navy shadow-[0_10px_30px_rgba(22,139,255,0.28)] dark:bg-ail-green dark:text-ail-navy dark:hover:bg-ail-cyan",
  secondary:
    "bg-ail-navy/5 text-ail-navy border border-ail-navy/15 hover:border-ail-cyan hover:bg-ail-navy/8 dark:bg-white/10 dark:text-white dark:border-white/35 dark:hover:bg-white/18",
  ghost:
    "bg-transparent text-ink border border-[color:var(--border)] hover:border-ail-cyan",
  lime: "bg-ail-green text-ail-navy hover:bg-ail-cyan",
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
