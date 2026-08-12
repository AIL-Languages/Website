"use client";

import { CountryFlag } from "@/components/director/CountryFlags";
import { IconMapPin } from "@/components/director/icons";
import { setContactInterest } from "@/lib/interests";

type FlagCode = "US" | "CA" | "GB" | "BR";

type Exam = {
  name: string;
  interest: string;
  flags: { code: FlagCode; label: string }[];
  flagsLabel: string;
};

const exams: Exam[] = [
  {
    name: "IELTS",
    interest: "ielts",
    flagsLabel: "Referencia internacional: Canadá y Reino Unido",
    flags: [
      { code: "CA", label: "Canadá" },
      { code: "GB", label: "Reino Unido" },
    ],
  },
  {
    name: "TOEFL iBT",
    interest: "toefl-ibt",
    flagsLabel: "Referencia internacional: Estados Unidos",
    flags: [{ code: "US", label: "Estados Unidos" }],
  },
  {
    name: "TOEFL ITP",
    interest: "toefl-itp",
    flagsLabel: "Referencia internacional: Estados Unidos",
    flags: [{ code: "US", label: "Estados Unidos" }],
  },
  {
    name: "CELPE-BRAS",
    interest: "celpe-bras",
    flagsLabel: "Referencia internacional: Brasil",
    flags: [{ code: "BR", label: "Brasil" }],
  },
];

function ExamFlagCluster({
  flags,
  groupLabel,
}: {
  flags: { code: FlagCode; label: string }[];
  groupLabel: string;
}) {
  const stacked = flags.length > 1;

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1.5"
      role="group"
      aria-label={groupLabel}
    >
      <span className="inline-flex text-ail-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.45)] transition duration-300 group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.75)]">
        <IconMapPin className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
      </span>
      <span className={`inline-flex items-center ${stacked ? "" : "gap-1.5"}`}>
        {flags.map((flag, index) => (
          <span
            key={flag.code}
            title={flag.label}
            className={`inline-flex origin-center transition duration-300 ease-out group-hover:scale-[1.07] ${
              stacked && index > 0 ? "-ml-2.5" : ""
            }`}
            style={stacked ? { zIndex: flags.length - index } : undefined}
          >
            <span className="overflow-hidden rounded-full border border-white/70 shadow-[0_4px_10px_rgba(0,0,0,0.28)]">
              <CountryFlag
                code={flag.code}
                title={flag.label}
                className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9"
              />
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}

export function CertificationExamCards() {
  function goToContact(interest: string) {
    setContactInterest(interest);
    const el = document.getElementById("contacto");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = "contacto";
    }
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {exams.map((exam) => (
        <li key={exam.name}>
          <button
            type="button"
            onClick={() => goToContact(exam.interest)}
            className="group flex w-full flex-col items-center rounded-2xl border border-white/15 bg-white/5 px-4 py-5 text-center transition duration-300 ease-out hover:-translate-y-[3px] hover:border-ail-cyan/50 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ail-cyan/60 sm:py-6"
          >
            <ExamFlagCluster flags={exam.flags} groupLabel={exam.flagsLabel} />
            <span className="mt-4 font-display text-lg font-semibold text-cyan-soft sm:text-xl">
              {exam.name}
            </span>
            <span className="mt-2 text-xs leading-snug text-white/65 sm:text-[13px]">
              Preparación para examen internacional
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
