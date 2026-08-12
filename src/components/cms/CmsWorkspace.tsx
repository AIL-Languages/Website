"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CmsSiteContent } from "@/lib/cms/types";
import { SOLE_ADMIN_EMAIL } from "@/lib/auth/admin";

type Status = {
  hasPassword: boolean;
  unlocked: boolean;
  passwordUpdatedAt: string | null;
};

type Tab = "hero" | "about" | "programs" | "contact" | "security";

const fieldClass =
  "mt-2 w-full rounded-xl border border-navy/10 bg-mist/50 px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/30";

export function CmsWorkspace() {
  const router = useRouter();
  const [status, setStatus] = useState<Status | null>(null);
  const [content, setContent] = useState<CmsSiteContent | null>(null);
  const [tab, setTab] = useState<Tab>("hero");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function loadStatus() {
    const response = await fetch("/api/cms/status");
    const payload = (await response.json()) as Status & {
      ok?: boolean;
      error?: string;
    };
    if (!response.ok) {
      throw new Error(payload.error || "No tienes acceso al CMS.");
    }
    setStatus({
      hasPassword: Boolean(payload.hasPassword),
      unlocked: Boolean(payload.unlocked),
      passwordUpdatedAt: payload.passwordUpdatedAt ?? null,
    });
    return payload;
  }

  async function loadContent() {
    const response = await fetch("/api/cms/content");
    const payload = (await response.json()) as {
      ok?: boolean;
      content?: CmsSiteContent;
      error?: string;
    };
    if (!response.ok || !payload.content) {
      throw new Error(payload.error || "No se pudo cargar el contenido.");
    }
    setContent(payload.content);
  }

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const current = await loadStatus();
        if (current.hasPassword && current.unlocked) {
          await loadContent();
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Error al abrir el CMS.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function onSetupPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/cms/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: form.get("password"),
          currentPassword: form.get("currentPassword") || undefined,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; message?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo guardar la contraseña.");
      }
      setMessage(payload.message || "Contraseña guardada.");
      event.currentTarget.reset();
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setBusy(false);
    }
  }

  async function onUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/cms/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: form.get("password") }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo desbloquear.");
      }
      setMessage("CMS desbloqueado.");
      await loadStatus();
      await loadContent();
      setTab("hero");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al desbloquear.");
    } finally {
      setBusy(false);
    }
  }

  async function onLock() {
    setBusy(true);
    try {
      await fetch("/api/cms/unlock", { method: "DELETE" });
      setContent(null);
      await loadStatus();
      setMessage("CMS bloqueado.");
    } finally {
      setBusy(false);
    }
  }

  async function onSaveContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/cms/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero: content.hero,
          about: content.about,
          programs: content.programs,
          contact: content.contact,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        content?: CmsSiteContent;
      };
      if (!response.ok || !payload.content) {
        throw new Error(payload.error || "No se pudo guardar.");
      }
      setContent(payload.content);
      setMessage("Contenido publicado en la landing.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar contenido.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Cargando gestor de contenido...</p>;
  }

  if (!status) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || "No se pudo abrir el CMS."}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] bg-ail-navy p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ail-green">
          CMS · Gestor de contenido
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          Edita la landing de A-Inman Languages
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-white/75">
          Acceso exclusivo para <strong>{SOLE_ADMIN_EMAIL}</strong>. La contraseña del
          CMS es independiente de tu inicio de sesión y protege la publicación de
          contenidos.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-white/20 px-3 py-1">
            Contraseña CMS: {status.hasPassword ? "configurada" : "pendiente"}
          </span>
          <span className="rounded-full border border-white/20 px-3 py-1">
            Sesión: {status.unlocked ? "desbloqueada" : "bloqueada"}
          </span>
        </div>
      </div>

      {message ? (
        <p className="rounded-2xl border border-ail-green/30 bg-ail-green/10 px-4 py-3 text-sm text-ink">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {!status.hasPassword ? (
        <form
          onSubmit={onSetupPassword}
          className="space-y-4 rounded-[1.5rem] border border-navy/10 bg-white p-6 shadow-sm"
        >
          <h3 className="font-display text-xl font-semibold text-ink">
            Crear contraseña exclusiva del CMS
          </h3>
          <p className="text-sm text-muted">
            Esta contraseña solo la usa la administradora AIL para abrir el gestor de
            contenido. Mínimo 10 caracteres.
          </p>
          <label className="block text-sm font-medium text-ink">
            Nueva contraseña del CMS
            <input
              required
              type="password"
              name="password"
              minLength={10}
              className={fieldClass}
              placeholder="Mínimo 10 caracteres"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-ail-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ail-cyan hover:text-ail-navy disabled:opacity-70"
          >
            {busy ? "Guardando..." : "Crear contraseña"}
          </button>
        </form>
      ) : !status.unlocked ? (
        <form
          onSubmit={onUnlock}
          className="space-y-4 rounded-[1.5rem] border border-navy/10 bg-white p-6 shadow-sm"
        >
          <h3 className="font-display text-xl font-semibold text-ink">
            Desbloquear gestor de contenido
          </h3>
          <p className="text-sm text-muted">
            Ingresa la contraseña exclusiva del CMS para editar la landing.
          </p>
          <label className="block text-sm font-medium text-ink">
            Contraseña del CMS
            <input
              required
              type="password"
              name="password"
              className={fieldClass}
              placeholder="Tu contraseña exclusiva"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-ail-green px-5 py-2.5 text-sm font-semibold text-ail-navy transition hover:bg-ail-cyan disabled:opacity-70"
          >
            {busy ? "Validando..." : "Desbloquear CMS"}
          </button>
        </form>
      ) : content ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                ["hero", "Hero"],
                ["about", "Nosotros"],
                ["programs", "Programas"],
                ["contact", "Contacto"],
                ["security", "Seguridad"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === id
                    ? "bg-ail-navy text-white"
                    : "border border-navy/10 bg-white text-ink hover:border-ail-cyan"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={onLock}
              disabled={busy}
              className="ml-auto rounded-full border border-navy/15 px-4 py-2 text-sm font-semibold text-muted transition hover:border-ail-cyan hover:text-ink"
            >
              Bloquear CMS
            </button>
          </div>

          {tab === "security" ? (
            <form
              onSubmit={onSetupPassword}
              className="space-y-4 rounded-[1.5rem] border border-navy/10 bg-white p-6"
            >
              <h3 className="font-display text-xl font-semibold text-ink">
                Cambiar contraseña exclusiva
              </h3>
              <label className="block text-sm font-medium text-ink">
                Contraseña actual del CMS
                <input
                  required
                  type="password"
                  name="currentPassword"
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Nueva contraseña del CMS
                <input
                  required
                  type="password"
                  name="password"
                  minLength={10}
                  className={fieldClass}
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-ail-blue px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
              >
                Actualizar contraseña
              </button>
            </form>
          ) : (
            <form
              onSubmit={onSaveContent}
              className="space-y-5 rounded-[1.5rem] border border-navy/10 bg-white p-6"
            >
              {tab === "hero" ? (
                <>
                  <label className="block text-sm font-medium text-ink">
                    Titular
                    <input
                      className={fieldClass}
                      value={content.hero.headline}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, headline: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Subtítulo
                    <textarea
                      rows={3}
                      className={fieldClass}
                      value={content.hero.subheadline}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, subheadline: e.target.value },
                        })
                      }
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-ink">
                      CTA principal
                      <input
                        className={fieldClass}
                        value={content.hero.primaryCtaLabel}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              primaryCtaLabel: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                    <label className="block text-sm font-medium text-ink">
                      Enlace CTA principal
                      <input
                        className={fieldClass}
                        value={content.hero.primaryCtaHref}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              primaryCtaHref: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                    <label className="block text-sm font-medium text-ink">
                      CTA secundario
                      <input
                        className={fieldClass}
                        value={content.hero.secondaryCtaLabel}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              secondaryCtaLabel: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                    <label className="block text-sm font-medium text-ink">
                      Enlace CTA secundario
                      <input
                        className={fieldClass}
                        value={content.hero.secondaryCtaHref}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              secondaryCtaHref: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                  </div>
                  <label className="block text-sm font-medium text-ink">
                    Ventajas (una por línea)
                    <textarea
                      rows={4}
                      className={fieldClass}
                      value={content.hero.advantages.join("\n")}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            advantages: e.target.value
                              .split("\n")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          },
                        })
                      }
                    />
                  </label>
                </>
              ) : null}

              {tab === "about" ? (
                <>
                  <label className="block text-sm font-medium text-ink">
                    Eyebrow
                    <input
                      className={fieldClass}
                      value={content.about.eyebrow}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, eyebrow: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Título
                    <input
                      className={fieldClass}
                      value={content.about.title}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, title: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Texto
                    <textarea
                      rows={5}
                      className={fieldClass}
                      value={content.about.body}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, body: e.target.value },
                        })
                      }
                    />
                  </label>
                </>
              ) : null}

              {tab === "programs" ? (
                <>
                  <label className="block text-sm font-medium text-ink">
                    Eyebrow
                    <input
                      className={fieldClass}
                      value={content.programs.eyebrow}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          programs: {
                            ...content.programs,
                            eyebrow: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Título
                    <input
                      className={fieldClass}
                      value={content.programs.title}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          programs: { ...content.programs, title: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Bloque certificaciones · título
                    <input
                      className={fieldClass}
                      value={content.programs.certificationsTitle}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          programs: {
                            ...content.programs,
                            certificationsTitle: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Bloque certificaciones · texto
                    <textarea
                      rows={4}
                      className={fieldClass}
                      value={content.programs.certificationsBody}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          programs: {
                            ...content.programs,
                            certificationsBody: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    CTA certificaciones
                    <input
                      className={fieldClass}
                      value={content.programs.certificationsCta}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          programs: {
                            ...content.programs,
                            certificationsCta: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                </>
              ) : null}

              {tab === "contact" ? (
                <>
                  <label className="block text-sm font-medium text-ink">
                    Título
                    <input
                      className={fieldClass}
                      value={content.contact.title}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, title: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Texto
                    <textarea
                      rows={4}
                      className={fieldClass}
                      value={content.contact.body}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, body: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Viñetas (una por línea)
                    <textarea
                      rows={4}
                      className={fieldClass}
                      value={content.contact.bullets.join("\n")}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: {
                            ...content.contact,
                            bullets: e.target.value
                              .split("\n")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          },
                        })
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Título redes
                    <input
                      className={fieldClass}
                      value={content.contact.socialTitle}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: {
                            ...content.contact,
                            socialTitle: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Texto redes
                    <textarea
                      rows={3}
                      className={fieldClass}
                      value={content.contact.socialBody}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: {
                            ...content.contact,
                            socialBody: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                </>
              ) : null}

              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-ail-green px-6 py-3 text-sm font-semibold text-ail-navy transition hover:bg-ail-cyan disabled:opacity-70"
              >
                {busy ? "Publicando..." : "Publicar cambios en la landing"}
              </button>
              {content.updatedAt ? (
                <p className="text-xs text-muted">
                  Última actualización: {new Date(content.updatedAt).toLocaleString("es-MX")}
                  {content.updatedBy ? ` · ${content.updatedBy}` : ""}
                </p>
              ) : null}
            </form>
          )}
        </>
      ) : null}
    </div>
  );
}
