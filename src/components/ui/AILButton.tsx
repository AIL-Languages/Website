import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type AILButtonVariant = "primary" | "secondary" | "on-dark" | "ghost";

type Common = {
  children: ReactNode;
  variant?: AILButtonVariant;
  arrow?: boolean;
  className?: string;
  block?: boolean;
};

type LinkProps = Common & {
  href: string;
  external?: boolean;
  type?: never;
  disabled?: never;
  onClick?: () => void;
};

type BtnProps = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
    external?: never;
  };

type Props = LinkProps | BtnProps;

export function AILButton(props: Props) {
  const {
    children,
    variant = "primary",
    arrow = false,
    className = "",
    block = false,
  } = props;
  const classes = cx(
    "ail-btn",
    variant !== "primary" && `ail-btn--${variant}`,
    block && "ail-btn--block",
    className,
  );
  const content = (
    <>
      {children}
      {arrow ? (
        <span className="ail-btn-arrow" aria-hidden="true">
          →
        </span>
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    if (props.external) {
      return (
        <a
          href={props.href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          onClick={props.onClick}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes} onClick={props.onClick}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as BtnProps;
  return (
    <button
      type={buttonProps.type ?? "button"}
      className={classes}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
    >
      {content}
    </button>
  );
}
