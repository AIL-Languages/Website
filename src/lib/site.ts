export const site = {
  name: "A-Inman Languages",
  shortName: "AIL",
  tagline: "Linking Worldwide",
  headline: "Idiomas que conectan oportunidades.",
  description:
    "Academia virtual especializada en la enseñanza personalizada de inglés, portugués y español para extranjeros, con metodología práctica, atención cercana y formación adaptada a objetivos académicos, profesionales y personales.",
  email: "ainman.languages@gmail.com",
  phoneDisplay: "+52 614 603 7223",
  phoneE164: "526146037223",
  location: "Chihuahua, México",
  whatsappUrl: "https://wa.me/526146037223",
  whatsappPrefill:
    "Hola, me interesa solicitar información sobre los cursos de A-Inman Languages.",
  smrtAccessUrl: "https://www.smrtenglish.com/ail",
  smrtSiteUrl: "https://www.smrtenglish.com/smrt/",
  smrtStudentGuidePdf: "/guides/guia-smrt-english-alumnos.pdf",
  coordinationPhoneDisplay: "+52 614 385 97 68",
  coordinationPhoneE164: "526143859768",
} as const;

export const navItems = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#cursos", label: "Cursos" },
  { href: "#metodologia", label: "Metodología" },
  { href: "#elige-cuando", label: "Agenda" },
  { href: "#empresas", label: "Empresas" },
  { href: "#convenios", label: "Convenios" },
  { href: "#facturacion", label: "Pagos" },
  { href: "#traduccion", label: "Traducción e Interpretación" },
  { href: "#faq", label: "Preguntas frecuentes" },
  { href: "#contacto", label: "Contacto" },
] as const;

export function whatsappLink(message: string = site.whatsappPrefill) {
  return `${site.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export function publicSiteUrl() {
  const explicit = (
    process.env.PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    ""
  ).replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function certificateVerifyUrl(folio: string) {
  return `${publicSiteUrl()}/verificar/${encodeURIComponent(folio)}`;
}
