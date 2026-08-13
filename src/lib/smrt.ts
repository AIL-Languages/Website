import { site, whatsappLink } from "@/lib/site";
import type { UserRole } from "@/lib/auth/admin";

export const smrtHubCards = [
  {
    id: "primeros-pasos",
    emoji: "🚀",
    title: "Primeros pasos",
    text: "Cómo acceder y familiarizarte con la plataforma.",
  },
  {
    id: "cursos",
    emoji: "📚",
    title: "Cursos y biblioteca",
    text: "Conoce los cursos y recursos disponibles.",
  },
  {
    id: "lecciones",
    emoji: "✏️",
    title: "Lecciones y ejercicios",
    text: "Cómo trabajar con Listening, Speaking, Reading, Writing, Grammar y Vocabulary.",
  },
  {
    id: "assignments",
    emoji: "📋",
    title: "Assignments",
    text: "Consulta las actividades asignadas por tu profesor.",
  },
  {
    id: "assessments",
    emoji: "🎯",
    title: "Assessments",
    text: "Conoce cómo funcionan tus evaluaciones y resultados.",
  },
  {
    id: "ayuda",
    emoji: "❓",
    title: "¿Necesitas ayuda?",
    text: "Contacta a Coordinación Académica.",
  },
] as const;

export const smrtTeacherCards = [
  {
    id: "primeros-pasos",
    emoji: "🚀",
    title: "Primeros pasos",
    text: "Accede a la plataforma y ubica tus clases.",
  },
  {
    id: "cursos",
    emoji: "📚",
    title: "Cursos y biblioteca",
    text: "Explora los más de 60 cursos y recursos para tus grupos.",
  },
  {
    id: "lecciones",
    emoji: "✏️",
    title: "Lecciones y ejercicios",
    text: "Cómo están organizadas las habilidades dentro de cada unidad.",
  },
  {
    id: "assignments",
    emoji: "📋",
    title: "Assignments",
    text: "Asigna actividades y revisa los ejercicios de tus alumnos.",
  },
  {
    id: "assessments",
    emoji: "🎯",
    title: "Assessments",
    text: "Evalúa el avance por unidad y consulta resultados.",
  },
  {
    id: "ayuda",
    emoji: "❓",
    title: "¿Necesitas ayuda?",
    text: "Contacta a Coordinación Académica.",
  },
] as const;

export const courseCatalog = [
  "English for Adults",
  "English for Youth",
  "English for Kids / Children",
  "English Academics",
  "Electives",
  "English for Special Purposes",
  "Bilingual Courses",
  "English Test Preparation",
  "Listening & Speaking",
  "Business English",
  "Reading & Comprehension",
  "Writing",
  "Vocabulary",
  "Grammar",
  "IELTS Preparation",
  "TOEFL ITP Preparation",
  "American Slang & Idioms",
  "English for Economics, Administration, Automotive y Aviation",
];

export const bilingualTracks = [
  "English - Spanish",
  "English - Portuguese",
  "English - Chinese",
  "English - Arabic",
  "English - Indonesian",
];

export const learningTools = {
  dictionaries: [
    "Oxford Learners",
    "Learner's Dictionary",
    "Online Etymology",
    "Thesaurus",
    "Word Reference",
    "MacMillan",
    "Longman",
    "Visual Dictionary",
  ],
  news: [
    "The New York Times",
    "CBC News",
    "CNN",
    "BBC",
    "Google News",
    "Global Times",
    "The Guardian",
    "The Big Picture",
  ],
  videos: ["TED", "TED-Ed", "English Central"],
  tools: [
    "Irregular Verb List",
    "Modal Verbs",
    "Simple English Wikipedia",
    "Guide to Canada",
    "Guide to United States",
    "Spelling City",
    "Duolingo",
  ],
};

export const skills = [
  "Listening",
  "Speaking",
  "Writing",
  "Reading",
  "Grammar",
  "Vocabulary",
  "Use of English",
] as const;

export function smrtGuideForRole(role: UserRole) {
  if (role === "teacher") return "teacher" as const;
  return "student" as const;
}

export function usesStudentSmrtExperience(role: UserRole) {
  return role === "student" || role === "company";
}

export function smrtAccessDescription(role: UserRole) {
  if (role === "teacher") {
    return "Accede a los cursos y recursos que utilizas con tus estudiantes.";
  }
  if (role === "admin" || role === "coordinator") {
    return "Accede a la plataforma y consulta los recursos académicos disponibles.";
  }
  return "Consulta tus lecciones, actividades, materiales y recursos asignados por tu profesor.";
}

export function smrtGuideHref(role: UserRole) {
  return smrtGuideForRole(role) === "teacher"
    ? "/dashboard/smrt-english/guia/profesor"
    : "/dashboard/smrt-english/guia/alumno";
}

export function smrtHelpWhatsappHref() {
  return whatsappLink("Hola, necesito ayuda para acceder a Smrt English.");
}

export function coordinationWhatsappHref() {
  return `https://wa.me/${site.coordinationPhoneE164}?text=${encodeURIComponent(
    "Hola, necesito apoyo de Coordinación Académica con Smrt English.",
  )}`;
}
