export const experienceStats = [
  { id: "years", value: 13, prefix: "+", suffix: " años", label: "Experiencia lingüística" },
  { id: "students", value: 350, prefix: "+", suffix: "", label: "Alumnos formados" },
  { id: "academies", value: 7, prefix: "", suffix: "", label: "Academias e instituciones" },
  { id: "companies", value: 8, prefix: "", suffix: "", label: "Empresas y entornos corporativos" },
] as const;

export const careerTimeline = [
  {
    id: "2012",
    period: "2012",
    title: "Inicio de trayectoria docente",
    text: "Inicio de experiencia profesional en enseñanza de idiomas.",
  },
  {
    id: "2012-2020",
    period: "2012–2020",
    title: "Experiencia académica y corporativa",
    text: "Docencia de idiomas en academias, instituciones educativas y entornos empresariales.",
  },
  {
    id: "2020",
    period: "2020",
    title: "Fundación de A-Inman Languages",
    text: "Creación de la academia virtual y desarrollo de su metodología académica.",
  },
  {
    id: "2020-now",
    period: "2020–Actualidad",
    title: "Fundadora & Directora Académica",
    text: "Dirección académica, metodología, evaluación lingüística, coordinación docente y enseñanza multilingüe.",
  },
] as const;

export const professionalOrganizations = [
  "Safran Labinal",
  "Maxion Wheels",
  "TecMilenio",
  "Lingua-Tec",
  "Lexicore Languages",
  "English Academy",
  "Ciao Italia",
  "Leibintz Language Academy",
  "Grupo PV",
  "Bafar",
  "SCT",
  "Batesville",
  "Innovack",
] as const;

export type CertificationItem = {
  id: string;
  name: string;
  year?: string;
  score?: string;
  cefr?: string;
  pdfUrl?: string;
  notes?: string;
};

export type LanguageProfile = {
  id: string;
  flag: string;
  name: string;
  level: string;
  levelDetail: string;
  summary: string;
  certifications: CertificationItem[];
};

export const languages: LanguageProfile[] = [
  {
    id: "en",
    flag: "🇬🇧",
    name: "Inglés",
    level: "C1",
    levelDetail: "Avanzado",
    summary: "Formación y experiencia académica internacional en inglés.",
    certifications: [
      { id: "ef-set", name: "EF SET" },
      { id: "ielts", name: "IELTS" },
      { id: "toefl-ibt", name: "TOEFL iBT" },
      { id: "toefl-itp", name: "TOEFL ITP" },
      { id: "british-council", name: "British Council" },
    ],
  },
  {
    id: "pt",
    flag: "🇧🇷",
    name: "Portugués",
    level: "C1",
    levelDetail: "Avanzado",
    summary: "Experiencia de inmersión lingüística y cultural en Brasil.",
    certifications: [{ id: "celpe", name: "CELPE-BRAS" }],
  },
  {
    id: "it",
    flag: "🇮🇹",
    name: "Italiano",
    level: "B2",
    levelDetail: "Intermedio avanzado",
    summary: "Experiencia internacional en Italia.",
    certifications: [{ id: "testizer", name: "Testizer B2" }],
  },
  {
    id: "es",
    flag: "🇲🇽",
    name: "Español",
    level: "Nativo",
    levelDetail: "Lengua materna",
    summary: "Docencia de español como lengua extranjera.",
    certifications: [],
  },
];

export type JourneyExperienceKind = "origin" | "rotary" | "language-stay" | "academic";

export type JourneyStop = {
  id: string;
  country: string;
  region?: string;
  code: "MX" | "US" | "BR" | "GB" | "CA" | "IT";
  description: string;
  kind: JourneyExperienceKind;
  kindLabel: string;
  pinColor: string;
  origin?: boolean;
  viaRotary?: boolean;
  education?: {
    degree: string;
    institution: string;
    years: string;
  };
};

export const journeyStops: JourneyStop[] = [
  {
    id: "mx",
    country: "México",
    code: "MX",
    description: "Base profesional y académica",
    kind: "origin",
    kindLabel: "Punto de origen",
    pinColor: "#00F0A3",
    origin: true,
  },
  {
    id: "us",
    country: "Estados Unidos",
    code: "US",
    description: "Estancia lingüística en inglés",
    kind: "language-stay",
    kindLabel: "Estancia lingüística",
    pinColor: "#168BFF",
  },
  {
    id: "br",
    country: "Brasil",
    code: "BR",
    description: "Inmersión lingüística y cultural",
    kind: "rotary",
    kindLabel: "Experiencia Rotary",
    pinColor: "#00E0E6",
    viaRotary: true,
  },
  {
    id: "uk",
    country: "Reino Unido",
    region: "Escocia",
    code: "GB",
    description: "Formación académica en University of Glasgow",
    kind: "academic",
    kindLabel: "Formación académica",
    pinColor: "#071B3A",
    education: {
      degree: "M.Sc. Sustainable Water Environments",
      institution: "University of Glasgow",
      years: "2021–2022",
    },
  },
  {
    id: "ca",
    country: "Canadá",
    code: "CA",
    description: "Experiencia profesional internacional",
    kind: "rotary",
    kindLabel: "Experiencia Rotary",
    pinColor: "#00E0E6",
    viaRotary: true,
  },
  {
    id: "it",
    country: "Italia",
    code: "IT",
    description: "Experiencia profesional internacional",
    kind: "rotary",
    kindLabel: "Experiencia Rotary",
    pinColor: "#00F0A3",
    viaRotary: true,
  },
];

export const glasgowProgram = {
  institution: "University of Glasgow",
  location: "Scotland · United Kingdom",
  degree: "M.Sc. Sustainable Water Environments",
  years: "2021–2022",
  text: "Formación de posgrado desarrollada en un entorno académico internacional de habla inglesa.",
} as const;

export const founderContent = {
  eyebrow: "Dirección académica",
  name: "M. Sc. Denisse Arévalo Inman",
  role: "Fundadora & Directora Académica de A-Inman Languages",
  bio: "Profesional multilingüe con más de una década de experiencia en la enseñanza de idiomas y formación internacional. Fundadora y Directora Académica de A-Inman Languages desde 2020, con experiencia en enseñanza de inglés, portugués y español para extranjeros en contextos académicos, corporativos y profesionales.",
  closing:
    "La metodología de A-Inman Languages nace de la experiencia real enseñando, aprendiendo y utilizando idiomas en contextos académicos, profesionales e internacionales.",
  images: {
    hero: {
      src: "/team/denisse-arevalo-inman-directora-academica.jpg",
      alt: "Denisse Arévalo Inman, fundadora y Directora Académica de A-Inman Languages",
      width: 800,
      height: 1000,
    },
    credentials: {
      src: "/team/denisse-arevalo-inman-perfil-profesional.jpg",
      alt: "Denisse Arévalo Inman, fundadora y Directora Académica de A-Inman Languages",
      width: 720,
      height: 900,
    },
    international: {
      src: "/team/denisse-arevalo-inman-experiencia-internacional.jpg",
      alt: "Denisse Arévalo Inman, docente multilingüe y fundadora de A-Inman Languages",
      width: 720,
      height: 900,
    },
  },
} as const;
