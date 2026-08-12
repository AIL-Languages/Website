"use client";

import { useState } from "react";
import { PartnershipBenefitModal } from "@/components/partnerships/PartnershipBenefitModal";
import { PartnershipCard } from "@/components/partnerships/PartnershipCard";
import {
  PARTNERSHIP_SHOW_ALL_THRESHOLD,
  partnerships,
  type Partnership,
} from "@/lib/partnerships";
import { setContactInterest } from "@/lib/interests";

export function PartnershipsSection() {
  const [selected, setSelected] = useState<Partnership | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visible =
    showAll || partnerships.length <= PARTNERSHIP_SHOW_ALL_THRESHOLD
      ? partnerships
      : partnerships.slice(0, PARTNERSHIP_SHOW_ALL_THRESHOLD);

  function openBenefit(partnership: Partnership) {
    if (partnership.status !== "active") return;
    setSelected(partnership);
    setModalOpen(true);
  }

  function exploreAlliance() {
    setContactInterest("convenios");
    document.getElementById("contacto")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section id="convenios" className="bg-mist/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            Alianzas AIL
          </p>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Convenios y beneficios
          </h2>
          <p className="mt-5 leading-relaxed text-muted">
            En A-Inman Languages construimos alianzas con organizaciones e iniciativas
            que nos permiten acercar la formación en idiomas a más personas mediante
            beneficios y condiciones preferenciales.
          </p>
          <p className="mt-4 rounded-2xl border border-ail-cyan/25 bg-ail-cyan/8 px-4 py-3 text-sm font-medium text-ail-navy/85">
            Estamos reactivando nuestros convenios. Muy pronto podrás consultar aquí
            los beneficios disponibles.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((partnership) => (
            <div
              key={partnership.id}
              className={
                visible.length % 2 === 1 &&
                partnership.id === visible[visible.length - 1]?.id
                  ? "sm:col-span-2 sm:mx-auto sm:max-w-md lg:col-span-1 lg:mx-0 lg:max-w-none"
                  : undefined
              }
            >
              <PartnershipCard
                partnership={partnership}
                onConsultBenefit={openBenefit}
              />
            </div>
          ))}
        </div>

        {partnerships.length > PARTNERSHIP_SHOW_ALL_THRESHOLD && !showAll ? (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-sm font-semibold text-ail-cyan transition hover:text-ail-navy"
            >
              Ver todos los convenios →
            </button>
          </div>
        ) : null}

        <div className="mt-16 overflow-hidden rounded-[2rem] border border-ail-navy/10 bg-ail-navy px-8 py-10 text-white sm:px-12">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_auto] lg:items-center">
            <div>
              <h3 className="font-display text-2xl font-bold sm:text-3xl">
                ¿Tu organización está interesada en colaborar con AIL?
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
                Conoce las posibilidades de colaboración académica y beneficios para
                comunidades, instituciones y organizaciones.
              </p>
            </div>
            <button
              type="button"
              onClick={exploreAlliance}
              className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-ail-green px-6 py-3 text-sm font-semibold text-ail-navy transition hover:bg-ail-cyan"
            >
              Explorar una alianza con AIL
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>

      <PartnershipBenefitModal
        partnership={selected}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
