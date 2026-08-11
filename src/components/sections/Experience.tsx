const highlights = [
  { value: "+14", label: "años de experiencia docente" },
  { value: "3", label: "idiomas impartidos" },
  { value: "5", label: "países de experiencia internacional" },
  { value: "M.Sc.", label: "University of Glasgow" },
];

const credentials = ["IELTS", "TOEFL iBT", "TOEFL ITP", "EF SET", "CELPE-BRAS"];

export function Experience() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
              Nuestra experiencia
            </p>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
              Experiencia que conecta educación, idiomas y entornos profesionales.
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              La trayectoria académica y docente de la dirección de AIL incluye
              experiencia enseñando inglés, portugués y español a estudiantes y
              profesionales vinculados con diferentes sectores.
            </p>
            <p className="mt-4 rounded-2xl border border-cyan/25 bg-mist px-5 py-4 text-sm leading-relaxed text-ink/85">
              Experiencia profesional desarrollada previamente y a través de
              diferentes instituciones educativas. Sectores e instituciones de
              referencia en esa trayectoria incluyen entornos vinculados a
              organizaciones como Grupo PV, Bafar, SCT, Safran-Labinal, Maxion
              Wheels, Sofi Essilor e Innovack, además de distintas academias de
              idiomas.
            </p>
          </div>

          <aside className="rounded-[2rem] bg-navy p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
              Directora Académica
            </p>
            <h3 className="mt-4 font-display text-2xl font-bold">
              M. Sc. Denisse Arévalo Inman
            </h3>
            <p className="mt-2 text-cyan-soft">
              Fundadora & Directora de A-Inman Languages
            </p>
            <p className="mt-5 text-sm leading-relaxed text-white/75">
              Profesional con amplia trayectoria en enseñanza de idiomas,
              experiencia internacional y formación académica multidisciplinaria.
              Su experiencia docente incluye inglés, portugués y español para
              extranjeros, complementada por formación y experiencias en Brasil,
              Estados Unidos, Canadá, Reino Unido e Italia.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/5 px-4 py-4">
                  <p className="font-display text-2xl font-bold text-cyan">{item.value}</p>
                  <p className="mt-1 text-xs leading-snug text-white/70">{item.label}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-16">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            Certificaciones y formación
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {credentials.map((item) => (
              <span
                key={item}
                className="rounded-full border border-navy/10 bg-mist px-5 py-2.5 text-sm font-semibold text-navy"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-muted">
            Formación académica internacional en instituciones de Reino Unido,
            Estados Unidos, Canadá, Brasil e Italia.
          </p>
        </div>
      </div>
    </section>
  );
}
