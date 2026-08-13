"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModuleIcon } from "@/components/dashboard/module-icons";
import type { SystemModule } from "@/lib/auth/modules";

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = {
  modules: SystemModule[];
};

export function ModuleGrid({ modules }: Props) {
  const pathname = usePathname();

  return (
    <div className="ail-module-grid">
      {modules.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`ail-module-card${active ? " is-active" : ""}`}
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--ail-card-border)] bg-[var(--ail-card-icon)] text-cyan">
              <ModuleIcon name={item.icon} />
            </span>
            {item.badge ? (
              <p className="text-[11px] font-semibold uppercase tracking-wide text-lime-deep">
                {item.badge}
              </p>
            ) : null}
            <h3 className="ail-module-card-title font-display text-base font-semibold leading-tight">
              {item.title}
            </h3>
            <p className="ail-module-card-text line-clamp-1 text-sm leading-snug">
              {item.text}
            </p>
            <span className="ail-module-card-link mt-1 inline-flex min-h-11 items-center text-sm font-semibold">
              Abrir módulo →
            </span>
          </Link>
        );
      })}
    </div>
  );
}
