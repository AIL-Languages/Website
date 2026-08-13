import Image from "next/image";
import Link from "next/link";
import type { UserRole } from "@/lib/auth/admin";
import { site } from "@/lib/site";
import {
  smrtAccessDescription,
  smrtGuideHref,
  smrtHelpWhatsappHref,
} from "@/lib/smrt";

type Props = {
  role: UserRole;
};

export function SmrtHub({ role }: Props) {
  const guideHref = smrtGuideHref(role);

  return (
    <main className="min-w-0 space-y-4 sm:space-y-5">
      <section className="rounded-[1.75rem] bg-navy px-5 py-6 text-white sm:px-8 sm:py-7">
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="order-2 min-w-0 text-center lg:order-1 lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
              Plataforma educativa
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Smrt English
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              Accede a tus materiales, actividades y recursos complementarios
              para continuar practicando inglés fuera de clase.
            </p>
          </div>
          <div className="order-1 shrink-0 rounded-2xl bg-[var(--ail-card-blue)] px-4 py-3 sm:px-5 sm:py-3.5 lg:order-2">
            <Image
              src="/images/smrt-english-logo.png"
              alt="Smrt English, plataforma educativa utilizada por A-Inman Languages"
              width={570}
              height={164}
              className="h-auto w-[132px] object-contain sm:w-[180px]"
              priority
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-5">
        <article className="ail-surface-card">
          <h2 className="ail-module-card-title font-display text-xl font-semibold leading-tight">
            Accede a Smrt English
          </h2>
          <p className="ail-module-card-text text-sm leading-relaxed">
            {smrtAccessDescription(role)}
          </p>
          <a
            href={site.smrtAccessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-cyan px-5 text-sm font-semibold text-navy-deep transition hover:bg-cyan-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 sm:w-auto"
          >
            Abrir Smrt English ↗
          </a>
          <p className="ail-module-card-text text-xs leading-relaxed">
            Necesitarás tus datos de acceso proporcionados por AIL.
          </p>
        </article>

        <article className="ail-surface-card">
          <h2 className="ail-module-card-title font-display text-xl font-semibold leading-tight">
            ¿Necesitas ayuda para ingresar?
          </h2>
          <p className="ail-module-card-text text-sm leading-relaxed">
            Si tienes problemas con tu usuario, contraseña o acceso al contenido,
            comunícate con el equipo de AIL.
          </p>
          <a
            href={smrtHelpWhatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-whatsapp px-5 text-sm font-semibold text-navy-deep transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 sm:w-auto"
          >
            Solicitar ayuda por WhatsApp
          </a>
        </article>
      </section>

      <section className="ail-surface-card">
        <h2 className="ail-module-card-title font-display text-lg font-semibold">
          Cómo utilizar Smrt English
        </h2>
        <ol className="ail-module-card-text space-y-2 text-sm leading-relaxed">
          <li>1. Ingresa con los datos proporcionados por AIL.</li>
          <li>2. Abre el curso o la unidad indicada por tu profesor.</li>
          <li>3. Completa las actividades asignadas antes de tu siguiente clase.</li>
        </ol>
        <Link
          href={guideHref}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-cyan hover:text-cyan-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2"
        >
          Consultar guía de uso →
        </Link>
      </section>
    </main>
  );
}
