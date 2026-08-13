/**
 * Anclas y rutas reales de la landing / producto.
 * Si una sección pública aún no existe, el valor es `null` (TODO).
 */
export const faqRoutes = {
  courses: "#cursos",
  methodology: "#metodologia",
  payments: "#facturacion",
  billing: "#facturacion",
  companies: "#empresas",
  companyRegister: "/registro?perfil=empresa",
  translation: "#traduccion",
  translationQuote: "#traduccion-detalle",
  team: "#experiencia",
  contact: "#contacto",
  /**
   * TODO: `ChooseWhenToLearn` (`#elige-cuando`) existe como componente
   * pero no está montado en la landing. Calendly vive en `/dashboard/clases`.
   */
  agenda: null,
  /**
   * TODO: las políticas de cancelación/reprogramación solo existen en el
   * dashboard del alumno (`StudentClassesPanel`), no hay sección pública.
   */
  classPolicies: null,
  /**
   * TODO: diplomas en `/dashboard/reportes/diplomas` (requiere sesión).
   */
  diploma: null,
  /**
   * TODO: reportes de asistencia en `/dashboard/reportes/asistencia`
   * (requiere sesión).
   */
  attendance: null,
} as const;

export type FaqRouteKey = keyof typeof faqRoutes;

export const faqRouteTodos: { key: FaqRouteKey; note: string }[] = [
  {
    key: "agenda",
    note: "Enlazar con Agenda / Calendly cuando la sección pública esté en la landing.",
  },
  {
    key: "classPolicies",
    note: "Publicar políticas de clases y apuntar el FAQ a esa ancla.",
  },
  {
    key: "diploma",
    note: "Conectar con descarga de constancias/diplomas en el dashboard.",
  },
  {
    key: "attendance",
    note: "Conectar con reportes de asistencia y progreso en el dashboard.",
  },
];
