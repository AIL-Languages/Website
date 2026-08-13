"use client";

import { useState } from "react";
import { PartnershipBenefitModal } from "@/components/partnerships/PartnershipBenefitModal";
import { PartnershipCard } from "@/components/partnerships/PartnershipCard";
import { DetailSheet } from "@/components/ui/DetailSheet";
import { useHashOpen } from "@/components/ui/useHashOpen";
import { partnerships, type Partnership } from "@/lib/partnerships";
import { setContactInterest } from "@/lib/interests";

export function PartnershipsSection() {
  const sheet = useHashOpen("#convenios-detalle");
  const [selected, setSelected] = useState<Partnership | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="convenios" className="ail-section ail-section--navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="ail-kicker">Alianzas AIL</p>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Convenios y beneficios
        </h2>
        <p className="ail-lead mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
          Alianzas para acercar la formación en idiomas con condiciones preferenciales.
        </p>
        <p className="mt-4 text-sm font-semibold text-white">
          YMCA · Rotary International · Juntas Podemos Ahorrar
          <span className="ml-2 rounded-full bg-ail-aqua px-2.5 py-1 text-xs font-semibold text-ail-navy-primary">
            Próximamente
          </span>
        </p>
        <button
          type="button"
          onClick={sheet.openSheet}
          className="ail-btn ail-btn--on-dark mt-5"
        >
          Ver convenios →
        </button>
      </div>

      <DetailSheet open={sheet.open} onClose={sheet.closeSheet} title="Convenios y beneficios">
        <p className="text-sm text-muted">
          Estamos reactivando nuestros convenios. Muy pronto podrás consultar aquí los
          beneficios disponibles.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partnerships.map((partnership) => (
            <PartnershipCard
              key={partnership.id}
              partnership={partnership}
              onConsultBenefit={(item) => {
                if (item.status !== "active") return;
                setSelected(item);
                setModalOpen(true);
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setContactInterest("convenios");
            sheet.closeSheet();
            document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ail-green px-5 text-sm font-semibold text-ail-navy"
        >
          Explorar una alianza con AIL
        </button>
      </DetailSheet>

      <PartnershipBenefitModal
        partnership={selected}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
