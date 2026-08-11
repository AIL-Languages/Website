"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled || open
          ? "bg-navy/95 shadow-[0_8px_30px_rgba(0,15,36,0.35)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#inicio" className="relative z-10 flex items-center gap-3">
          <Image
            src="/logo-ail.png"
            alt="A-Inman Languages"
            width={148}
            height={56}
            className="h-12 w-auto"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="hidden rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
            >
              Mi dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/iniciar-sesion"
                className="hidden rounded-full px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 sm:inline-flex"
              >
                Iniciar sesión
              </Link>
              <Link
                href="#registro"
                className="hidden rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 md:inline-flex"
              >
                Registrarse
              </Link>
            </>
          )}
          <a
            href="#contacto"
            className="hidden rounded-full bg-cyan px-4 py-2.5 text-sm font-semibold text-navy-deep transition hover:bg-cyan-bright lg:inline-flex"
          >
            Solicitar información
          </a>
          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white xl:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menú</span>
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-white transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-navy px-4 py-6 xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-base font-medium text-white/90 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-xl px-4 py-3 text-base font-medium text-white/90 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Mi dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/iniciar-sesion"
                  className="rounded-xl px-4 py-3 text-base font-medium text-white/90 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="rounded-xl px-4 py-3 text-base font-medium text-white/90 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
            <a
              href="#contacto"
              className="mt-3 rounded-full bg-cyan px-4 py-3 text-center text-sm font-semibold text-navy-deep"
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
