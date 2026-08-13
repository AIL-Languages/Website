"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { setContactInterest } from "@/lib/interests";
import {
  faqCategories,
  getPublicFaqItems,
  matchesFaqQuery,
  sortFaqItems,
  trackFaqEvent,
  type FaqCategoryId,
  type FaqCta,
  type FaqItem,
} from "@/lib/faq";
import { whatsappLink } from "@/lib/site";

const contactHref = whatsappLink();
const FAQ_PREVIEW_COUNT = 3;

function IconSearch({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 16.5 20.5 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-5 w-5 shrink-0 text-ail-cyan transition-transform duration-300 motion-reduce:transition-none ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaqCtaLink({
  cta,
  onNavigate,
}: {
  cta: FaqCta;
  onNavigate?: () => void;
}) {
  if (!cta.href) return null;

  return (
    <a
      href={cta.href}
      className="mt-4 ail-btn"
      target={cta.external ? "_blank" : undefined}
      rel={cta.external ? "noopener noreferrer" : undefined}
      onClick={() => {
        if (cta.contactInterest) setContactInterest(cta.contactInterest);
        onNavigate?.();
      }}
    >
      {cta.label} →
    </a>
  );
}

function FaqAccordionItem({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  const reactId = useId();
  const buttonId = `${reactId}-button`;
  const panelId = `${reactId}-panel`;

  return (
    <article
      className={`theme-card overflow-hidden rounded-2xl border transition hover:border-ail-cyan/45 ${
        open ? "border-ail-cyan/50" : "border-[color:var(--border)]"
      }`}
    >
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full min-h-11 items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-ail-cyan/5 focus-visible:bg-ail-cyan/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ail-cyan/70 sm:px-5"
        >
          <span className="font-display text-base font-semibold leading-snug text-ink sm:text-[1.05rem]">
            {item.question}
          </span>
          <IconChevron open={open} />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden" inert={!open}>
          <div className="border-t border-[color:var(--border)] px-4 pb-5 pt-4 sm:px-5">
            <p className="text-sm leading-relaxed text-muted sm:text-[0.95rem]">
              {item.answer}
            </p>
            {item.cta ? <FaqCtaLink cta={item.cta} /> : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function ContactAilButton({
  source,
  children,
  variant = "secondary",
}: {
  source: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const classes =
    variant === "primary"
      ? "ail-btn ail-btn--on-dark"
      : "ail-btn ail-btn--on-dark";

  return (
    <a
      href={contactHref}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
      onClick={() => trackFaqEvent("faq_contact_clicked", { source })}
    >
      {children}
    </a>
  );
}

export function Faq() {
  const searchId = useId();
  const extraQuestionsId = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FaqCategoryId | "all">("all");
  const [expanded, setExpanded] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const items = useMemo(() => {
    const publicItems = sortFaqItems(getPublicFaqItems());
    return publicItems.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      return matchesCategory && matchesFaqQuery(item, query);
    });
  }, [category, query]);

  const isSearching = query.trim().length > 0;
  const previewItems = items.slice(0, FAQ_PREVIEW_COUNT);
  const restItems = items.slice(FAQ_PREVIEW_COUNT);
  const showToggle = !isSearching && restItems.length > 0;

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const timer = window.setTimeout(() => {
      trackFaqEvent("faq_search", { query: trimmed });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isSearching || expanded) return;
    const visibleIds = new Set(
      items.slice(0, FAQ_PREVIEW_COUNT).map((item) => item.id),
    );
    setOpenId((current) => {
      if (!current || visibleIds.has(current)) return current;
      return null;
    });
  }, [expanded, isSearching, items]);

  function toggleItem(item: FaqItem) {
    setOpenId((current) => {
      if (current === item.id) return null;
      trackFaqEvent("faq_open", { id: item.id, category: item.category });
      return item.id;
    });
  }

  function selectCategory(next: FaqCategoryId | "all") {
    setCategory(next);
    setExpanded(false);
    setOpenId(null);
    trackFaqEvent("faq_category_selected", { category: next });
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setExpanded(false);
    }
  }

  function toggleExpanded() {
    if (expanded) {
      const hiddenIds = new Set(restItems.map((item) => item.id));
      setOpenId((current) =>
        current && hiddenIds.has(current) ? null : current,
      );
      setExpanded(false);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      document.getElementById("faq")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      return;
    }

    setExpanded(true);
  }

  function renderItem(item: FaqItem) {
    return (
      <FaqAccordionItem
        key={item.id}
        item={item}
        open={openId === item.id}
        onToggle={() => toggleItem(item)}
      />
    );
  }

  return (
    <section id="faq" className="scroll-mt-24 ail-section ail-section--navy-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="ail-lead mt-3 text-sm leading-relaxed sm:text-base">
            Todo lo que necesitas saber antes de comenzar en A-Inman Languages.
          </p>
          <p className="ail-lead mt-3 text-sm">
            ¿No encuentras la respuesta que buscas? Nuestro equipo puede ayudarte.
          </p>
          <div className="mt-5 flex justify-center">
            <ContactAilButton source="header">Contactar a AIL</ContactAilButton>
          </div>
        </div>

        <form
          role="search"
          className="relative mx-auto mt-8 max-w-xl"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor={searchId} className="sr-only">
            Buscar una pregunta
          </label>
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Buscar una pregunta…"
            autoComplete="off"
            className="h-11 w-full rounded-full border border-[color:var(--ail-border-light)] bg-white pl-11 pr-4 text-sm text-navy placeholder:text-[color:var(--ail-text-muted-light)] transition focus-visible:border-ail-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan/40"
          />
        </form>

        <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-1 [scrollbar-width:thin] sm:mx-0 sm:px-0">
          <div
            className="flex min-w-max justify-start gap-2 sm:flex-wrap sm:justify-center"
            role="group"
            aria-label="Filtrar preguntas por categoría"
          >
            {faqCategories.map((item) => {
              const selected = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectCategory(item.id)}
                  className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan/70 ${
                    selected
                      ? "bg-ail-navy text-white dark:bg-ail-green dark:text-ail-navy"
                      : "border border-[color:var(--border)] bg-card text-ink hover:border-ail-cyan/50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          {items.length > 0 ? (
            <div>
              {isSearching ? (
                <div className="space-y-3" aria-live="polite">
                  {items.map(renderItem)}
                </div>
              ) : (
                <>
                  <div className="space-y-3" aria-live="polite">
                    {previewItems.map(renderItem)}
                  </div>
                  {restItems.length > 0 ? (
                    <div
                      id={extraQuestionsId}
                      className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                        expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div
                        className="min-h-0 overflow-hidden"
                        inert={!expanded}
                        aria-hidden={!expanded}
                      >
                        <div className="space-y-3 pt-3">
                          {restItems.map(renderItem)}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
              {showToggle ? (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={extraQuestionsId}
                    onClick={toggleExpanded}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-ail-cyan px-5 text-sm font-semibold text-ail-cyan transition hover:border-ail-cyan hover:bg-ail-cyan/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan/70"
                  >
                    {expanded
                      ? "Mostrar menos ↑"
                      : "Ver todas las preguntas ↓"}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="theme-card rounded-[1.5rem] border border-[color:var(--border)] px-6 py-10 text-center">
              <p className="font-display text-lg font-semibold text-ink">
                No encontramos preguntas relacionadas con tu búsqueda.
                Contáctanos y con gusto te ayudamos.
              </p>
              <div className="mt-6 flex justify-center">
                <ContactAilButton source="empty" variant="primary">
                  Contactar a AIL
                </ContactAilButton>
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[1.5rem] bg-ail-navy px-6 py-8 text-white sm:px-10 sm:py-10">
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">
            ¿Aún tienes dudas?
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Estamos para ayudarte a encontrar el programa o servicio que mejor se
            adapte a tus necesidades.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ContactAilButton source="closing" variant="primary">
              Hablar con AIL
            </ContactAilButton>
            <a
              href="#cursos"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/35 px-5 text-sm font-semibold text-white transition hover:border-ail-cyan hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan/70"
            >
              Conocer nuestros cursos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
