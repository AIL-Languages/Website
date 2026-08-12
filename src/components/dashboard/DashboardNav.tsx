"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SmrtLogo } from "@/components/dashboard/SmrtLogo";

const items = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/clases", label: "Mis clases" },
  { href: "/dashboard/calendario", label: "Calendario" },
  { href: "/dashboard/smrt-english", label: "Smrt English", smrt: true },
  { href: "/dashboard/pagos", label: "Pagos y facturación" },
  { href: "/dashboard/reportes", label: "Reportes" },
  { href: "/dashboard/perfil", label: "Mi perfil" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard"
      className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
              active
                ? "bg-white text-navy"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.smrt ? (
              <SmrtLogo className="h-4 w-auto" height={16} />
            ) : null}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
