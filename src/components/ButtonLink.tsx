import { AILButton, type AILButtonVariant } from "@/components/ui/AILButton";

type ButtonVariant = AILButtonVariant | "lime" | "ghost";

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
  const mapped: AILButtonVariant =
    variant === "lime" || variant === "ghost" ? "on-dark" : variant;

  return (
    <AILButton
      href={href}
      variant={mapped}
      className={className}
      external={external}
    >
      {children}
    </AILButton>
  );
}
