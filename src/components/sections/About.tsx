import { ExpandInline } from "@/components/ui/ExpandInline";
import { getCmsContent } from "@/lib/cms/store";

const pillars = [
  {
    title: "Nuestra misión",
    text: "Facilitar el aprendizaje de idiomas mediante una enseñanza personalizada, práctica y de calidad.",
  },
  {
    title: "Nuestra visión",
    text: "Ser una academia virtual de referencia por calidad académica, atención e innovación.",
  },
  {
    title: "Nuestros valores",
    text: "Profesionalismo · Confianza · Calidad · Compromiso · Comunicación · Flexibilidad.",
  },
];

export async function About() {
  const { about } = await getCmsContent();

  return (
    <section id="nosotros" className="ail-section ail-section--navy-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="ail-kicker">{about.eyebrow}</p>
        <h2 className="max-w-3xl font-display text-2xl font-bold sm:text-3xl">
          {about.title}
        </h2>
        <p className="ail-lead mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
          {about.body}
        </p>
        <ExpandInline summary="Conocer más sobre AIL">
          <div className="grid gap-5 md:grid-cols-3">
            {pillars.map((item) => (
              <article key={item.title} className="ail-card ail-card--compact">
                <h3 className="ail-card-title text-lg">{item.title}</h3>
                <p className="ail-card-text">{item.text}</p>
              </article>
            ))}
          </div>
        </ExpandInline>
      </div>
    </section>
  );
}
