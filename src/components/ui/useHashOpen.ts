"use client";

import { useCallback, useEffect, useState } from "react";

export function useHashOpen(hash: string) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [hash]);

  const openSheet = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }
    setOpen(true);
  }, [hash]);

  const closeSheet = useCallback(() => {
    setOpen(false);
    if (typeof window === "undefined") return;
    if (window.location.hash === hash) {
      window.history.pushState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }, [hash]);

  return { open, openSheet, closeSheet };
}
