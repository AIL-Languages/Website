import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0a2a56_0%,_#001a3d_55%,_#000f24_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-16 sm:px-6">
        <Link href="/" className="mb-8 flex justify-center">
          <Image
            src="/logo-ail.png"
            alt="A-Inman Languages"
            width={220}
            height={84}
            className="h-16 w-auto"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </Link>

        <div className="rounded-[1.75rem] bg-white p-6 text-ink shadow-[0_24px_70px_rgba(0,15,36,0.35)] sm:p-8">
          <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-white/65">
          <Link href="/" className="hover:text-cyan-soft">
            Volver al sitio
          </Link>
        </p>
      </div>
    </div>
  );
}
