"use client";

import Image from "next/image";
import { IconHandshake } from "@/components/director/icons";
import { PartnershipStatus } from "@/components/partnerships/PartnershipStatus";
import type { Partnership } from "@/lib/partnerships";
import { partnershipTypeLabels } from "@/lib/partnerships";
import { setContactInterest } from "@/lib/interests";

type Props = {
  partnership: Partnership;
  onConsultBenefit: (partnership: Partnership) => void;
};

export function PartnershipCard({ partnership, onConsultBenefit }: Props) {
  const typeLabel = partnershipTypeLabels[partnership.partnershipType];
  const isActive = partnership.status === "active";
  const isComingSoon = partnership.status === "comingSoon";

  function goToContact() {
    setContactInterest(partnership.contactInterestValue);
    document.getElementById("contacto")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <article className="group flex h-full flex-col rounded-[1.5rem] border border-navy/10 bg-white p-7 shadow-[0_12px_40px_rgba(0,26,61,0.06)] transition duration-300 hover:-translate-y-[3px] hover:border-ail-cyan/45 hover:shadow-[0_18px_48px_rgba(0,26,61,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-ail-navy/10 bg-gradient-to-br from-ail-navy/[0.04] to-ail-cyan/[0.08]">
          {partnership.logo ? (
            <Image
              src={partnership.logo}
              alt={`Identidad visual de ${partnership.name}`}
              width={64}
              height={64}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-ail-navy/80">
              <IconHandshake className="h-5 w-5 text-ail-cyan" />
              <span className="font-display text-[11px] font-bold tracking-wide">
                {partnership.monogram}
              </span>
            </div>
          )}
        </div>
        <PartnershipStatus status={partnership.status} />
      </div>

      <h3 className="mt-5 font-display text-xl font-semibold text-ink">
        {partnership.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-ail-cyan">{typeLabel}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
        {partnership.description}
      </p>

      <div className="mt-6 space-y-3">
        {isActive ? (
          <button
            type="button"
            onClick={() => onConsultBenefit(partnership)}
            className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-ail-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ail-cyan hover:text-ail-navy"
          >
            Consultar mi beneficio
            <span aria-hidden>→</span>
          </button>
        ) : (
          <span className="inline-flex w-full items-center justify-center rounded-full border border-navy/10 bg-mist/70 px-4 py-2.5 text-sm font-semibold text-muted">
            Beneficio próximamente
          </span>
        )}

        {isComingSoon ? (
          <button
            type="button"
            onClick={goToContact}
            className="text-center text-xs text-muted transition hover:text-ail-cyan"
          >
            ¿Tienes dudas sobre un convenio? Contactar AIL →
          </button>
        ) : null}
      </div>
    </article>
  );
}
