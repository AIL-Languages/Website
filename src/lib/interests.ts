export const interestOptions = [
  { value: "", label: "Selecciona (opcional)" },
  { value: "ingles", label: "Inglés" },
  { value: "portugues", label: "Portugués" },
  { value: "espanol", label: "Español para extranjeros" },
  { value: "certificaciones", label: "Preparación para certificaciones" },
  { value: "empresas", label: "Programas corporativos" },
  { value: "traduccion", label: "Traducción / Interpretación" },
] as const;

export const interestLabels: Record<string, string> = {
  ingles: "Inglés",
  portugues: "Portugués",
  espanol: "Español para extranjeros",
  certificaciones: "Preparación para certificaciones",
  empresas: "Programas corporativos",
  traduccion: "Traducción / Interpretación",
};
