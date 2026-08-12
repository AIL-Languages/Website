"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BillingNotification } from "@/lib/billing/store";

export function BillingNotifications() {
  const [items, setItems] = useState<BillingNotification[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/billing/notifications")
      .then(async (response) => {
        if (!response.ok) return;
        const payload = (await response.json()) as {
          notifications?: BillingNotification[];
        };
        if (active) setItems((payload.notifications ?? []).filter((item) => !item.read).slice(0, 5));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  if (!items.length) return null;

  async function dismiss(id: string) {
    await fetch("/api/billing/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="flex flex-wrap items-start justify-between gap-3 rounded-[1.25rem] border border-cyan/30 bg-white px-5 py-4"
        >
          <div>
            <p className="font-semibold text-navy">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.body}</p>
            {item.href ? (
              <Link href={item.href} className="mt-2 inline-flex text-sm font-semibold text-cyan">
                Abrir →
              </Link>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => void dismiss(item.id)}
            className="text-xs font-semibold text-muted"
          >
            Cerrar
          </button>
        </article>
      ))}
    </div>
  );
}
