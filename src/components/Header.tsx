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
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color,border-color] duration-300 ${
        solid
          ? "border-b border-[color:var(--border)] bg-[var(--header-bg)] shadow-[0_8px_30px_rgba(7,27,58,0.12)] backdrop-blur-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#inicio" className="relative z-10 flex items-center gap-3">
          <BrandLogo
            variant="horizontal"
            className="hidden h-11 w-auto sm:block"
            width={200}
            height={64}
            priority
          />
          <BrandLogo
            variant="isotype"
            className="h-10 w-auto sm:hidden"
            width={96}
            height={64}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                solid
                  ? "text-[color:var(--header-muted)] hover:bg-black/5 hover:text-[color:var(--header-fg)] dark:hover:bg-white/10"
                  : "text-ail-navy/85 hover:bg-ail-navy/8 hover:text-ail-navy dark:text-white/85 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {user ? (
            <Link
              href="/dashboard"
              className={`hidden rounded-full border px-4 py-2.5 text-sm font-semibold transition sm:inline-flex ${
                solid
                  ? "border-[color:var(--border)] text-[color:var(--header-fg)] hover:border-ail-cyan"
                  : "border-ail-navy/25 text-ail-navy hover:bg-ail-navy/8 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
              }`}
            >
              Mi dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/iniciar-sesion"
                className={`hidden rounded-full px-3 py-2 text-sm font-semibold transition sm:inline-flex ${
                  solid
                    ? "text-[color:var(--header-fg)] hover:bg-black/5 dark:hover:bg-white/10"
                    : "text-ail-navy/90 hover:bg-ail-navy/8 dark:text-white/90 dark:hover:bg-white/10"
                }`}
              >
                Iniciar sesión
              </Link>
              <Link
                href="#registro"
                className={`hidden rounded-full border px-4 py-2.5 text-sm font-semibold transition md:inline-flex ${
                  solid
                    ? "border-[color:var(--border)] text-[color:var(--header-fg)] hover:border-ail-cyan"
                    : "border-ail-navy/25 text-ail-navy hover:bg-ail-navy/8 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
                }`}
              >
                Registrarse
              </Link>
            </>
          )}
          <a
            href="#contacto"
            className="hidden rounded-full bg-ail-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ail-cyan hover:text-ail-navy lg:inline-flex dark:bg-ail-green dark:text-ail-navy dark:hover:bg-ail-cyan"
          >
            Solicitar información
          </a>
          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border xl:hidden ${
              solid
                ? "border-[color:var(--border)] text-[color:var(--header-fg)]"
                : "border-ail-navy/25 text-ail-navy dark:border-white/25 dark:text-white"
            }`}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menú</span>
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 transition ${
                  solid
                    ? "bg-[color:var(--header-fg)]"
                    : "bg-ail-navy dark:bg-white"
                } ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 transition ${
                  solid
                    ? "bg-[color:var(--header-fg)]"
                    : "bg-ail-navy dark:bg-white"
                } ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 transition ${
                  solid
                    ? "bg-[color:var(--header-fg)]"
                    : "bg-ail-navy dark:bg-white"
                } ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[color:var(--border)] bg-[var(--header-bg)] px-4 py-6 backdrop-blur-md xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-base font-medium text-[color:var(--header-fg)] hover:bg-black/5 dark:hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-xl px-4 py-3 text-base font-medium text-[color:var(--header-fg)] hover:bg-black/5 dark:hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Mi dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/iniciar-sesion"
                  className="rounded-xl px-4 py-3 text-base font-medium text-[color:var(--header-fg)] hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="rounded-xl px-4 py-3 text-base font-medium text-[color:var(--header-fg)] hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
            <a
              href="#contacto"
              className="mt-3 rounded-full bg-ail-blue px-4 py-3 text-center text-sm font-semibold text-white dark:bg-ail-green dark:text-ail-navy"
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
