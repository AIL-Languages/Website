import { BrandLogo } from "@/components/brand/BrandLogo";
import { SocialLinks } from "@/components/social/SocialLinks";
import { site, whatsappLink } from "@/lib/site";

const footerLinkClass =
  "block rounded-sm py-1.5 transition hover:text-ail-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan/60";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ail-navy text-white transition-[background-color,color] duration-300">
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-ail-cyan/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-ail-green/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-start gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:gap-x-10">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <BrandLogo
              variant="vertical"
              forceTheme="dark"
              className="mb-3 h-auto w-[min(42vw,132px)]"
              width={240}
              height={220}
            />
            <p className="text-sm leading-relaxed text-white/75">
              {site.name}
              <br />
              <span className="text-ail-green">{site.tagline}</span>
            </p>
          </div>

          <div className="flex flex-col gap-1 text-left text-sm text-white/80">
            <p className="font-display text-base font-semibold text-white">
              Contacto
            </p>
            <a className={footerLinkClass} href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <a className={footerLinkClass} href={`tel:+${site.phoneE164}`}>
              {site.phoneDisplay}
            </a>
            <p className="py-1.5">{site.location}</p>
            <p className="py-1.5">Clases 100 % online</p>
          </div>

          <nav
            aria-label="Explorar"
            className="flex flex-col gap-1 text-left text-sm text-white/80"
          >
            <p className="font-display text-base font-semibold text-white">
              Explorar
            </p>
            <a className={footerLinkClass} href="#cursos">
              Cursos e idiomas
            </a>
            <a className={footerLinkClass} href="#empresas">
              Programas corporativos
            </a>
            <a className={footerLinkClass} href="#convenios">
              Convenios y beneficios
            </a>
            <a className={footerLinkClass} href="#traduccion">
              Traducción e interpretación
            </a>
            <a className={footerLinkClass} href="#faq">
              Preguntas frecuentes
            </a>
            <a className={footerLinkClass} href="#contacto">
              Solicitar información
            </a>
          </nav>

          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <p className="font-display text-base font-semibold text-white">
              Síguenos
            </p>
            <SocialLinks
              variant="onDark"
              layout="icons"
              compact
              align="center"
              className="mt-3 md:justify-start"
            />
            <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-white/75">
              Conoce nuestras novedades, cursos y recursos.
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp a A-Inman Languages"
              className="mt-4 inline-flex w-fit items-center justify-center gap-1.5 rounded-full bg-ail-green px-3.5 py-2 text-sm font-semibold text-ail-navy transition hover:bg-ail-cyan hover:shadow-[0_6px_16px_rgba(0,240,163,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan/60"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} {site.name}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.14.82.84-3.06-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.23 8.24m4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29" />
    </svg>
  );
}
