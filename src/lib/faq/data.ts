import { faqRoutes } from "@/lib/faq/routes";
import type { FaqCategory, FaqCategoryId, FaqItem } from "@/lib/faq/types";

export const faqCategories: FaqCategory[] = [
  { id: "all", label: "Todas" },
  { id: "courses", label: "Cursos" },
  { id: "schedule", label: "Clases y horarios" },
  { id: "platform", label: "Plataforma" },
  { id: "payments", label: "Pagos" },
  { id: "certifications", label: "Certificaciones" },
  { id: "companies", label: "Empresas" },
  { id: "translations", label: "Traducciones" },
];

const categoryOrder: FaqCategoryId[] = [
  "courses",
  "schedule",
  "platform",
  "payments",
  "certifications",
  "companies",
  "translations",
];

export const faqItems: FaqItem[] = [
  {
    id: "idiomas-ail",
    category: "courses",
    question: "¿Qué idiomas puedo estudiar en AIL?",
    answer:
      "En A-Inman Languages ofrecemos cursos de inglés, portugués y español para extranjeros, principalmente dirigidos a adolescentes y adultos. Los programas se adaptan al nivel, objetivos y ritmo de aprendizaje de cada estudiante.",
    keywords: ["idiomas", "inglés", "portugués", "español", "cursos", "programas"],
    audience: "prospect",
    relatedRoute: faqRoutes.courses,
    priority: 10,
    isPublic: true,
  },
  {
    id: "clases-individuales-grupales",
    category: "courses",
    question: "¿Las clases son individuales o grupales?",
    answer:
      "Ofrecemos clases personalizadas y clases en grupos reducidos. Las clases personalizadas permiten adaptar el contenido y ritmo de aprendizaje a cada estudiante, mientras que nuestros grupos se mantienen pequeños, con un máximo de 5 alumnos.",
    keywords: ["individuales", "grupales", "personalizadas", "grupo reducido", "máximo 5"],
    audience: "prospect",
    relatedRoute: faqRoutes.methodology,
    priority: 20,
    isPublic: true,
  },
  {
    id: "metodologia-ail",
    category: "courses",
    question: "¿Cuál es la metodología de AIL?",
    answer:
      "Trabajamos con una metodología práctica, comunicativa y personalizada. Nuestro objetivo es que el estudiante utilice el idioma desde las primeras clases y desarrolle progresivamente las habilidades necesarias para comunicarse en situaciones reales.",
    keywords: ["metodología", "comunicativa", "práctica", "personalizada"],
    audience: "prospect",
    relatedRoute: faqRoutes.methodology,
    priority: 30,
    isPublic: true,
  },
  {
    id: "clase-muestra",
    category: "courses",
    question: "¿Puedo tomar una clase muestra antes de inscribirme?",
    answer:
      "Sí. Puedes solicitar una clase muestra para conocer nuestra metodología, resolver tus dudas y determinar si el programa se adapta a tus objetivos antes de iniciar tu curso.",
    keywords: ["clase muestra", "demo", "prueba", "inscripción"],
    audience: "prospect",
    relatedRoute: faqRoutes.contact,
    priority: 40,
    isPublic: true,
  },
  {
    id: "presencial-o-en-linea",
    category: "schedule",
    question: "¿Las clases son presenciales o en línea?",
    answer:
      "Las clases de A-Inman Languages se imparten en modalidad virtual, permitiendo que estudiantes y profesores puedan conectarse desde diferentes ubicaciones.",
    keywords: ["en línea", "online", "virtual", "presencial", "zoom"],
    audience: "prospect",
    priority: 10,
    isPublic: true,
  },
  {
    id: "elegir-horarios",
    category: "schedule",
    question: "¿Puedo elegir mis horarios?",
    answer:
      "Sí. Los horarios se determinan considerando tanto tu disponibilidad como la disponibilidad de nuestros profesores, buscando encontrar opciones compatibles para ambas partes.",
    keywords: ["horarios", "disponibilidad", "agenda", "flexibilidad"],
    audience: "prospect",
    relatedRoute: faqRoutes.agenda,
    priority: 20,
    isPublic: true,
  },
  {
    id: "fecha-de-inicio",
    category: "schedule",
    question: "¿Puedo elegir cuándo comenzar mi curso?",
    answer:
      "Sí. Durante el proceso de inscripción podrás indicar tu fecha deseada de inicio. La disponibilidad final dependerá de la modalidad seleccionada y de los horarios disponibles de nuestros profesores.",
    keywords: ["inicio", "fecha", "inscripción", "comenzar"],
    audience: "prospect",
    relatedRoute: faqRoutes.agenda,
    priority: 30,
    isPublic: true,
  },
  {
    id: "agendar-clases",
    category: "schedule",
    question: "¿Cómo agendo mis clases?",
    answer:
      "Los alumnos podrán consultar la disponibilidad correspondiente y seleccionar horarios compatibles mediante el sistema de agenda de AIL. Las opciones disponibles dependerán del profesor, modalidad y plan contratado.",
    keywords: ["agendar", "agenda", "calendly", "reservar", "horarios"],
    audience: "prospect",
    relatedRoute: faqRoutes.agenda,
    ctaLabel: "Ver agenda AIL",
    cta: { label: "Ver agenda AIL", href: faqRoutes.agenda },
    priority: 40,
    isPublic: true,
  },
  {
    id: "plataforma-zoom",
    category: "schedule",
    question: "¿Por qué plataforma se imparten las clases?",
    answer:
      "Las clases virtuales se realizan mediante Zoom. Los datos de acceso correspondientes estarán disponibles para el alumno de acuerdo con la modalidad y programación de sus clases.",
    keywords: ["zoom", "plataforma", "aula virtual", "videollamada"],
    audience: "prospect",
    priority: 50,
    isPublic: true,
  },
  {
    id: "cancelar-reprogramar",
    category: "schedule",
    question: "¿Qué pasa si necesito cancelar o reprogramar una clase?",
    answer:
      "Las cancelaciones y reprogramaciones están sujetas a las políticas vigentes de AIL. Consulta la sección de Políticas de clases para conocer los tiempos de aviso y condiciones aplicables.",
    keywords: ["cancelar", "reprogramar", "políticas", "aviso"],
    audience: "prospect",
    relatedRoute: faqRoutes.classPolicies,
    ctaLabel: "Consultar políticas de clases",
    cta: { label: "Consultar políticas de clases", href: faqRoutes.classPolicies },
    priority: 60,
    isPublic: true,
  },
  {
    id: "evaluacion-nivel",
    category: "platform",
    question: "¿Cómo sé cuál es mi nivel?",
    answer:
      "Antes de iniciar el programa se realiza una evaluación diagnóstica para identificar tu nivel actual y asignarte contenidos adecuados a tus conocimientos y objetivos.",
    keywords: ["nivel", "diagnóstica", "evaluación", "placement", "mcer"],
    audience: "prospect",
    priority: 10,
    isPublic: true,
  },
  {
    id: "material-ingles-smrt",
    category: "platform",
    question: "¿Qué material se utiliza para estudiar inglés?",
    answer:
      "Para los programas de inglés, AIL puede utilizar SMRT English como plataforma académica y recurso complementario de aprendizaje, con actividades de lectura, conversación, escritura, gramática, vocabulario y comprensión auditiva.",
    keywords: ["smrt", "smrt english", "material", "inglés", "plataforma académica"],
    audience: "prospect",
    priority: 20,
    isPublic: true,
  },
  {
    id: "acceso-material-fuera-de-clase",
    category: "platform",
    question: "¿Puedo acceder al material fuera de mis clases?",
    answer:
      "Sí. Cuando tu programa incluya acceso a una plataforma académica, podrás utilizar los recursos disponibles también fuera del horario de clase para reforzar tu aprendizaje.",
    keywords: ["material", "plataforma", "24/7", "fuera de clase", "smrt"],
    audience: "prospect",
    priority: 30,
    isPublic: true,
  },
  {
    id: "metodos-de-pago",
    category: "payments",
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "AIL cuenta con opciones de pago y transferencia para sus servicios. Consulta la sección de Pagos para conocer la información y opciones vigentes.",
    keywords: ["pago", "transferencia", "métodos", "bancario"],
    audience: "prospect",
    relatedRoute: faqRoutes.payments,
    ctaLabel: "Ver información de pago",
    cta: { label: "Ver información de pago", href: faqRoutes.payments },
    priority: 10,
    isPublic: true,
  },
  {
    id: "factura",
    category: "payments",
    question: "¿AIL emite factura?",
    answer:
      "Sí. A-Inman Languages puede emitir factura por sus servicios. Para solicitarla será necesario proporcionar los datos fiscales correspondientes.",
    keywords: ["factura", "facturación", "cfdi", "datos fiscales"],
    audience: "prospect",
    relatedRoute: faqRoutes.billing,
    ctaLabel: "Información de facturación",
    cta: { label: "Información de facturación", href: faqRoutes.billing },
    priority: 20,
    isPublic: true,
  },
  {
    id: "profesores-certificados",
    category: "certifications",
    question: "¿Los profesores están certificados?",
    answer:
      "AIL selecciona a sus profesores considerando su dominio del idioma, experiencia docente, formación y certificaciones o evaluaciones comprobables según corresponda.",
    keywords: ["profesores", "certificados", "equipo", "docentes"],
    audience: "prospect",
    relatedRoute: faqRoutes.team,
    ctaLabel: "Conoce a nuestro equipo",
    cta: { label: "Conoce a nuestro equipo", href: faqRoutes.team },
    priority: 10,
    isPublic: true,
  },
  {
    id: "diploma-constancia",
    category: "certifications",
    question: "¿Recibiré un diploma al terminar mi curso o nivel?",
    answer:
      "Los alumnos que cumplan con los requisitos académicos correspondientes podrán obtener una constancia o diploma de finalización de acuerdo con el curso o nivel completado.",
    keywords: ["diploma", "constancia", "certificado", "finalización"],
    audience: "prospect",
    relatedRoute: faqRoutes.diploma,
    ctaLabel: "Consultar documentos académicos",
    cta: { label: "Consultar documentos académicos", href: faqRoutes.diploma },
    priority: 20,
    isPublic: true,
  },
  {
    id: "reporte-asistencia-progreso",
    category: "certifications",
    question: "¿Puedo obtener un reporte de asistencia o progreso?",
    answer:
      "Los alumnos podrán consultar información académica relacionada con su avance y, conforme se habiliten las funciones correspondientes en el dashboard, obtener reportes de asistencia y progreso.",
    keywords: ["asistencia", "progreso", "reporte", "dashboard", "avance"],
    audience: "prospect",
    relatedRoute: faqRoutes.attendance,
    priority: 30,
    isPublic: true,
  },
  {
    id: "cursos-empresas",
    category: "companies",
    question: "¿Ofrecen cursos para empresas?",
    answer:
      "Sí. AIL puede ofrecer capacitación lingüística para empresas y organizaciones, adaptando los programas a las necesidades, objetivos y disponibilidad del equipo.",
    keywords: ["empresas", "corporativo", "organizaciones", "equipos", "business"],
    audience: ["prospect", "company"],
    relatedRoute: faqRoutes.companies,
    ctaLabel: "Solicitar información para empresas",
    cta: {
      label: "Solicitar información para empresas",
      href: faqRoutes.contact,
      contactInterest: "empresas",
    },
    priority: 10,
    isPublic: true,
  },
  {
    id: "servicios-traduccion",
    category: "translations",
    question: "¿AIL ofrece servicios de traducción e interpretación?",
    answer:
      "Sí. Además de la enseñanza de idiomas, AIL ofrece servicios de traducción e interpretación en diferentes modalidades y combinaciones lingüísticas.",
    keywords: ["traducción", "interpretación", "documentos", "idiomas"],
    audience: ["prospect", "translation-client"],
    relatedRoute: faqRoutes.translation,
    ctaLabel: "Conocer servicios de traducción",
    cta: { label: "Conocer servicios de traducción", href: faqRoutes.translation },
    priority: 10,
    isPublic: true,
  },
  {
    id: "cotizacion-traduccion",
    category: "translations",
    question: "¿Cómo puedo solicitar una cotización de traducción?",
    answer:
      "Puedes solicitar una cotización proporcionando la información del documento, los idiomas de origen y destino y, cuando corresponda, adjuntando el archivo que deseas traducir.",
    keywords: ["cotización", "traducción", "presupuesto", "documento", "archivo"],
    audience: ["prospect", "translation-client"],
    relatedRoute: faqRoutes.translationQuote,
    ctaLabel: "Solicitar cotización",
    cta: {
      label: "Solicitar cotización",
      href: faqRoutes.translationQuote,
      contactInterest: "traduccion",
    },
    priority: 20,
    isPublic: true,
  },
];

export function getPublicFaqItems() {
  return faqItems.filter((item) => item.isPublic);
}

export function faqCategoryLabel(id: FaqCategoryId | "all") {
  return faqCategories.find((category) => category.id === id)?.label ?? id;
}

export function sortFaqItems(items: FaqItem[]) {
  return [...items].sort((a, b) => {
    const categoryDiff =
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    if (categoryDiff !== 0) return categoryDiff;
    return (a.priority ?? 100) - (b.priority ?? 100);
  });
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function matchesFaqQuery(item: FaqItem, query: string) {
  const needle = normalizeSearch(query);
  if (!needle) return true;

  const haystack = normalizeSearch(
    [
      item.question,
      item.answer,
      faqCategoryLabel(item.category),
      item.category,
      item.keywords.join(" "),
    ].join(" "),
  );

  return haystack.includes(needle);
}
