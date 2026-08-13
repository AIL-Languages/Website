"use client";

import { useEffect, useState } from "react";
import { ACCESS_DENIED_MESSAGE } from "@/lib/auth/admin";

type Props = {
  show: boolean;
};

export function AccessDeniedNotice({ show }: Props) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (!show || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("aviso")) return;
    url.searchParams.delete("aviso");
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({}, "", next);
  }, [show]);

  if (!visible) return null;

  return (
    <p
      role="alert"
      className="mb-6 rounded-2xl border border-cyan/35 bg-ail-card-blue px-4 py-3 text-sm font-medium text-navy"
    >
      {ACCESS_DENIED_MESSAGE}
    </p>
  );
}
