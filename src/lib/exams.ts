export type ExamId = "ielts" | "toefl-ibt" | "toefl-itp" | "celpe-bras";

export type ExamPrep = {
  id: ExamId;
  name: string;
  interest: ExamId;
  flags: { code: "US" | "CA" | "GB" | "BR"; label: string }[];
  flagsLabel: string;
  description: string;
  skills: string;
  modality: string;
};

export const examPreparations: ExamPrep[] = [
  {
    id: "ielts",
    name: "IELTS",
    interest: "ielts",
    flagsLabel: "Canadá y Reino Unido",
    flags: [
      { code: "CA", label: "Canadá" },
      { code: "GB", label: "Reino Unido" },
    ],
    description:
      "Preparación académica para el examen internacional de inglés utilizado en contextos de estudio, trabajo y migración.",
    skills: "Listening, Speaking, Reading y Writing, con práctica de tareas típicas del examen.",
    modality: "Clases online personalizadas o en grupos reducidos, con seguimiento académico AIL.",
  },
  {
    id: "toefl-ibt",
    name: "TOEFL iBT",
    interest: "toefl-ibt",
    flagsLabel: "Estados Unidos",
    flags: [{ code: "US", label: "Estados Unidos" }],
    description:
      "Preparación para el TOEFL iBT, examen de inglés en formato digital ampliamente requerido en contextos académicos.",
    skills: "Comprensión auditiva, lectura, expresión oral y escritura académica.",
    modality: "Acompañamiento online enfocado en las habilidades evaluadas por el examen.",
  },
  {
    id: "toefl-itp",
    name: "TOEFL ITP",
    interest: "toefl-itp",
    flagsLabel: "Estados Unidos",
    flags: [{ code: "US", label: "Estados Unidos" }],
    description:
      "Preparación para el TOEFL ITP, evaluación institucional de inglés utilizada por universidades y programas académicos.",
    skills: "Listening, Structure y Reading, según el formato del examen.",
    modality: "Clases online con práctica guiada y retroalimentación académica.",
  },
  {
    id: "celpe-bras",
    name: "CELPE-BRAS",
    interest: "celpe-bras",
    flagsLabel: "Brasil",
    flags: [{ code: "BR", label: "Brasil" }],
    description:
      "Preparación para el CELPE-BRAS, examen de proficiencia en portugués para hablantes de otras lenguas.",
    skills: "Comprensión oral y escrita, producción oral y producción escrita.",
    modality: "Preparación online personalizada o en grupos reducidos, con enfoque comunicativo.",
  },
];
