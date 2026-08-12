import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-[background-color,color] duration-300 dark:bg-ail-navy dark:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#e8f6fc_0%,_#ffffff_55%,_#f5f9fc_100%)] dark:bg-[radial-gradient(ellipse_at_top,_#0c2a52_0%,_#071b3a_55%,_#041026_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-ail-cyan/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href="/" className="flex justify-center">
            <BrandLogo
              variant="horizontal"
              className="h-14 w-auto"
              width={220}
              height={84}
              priority
            />
          </Link>
          <ThemeToggle />
        </div>

        <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-card p-6 text-ink shadow-[0_24px_70px_rgba(7,27,58,0.12)] transition-[background-color,border-color] duration-300 sm:p-8 dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="hover:text-ail-cyan">
            Volver al sitio
          </Link>
        </p>
      </div>
    </div>
  );
}
