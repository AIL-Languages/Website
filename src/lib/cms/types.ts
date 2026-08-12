export type CmsHeroContent = {
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  advantages: string[];
};

export type CmsAboutContent = {
  eyebrow: string;
  title: string;
  body: string;
};

export type CmsContactContent = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  socialTitle: string;
  socialBody: string;
};

export type CmsProgramsContent = {
  eyebrow: string;
  title: string;
  certificationsEyebrow: string;
  certificationsTitle: string;
  certificationsBody: string;
  certificationsCta: string;
};

export type CmsSiteContent = {
  updatedAt: string | null;
  updatedBy: string | null;
  hero: CmsHeroContent;
  about: CmsAboutContent;
  programs: CmsProgramsContent;
  contact: CmsContactContent;
};

export type CmsAuthState = {
  /** Hash bcrypt de la contraseña exclusiva del CMS (solo admin AIL). */
  passwordHash: string | null;
  passwordUpdatedAt: string | null;
};

export type CmsStoreFile = {
  auth: CmsAuthState;
  content: CmsSiteContent;
};

export function defaultCmsContent(): CmsSiteContent {
  return {
    updatedAt: null,
    updatedBy: null,
    hero: {
      headline: "Idiomas que conectan",
      subheadline:
        "Aprende inglés, portugués o español mediante clases online personalizadas, horarios flexibles y una metodología práctica enfocada en comunicación real.",
      primaryCtaLabel: "Solicitar información",
      primaryCtaHref: "#contacto",
      secondaryCtaLabel: "Ver programas",
      secondaryCtaHref: "#cursos",
      advantages: [
        "Clases 100% online",
        "Horarios flexibles",
        "Atención personalizada",
        "Profesores especializados",
      ],
    },
    about: {
      eyebrow: "Quiénes somos",
      title: "Aprender un idioma es mucho más que estudiar gramática.",
      body: "A-Inman Languages es una academia virtual enfocada en brindar formación lingüística personalizada, práctica y comunicativa. Acompañamos a cada estudiante en el desarrollo de habilidades para situarse en contextos académicos, profesionales, laborales, de viaje o de la vida cotidiana.",
    },
    programs: {
      eyebrow: "Programas especializados",
      title: "Soluciones para estudiantes, profesionales y empresas",
      certificationsEyebrow: "Certificaciones",
      certificationsTitle: "Prepárate para alcanzar tu siguiente objetivo.",
      certificationsBody:
        "Programas de preparación para exámenes internacionales. AIL te acompaña en tu preparación; la certificación la otorga el organismo evaluador correspondiente.",
      certificationsCta: "Quiero prepararme",
    },
    contact: {
      eyebrow: "Contacto",
      title: "Tu siguiente idioma puede abrirte nuevas oportunidades.",
      body: "Cuéntanos qué idioma quieres aprender, cuáles son tus objetivos y qué disponibilidad tienes. Nuestro equipo te orientará para encontrar la modalidad adecuada.",
      bullets: [
        "Estudiantes particulares",
        "Empresas y equipos de trabajo",
        "Clientes de traducción e interpretación",
      ],
      socialTitle: "Síguenos en redes sociales",
      socialBody:
        "Conoce novedades, contenido educativo y actualizaciones de A-Inman Languages.",
    },
  };
}

export function defaultCmsAuth(): CmsAuthState {
  return {
    passwordHash: null,
    passwordUpdatedAt: null,
  };
}
