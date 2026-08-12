"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import type { UserRole } from "@/lib/auth/admin";
import { navItems } from "@/lib/site";

type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

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
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-[padding] duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "py-2 sm:py-2.5" : "py-2.5 sm:py-3.5"
        }`}
      >
        <Link
          href="#inicio"
          aria-label="Ir al inicio de A-Inman Languages"
          className="group relative z-10 inline-flex shrink-0 items-center transition duration-200 hover:scale-[1.02] hover:drop-shadow-[0_0_12px_rgba(0,224,230,0.35)]"
        >
          <BrandLogo
            variant="isotype"
            forceTheme="dark"
            alt="A-Inman Languages"
            priority
            width={180}
            height={78}
            className={`w-auto object-contain transition-[height] duration-300 ${
              scrolled
                ? "h-9 max-w-[130px] sm:h-11 sm:max-w-[150px]"
                : "h-10 max-w-[140px] sm:h-12 sm:max-w-[160px] lg:h-[52px] lg:max-w-[180px]"
            }`}
          />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Principal">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="!h-11 !w-11 border-white/25 bg-transparent text-white hover:border-ail-cyan/60 hover:bg-white/10" />
          {user ? (
            <Link
              href="/dashboard"
              className="hidden rounded-full border border-white/25 px-3.5 py-2 text-sm font-semibold text-white transition hover:border-ail-cyan hover:bg-white/10 sm:inline-flex"
            >
              Mi dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/iniciar-sesion"
                className="hidden rounded-full px-3 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white sm:inline-flex"
              >
                Iniciar sesión
              </Link>
              <Link
                href="#registro"
                className="hidden rounded-full border border-white/25 px-3.5 py-2 text-sm font-semibold text-white transition hover:border-ail-cyan hover:bg-white/10 md:inline-flex"
              >
                Registrarse
              </Link>
            </>
          )}
          <a
            href="#contacto"
            className="hidden rounded-full bg-ail-green px-4 py-2 text-sm font-semibold text-ail-navy transition hover:bg-ail-cyan lg:inline-flex"
          >
            Solicitar información
          </a>
          <button
            type="button"
            aria-label={
              open ? "Cerrar menú de navegación" : "Abrir menú de navegación"
            }
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-transparent text-white transition hover:border-ail-cyan/60 hover:bg-white/10 xl:hidden"
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
        <div className="border-t border-white/10 bg-[rgba(7,27,58,0.98)] px-4 py-5 backdrop-blur-md xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1" aria-label="Móvil">
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
