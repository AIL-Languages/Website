import { BrandLogo } from "@/components/brand/BrandLogo";
import { SocialLinks } from "@/components/social/SocialLinks";
import { site, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ail-navy text-white transition-[background-color,color] duration-300">
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-ail-cyan/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-ail-green/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <BrandLogo
            variant="vertical"
            forceTheme="dark"
            className="mb-4 h-auto w-[min(70vw,220px)]"
            width={240}
            height={220}
          />
          <p className="max-w-sm text-sm leading-relaxed text-white/75">
            {site.name}
            <br />
            <span className="text-ail-green">{site.tagline}</span>
          </p>
          <SocialLinks variant="onDark" layout="icons" className="mt-6" />
        </div>

        <div className="space-y-3 text-sm text-white/80">
          <p className="font-display text-base font-semibold text-white">Contacto</p>
          <a className="block hover:text-ail-cyan" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a
            className="block hover:text-ail-cyan"
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.phoneDisplay}
          </a>
          <p>{site.location}</p>
          <p>Clases 100 % online</p>
        </div>

        <div className="space-y-3 text-sm text-white/80">
          <p className="font-display text-base font-semibold text-white">Explorar</p>
          <a className="block hover:text-ail-cyan" href="#cursos">
            Cursos e idiomas
          </a>
          <a className="block hover:text-ail-cyan" href="#empresas">
            Programas corporativos
          </a>
          <a className="block hover:text-ail-cyan" href="#convenios">
            Convenios y beneficios
          </a>
          <a className="block hover:text-ail-cyan" href="#traduccion">
            Traducción e interpretación
          </a>
          <a className="block hover:text-ail-cyan" href="#contacto">
            Solicitar información
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
