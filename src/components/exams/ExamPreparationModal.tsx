"use client";

import { useId } from "react";
import { CountryFlag } from "@/components/director/CountryFlags";
import { DetailSheet } from "@/components/ui/DetailSheet";
import { examPreparations, type ExamId } from "@/lib/exams";
import { setContactInterest } from "@/lib/interests";

type Props = {
  open: boolean;
  onClose: () => void;
  activeExam: ExamId;
  onExamChange: (exam: ExamId) => void;
};

export function ExamPreparationModal({
  open,
  onClose,
  activeExam,
  onExamChange,
}: Props) {
  const tablistId = useId();
  const exam = examPreparations.find((item) => item.id === activeExam) ?? examPreparations[0];

  function goToContact() {
    setContactInterest(exam.interest);
    onClose();
    document.getElementById("contacto")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <DetailSheet open={open} onClose={onClose} title="Preparación internacional">
      <div
        role="tablist"
        aria-label="Exámenes internacionales"
        className="mb-5 flex gap-2 overflow-x-auto pb-1"
      >
        {examPreparations.map((item) => {
          const selected = item.id === exam.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${tablistId}-${item.id}`}
              aria-selected={selected}
              aria-controls={`${tablistId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onExamChange(item.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
                selected ? "bg-navy text-white" : "bg-mist text-navy"
              }`}
            >
              <span className="inline-flex items-center gap-1">
                {item.flags.map((flag) => (
                  <span key={flag.code} className="overflow-hidden rounded-full">
                    <CountryFlag code={flag.code} title={flag.label} className="h-4 w-4" />
                  </span>
                ))}
              </span>
              {item.name}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${tablistId}-panel`} aria-labelledby={`${tablistId}-${exam.id}`}>
        <div className="flex flex-wrap items-center gap-2">
          {exam.flags.map((flag) => (
            <span key={flag.code} className="overflow-hidden rounded-full border border-navy/10">
              <CountryFlag code={flag.code} title={flag.label} className="h-7 w-7" />
            </span>
          ))}
          <h3 className="font-display text-2xl font-semibold text-navy">{exam.name}</h3>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink/80">{exam.description}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-navy/8 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Habilidades trabajadas
            </p>
            <p className="mt-2 text-sm text-ink/80">{exam.skills}</p>
          </article>
          <article className="rounded-2xl border border-navy/8 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Modalidad de preparación
            </p>
            <p className="mt-2 text-sm text-ink/80">{exam.modality}</p>
          </article>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-muted">
          AIL ofrece preparación académica para estos exámenes. La certificación,
          evaluación y emisión de resultados corresponde al organismo evaluador de
          cada examen.
        </p>
        <button
          type="button"
          onClick={goToContact}
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ail-green px-5 text-sm font-semibold text-ail-navy"
        >
          Quiero prepararme →
        </button>
      </div>
    </DetailSheet>
  );
}
