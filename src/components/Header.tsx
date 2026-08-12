"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeaderBrandLockup } from "@/components/brand/HeaderBrandLockup";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import type { UserRole } from "@/lib/auth/admin";
import { navItems } from "@/lib/site";

type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
};

const primaryNav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#cursos", label: "Cursos" },
  { href: "#metodologia", label: "Metodología" },
  { href: "#empresas", label: "Empresas" },
] as const;

const moreNav = [
  { href: "#experiencia", label: "Experiencia" },
  { href: "#convenios", label: "Convenios" },
  { href: "#facturacion", label: "Pagos" },
  { href: "#traduccion", label: "Traducción e Interpretación" },
] as const;

const contactNav = { href: "#contacto", label: "Contacto" } as const;

const shellClass =
  "mx-auto flex w-[calc(100%-2rem)] max-w-[1440px] items-center xl:max-w-[1520px] sm:w-[calc(100%-3rem)]";

export function Header() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!moreRef.current?.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = (await response.json()) as { user?: AuthUser };
        return payload.user ?? null;
      })
      .then((value) => {
        if (active) setUser(value);
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-white/10 bg-[rgba(7,27,58,0.96)] shadow-[0_6px_20px_rgba(0,0,0,0.22)] backdrop-blur-md"
          : "border-white/5 bg-[rgba(7,27,58,0.92)] shadow-none backdrop-blur-[12px]"
      }`}
    >
      <div
        className={`${shellClass} justify-between gap-6 transition-[padding] duration-300 sm:gap-8 lg:gap-10 ${
          scrolled ? "py-2 sm:py-2.5" : "py-2.5 sm:py-3"
        }`}
      >
        <HeaderBrandLockup scrolled={scrolled} href="#inicio" />

        <nav
          className="hidden min-w-0 flex-1 items-center justify-start gap-0.5 min-[1440px]:flex"
          aria-label="Principal"
        >
          {primaryNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}

          <div className="relative" ref={moreRef}>
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              onClick={() => setMoreOpen((value) => !value)}
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Más
              <span
                aria-hidden
                className={`text-[10px] transition ${moreOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            {moreOpen ? (
              <div
                role="menu"
                className="absolute left-0 top-full z-50 mt-2 min-w-[14rem] rounded-2xl border border-white/10 bg-[rgba(7,27,58,0.98)] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
              >
                {moreNav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                    onClick={() => setMoreOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <a
            href={contactNav.href}
            className="rounded-full px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            {contactNav.label}
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle className="!h-11 !w-11 border-white/25 bg-transparent text-white hover:border-ail-cyan/60 hover:bg-white/10" />
          {user ? (
            <Link
              href="/dashboard"
              className="hidden rounded-full border border-white/25 px-3.5 py-2 text-sm font-semibold text-white transition hover:border-ail-cyan hover:bg-white/10 min-[1440px]:inline-flex"
            >
              Mi dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/iniciar-sesion"
                className="hidden rounded-full px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white min-[1440px]:inline-flex"
              >
                Iniciar sesión
              </Link>
              <Link
                href="#registro"
                className="hidden rounded-full border border-white/30 px-3.5 py-2 text-sm font-semibold text-white transition hover:border-ail-cyan hover:bg-white/10 min-[1440px]:inline-flex"
              >
                Registrarse
              </Link>
            </>
          )}
          <a
            href="#contacto"
            className="hidden rounded-full bg-ail-green px-4 py-2 text-sm font-semibold text-ail-navy transition hover:bg-ail-cyan min-[1440px]:inline-flex"
          >
            Solicitar información
          </a>
          <button
            type="button"
            aria-label={
              open ? "Cerrar menú de navegación" : "Abrir menú de navegación"
            }
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-transparent text-white transition hover:border-ail-cyan/60 hover:bg-white/10 min-[1440px]:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menú</span>
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-[18px] bg-white transition ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-[18px] bg-white transition ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-[18px] bg-white transition ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[rgba(7,27,58,0.98)] px-4 py-5 backdrop-blur-md min-[1440px]:hidden">
          <nav
            className="mx-auto flex w-[calc(100%-0.5rem)] max-w-[1440px] flex-col gap-1"
            aria-label="Móvil"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-base font-medium text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-xl px-4 py-3 text-base font-medium text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Mi dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/iniciar-sesion"
                  className="rounded-xl px-4 py-3 text-base font-medium text-white hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="rounded-xl px-4 py-3 text-base font-medium text-white hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
            <a
              href="#contacto"
              className="mt-3 rounded-full bg-ail-green px-4 py-3 text-center text-sm font-semibold text-ail-navy"
              onClick={() => setOpen(false)}
            >
              Solicitar información
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
