"use client";

import { useState } from "react";
import { CountryFlag } from "@/components/director/CountryFlags";
import { ExamPreparationModal } from "@/components/exams/ExamPreparationModal";
import { examPreparations, type ExamId } from "@/lib/exams";

export function ExamPreparationStrip() {
  const [open, setOpen] = useState(false);
  const [activeExam, setActiveExam] = useState<ExamId>("ielts");

  function openExam(id: ExamId = "ielts") {
    setActiveExam(id);
    setOpen(true);
  }

  return (
    <section id="preparacion-certificaciones" className="bg-card py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
          Preparación internacional
        </p>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Preparación para certificaciones internacionales
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Prepárate con AIL para exámenes internacionales mediante acompañamiento
          académico enfocado en las habilidades evaluadas.
        </p>

        <div className="mt-6 rounded-[1.5rem] border border-ail-cyan/25 bg-ail-navy px-5 py-5 text-white sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:gap-3">
              {examPreparations.map((exam) => (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => openExam(exam.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-cyan-soft transition hover:scale-[1.02] hover:bg-ail-cyan/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan/70"
                >
                  <span className="inline-flex items-center gap-1">
                    {exam.flags.map((flag) => (
                      <span key={flag.code} className="overflow-hidden rounded-full border border-white/40">
                        <CountryFlag code={flag.code} title={flag.label} className="h-5 w-5" />
                      </span>
                    ))}
                  </span>
                  {exam.name}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => openExam("ielts")}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-ail-green px-5 text-sm font-semibold text-ail-navy"
            >
              Ver preparación →
            </button>
          </div>
        </div>
      </div>

      <ExamPreparationModal
        open={open}
        onClose={() => setOpen(false)}
        activeExam={activeExam}
        onExamChange={setActiveExam}
      />
    </section>
  );
}
