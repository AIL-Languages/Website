import { HeroBrandMark } from "@/components/brand/HeroBrandMark";
import { ButtonLink } from "@/components/ButtonLink";
import { SendTestEmailButton } from "@/components/SendTestEmailButton";
import { CountryFlag } from "@/components/director/CountryFlags";
import { getCmsContent } from "@/lib/cms/store";
import { site } from "@/lib/site";

const heroLanguages = [
  {
    name: "Inglés",
    flags: [
      { code: "US" as const, label: "Estados Unidos" },
      { code: "CA" as const, label: "Canadá" },
      { code: "GB" as const, label: "Reino Unido" },
    ],
  },
  {
    name: "Portugués",
    flags: [{ code: "BR" as const, label: "Brasil" }],
  },
  {
    name: "Español",
    flags: [{ code: "MX" as const, label: "México" }],
  },
];

export async function Hero() {
  const cms = await getCmsContent();
  const { hero } = cms;
  const headline = hero.headline?.trim() || "Idiomas que conectan";

  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden bg-ail-navy-primary text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#0b2a52_0%,_#061b38_42%,_#041026_100%)]" />
      <div className="pointer-events-none absolute left-[10%] top-[30%] h-48 w-48 rounded-full bg-ail-cyan/15 blur-3xl" />

      <div className="relative mx-auto w-[calc(100%-2rem)] max-w-[1440px] py-12 sm:w-[calc(100%-3rem)] sm:py-16 xl:max-w-[1520px] lg:py-20">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.36fr_0.64fr] lg:gap-14">
          <div className="relative mx-auto flex w-full max-w-[260px] justify-center lg:max-w-[280px]">
            <HeroBrandMark />
            <p className="sr-only">
              {site.name}. {site.tagline}.
            </p>
          </div>

          <div className="min-w-0 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ail-cyan sm:text-sm">
              Academia virtual de idiomas
            </p>
            <h1 className="mt-3 font-display text-[1.9rem] font-bold leading-[1.12] text-white sm:text-4xl lg:text-[2.6rem]">
              {headline.includes("conectan")
                ? headline
                : "Idiomas que conectan personas y oportunidades"}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#C9DDF0] sm:text-base lg:mx-0">
              {hero.subheadline}
            </p>

            <ul className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {heroLanguages.map((language) => (
                <li
                  key={language.name}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-white"
                >
                  <span className="inline-flex items-center gap-1" aria-hidden>
                    {language.flags.map((flag) => (
                      <span
                        key={flag.code}
                        className="overflow-hidden rounded-full border border-white/70"
                      >
                        <CountryFlag
                          code={flag.code}
                          title={flag.label}
                          className="h-5 w-5"
                        />
                      </span>
                    ))}
                  </span>
                  <span>{language.name}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">
              <ButtonLink href="#contacto" variant="lime">
                Solicitar información
              </ButtonLink>
              <ButtonLink href="#cursos" variant="ghost">
                Explorar programas
              </ButtonLink>
              <SendTestEmailButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
