import type { ElementType, ReactNode } from "react";
import Link from "next/link";

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type AILCardVariant = "light" | "dark" | "interactive" | "compact";

type Props = {
  as?: "article" | "div" | "li" | "section";
  variant?: AILCardVariant;
  align?: "start" | "center";
  stripe?: boolean;
  href?: string;
  className?: string;
  children: ReactNode;
};

export function AILCard({
  as,
  variant = "light",
  align = "start",
  stripe,
  href,
  className = "",
  children,
}: Props) {
  const showStripe = stripe ?? (variant !== "dark");
  const classes = cx(
    "ail-card",
    variant === "dark" && "ail-card--dark",
    variant === "compact" && "ail-card--compact",
    variant === "interactive" && "ail-card--interactive",
    align === "center" && "ail-card--center",
    !showStripe && "ail-card--plain",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cx(classes, "ail-card--interactive")}>
        {children}
      </Link>
    );
  }

  const Tag: ElementType = as ?? "article";
  return <Tag className={classes}>{children}</Tag>;
}

export function AILCardTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cx("ail-card-title font-display", className)}>{children}</h3>
  );
}

export function AILCardText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cx("ail-card-text", className)}>{children}</p>;
}

export function AILIconBubble({
  children,
  onDark = false,
  size = "md",
  className = "",
}: {
  children: ReactNode;
  onDark?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "ail-icon-bubble",
        size === "sm" && "ail-icon-bubble--sm",
        onDark && "ail-icon-bubble--on-dark",
        className,
      )}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
