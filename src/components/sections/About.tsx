import { getCmsContent } from "@/lib/cms/store";

const pillars = [
  {
    title: "Nuestra misión",
    text: "Facilitar el aprendizaje de idiomas mediante una enseñanza personalizada, práctica y de calidad que permita a nuestros estudiantes comunicarse con seguridad en un entorno cada vez más global.",
  },
  {
    title: "Nuestra visión",
    text: "Consolidar a A-Inman Languages como una academia virtual de referencia por su calidad académica, atención personalizada e innovación en la enseñanza de idiomas.",
  },
  {
    title: "Nuestros valores",
    text: "Profesionalismo · Confianza · Calidad · Compromiso · Comunicación · Flexibilidad · Aprendizaje continuo.",
  },
];

export async function About() {
  const { about } = await getCmsContent();

  return (
    <section id="nosotros" className="relative bg-mist py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            {about.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {about.title}
          </h2>
          <p className="mt-6 max-w-2xl leading-relaxed text-ink/85">{about.body}</p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {pillars.map((item) => (
            <article key={item.title} className="border-t-2 border-cyan/70 pt-5">
              <h3 className="font-display text-xl font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
