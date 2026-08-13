"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const baseItems = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/clases", label: "Mis clases" },
  { href: "/dashboard/calendario", label: "Calendario" },
  { href: "/dashboard/smrt-english", label: "Smrt English", smrt: true },
  { href: "/dashboard/pagos", label: "Pagos y facturación" },
  { href: "/dashboard/reportes", label: "Reportes" },
  { href: "/dashboard/perfil", label: "Mi perfil" },
];

const adminItems = [
  { href: "/dashboard/cms", label: "CMS" },
  { href: "/dashboard/correos", label: "Correos" },
];

const coordinationItem = {
  href: "/dashboard/coordinacion",
  label: "Coordinación",
};

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

function isActive(pathname: string, href: string) {
  const path = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === "/dashboard") return path === "/dashboard";
  return path === target || path.startsWith(`${target}/`);
}

type Props = {
  showCms?: boolean;
  showCoordination?: boolean;
};

export function DashboardNav({
  showCms = false,
  showCoordination = false,
}: Props) {
  const pathname = usePathname();
  const items = [
    ...(showCms ? adminItems : []),
    ...(showCoordination ? [coordinationItem] : []),
    ...baseItems,
  ];

  return (
    <nav
      aria-label="Dashboard"
      className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        const isSmrt = "smrt" in item && item.smrt;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
              active
                ? "bg-white text-navy"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            {isSmrt ? (
              <span
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 ${
                  active ? "bg-ail-card-blue" : "bg-[var(--ail-card-blue)]"
                }`}
              >
                <Image
                  src="/images/smrt-english-logo.png"
                  alt=""
                  width={80}
                  height={23}
                  className="h-4 w-auto object-contain"
                />
              </span>
            ) : null}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
