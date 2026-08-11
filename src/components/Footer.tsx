import Image from "next/image";
import { site, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-cyan/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-lime/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <Image
            src="/logo-ail.png"
            alt={site.name}
            width={180}
            height={70}
            className="mb-4 h-14 w-auto"
            style={{ width: "auto", height: "auto" }}
          />
          <p className="max-w-sm text-sm leading-relaxed text-white/75">
            {site.name}
            <br />
            <span className="text-lime">{site.tagline}</span>
          </p>
        </div>

        <div className="space-y-3 text-sm text-white/80">
          <p className="font-display text-base font-semibold text-white">Contacto</p>
          <a className="block hover:text-cyan-soft" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a className="block hover:text-cyan-soft" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            {site.phoneDisplay}
          </a>
          <p>{site.location}</p>
          <p>Clases 100 % online</p>
        </div>

        <div className="space-y-3 text-sm text-white/80">
          <p className="font-display text-base font-semibold text-white">Explorar</p>
          <a className="block hover:text-cyan-soft" href="#cursos">
            Cursos e idiomas
          </a>
          <a className="block hover:text-cyan-soft" href="#empresas">
            Programas corporativos
          </a>
          <a className="block hover:text-cyan-soft" href="#traduccion">
            Traducción e interpretación
          </a>
          <a className="block hover:text-cyan-soft" href="#contacto">
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
