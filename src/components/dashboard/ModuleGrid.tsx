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

  if (!modules.length) return null;

  return (
    <div className="ail-module-grid">
      {modules.map((item) => {
        const active = isActivePath(pathname, item.href);
        const titleId = `module-title-${item.id}`;
        return (
          <article
            key={item.id}
            className={`ail-module-card${active ? " is-active" : ""}`}
            aria-labelledby={titleId}
          >
            <span className="ail-module-card-icon" aria-hidden="true">
              <ModuleIcon name={item.icon} />
            </span>
            {item.badge ? (
              <p className="ail-module-card-badge">{item.badge}</p>
            ) : null}
            <h3 id={titleId} className="ail-module-card-title font-display">
              {item.title}
            </h3>
            <p className="ail-module-card-text">{item.text}</p>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              aria-label={`Abrir módulo ${item.title}`}
              className="ail-module-card-btn"
            >
              Abrir módulo
              <span className="ail-module-card-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
