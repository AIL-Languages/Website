import { HeroBrandMark } from "@/components/brand/HeroBrandMark";
import { ButtonLink } from "@/components/ButtonLink";
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="mt-0.5 h-4 w-4 shrink-0 text-ail-green"
      aria-hidden
    >
      <path
        d="M4.5 10.5 8 14l7.5-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function Hero() {
  const cms = await getCmsContent();
  const { hero } = cms;

  const headline = hero.headline?.trim() || "Idiomas que conectan";
  const showAccentLine = !/oportunidades/i.test(headline);

  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden bg-background text-foreground transition-[background-color,color] duration-300 dark:bg-ail-navy dark:text-white"
    >
      <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_at_top_left,_#0c2a52_0%,_#071b3a_42%,_#041026_100%)] dark:block" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#e8f6fc_0%,_#ffffff_55%,_#f5f9fc_100%)] dark:hidden" />

      <div className="pointer-events-none absolute left-[8%] top-[28%] h-64 w-64 rounded-full bg-ail-blue/15 blur-3xl dark:bg-ail-blue/20" />
      <div className="pointer-events-none absolute right-[12%] top-[36%] h-72 w-72 rounded-full bg-ail-cyan/15 blur-3xl dark:bg-ail-cyan/18" />
      <div className="pointer-events-none absolute bottom-[8%] left-[40%] h-56 w-56 rounded-full bg-ail-green/10 blur-3xl" />

      <svg
        className="pointer-events-none absolute inset-x-0 top-16 hidden h-[70%] w-full opacity-[0.07] dark:block sm:opacity-[0.09]"
        viewBox="0 0 1200 480"
        fill="none"
        aria-hidden
      >
        <path
          d="M80 340 C 260 280, 380 200, 520 220 C 690 245, 780 160, 920 140 C 1000 128, 1080 110, 1140 90"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="4 10"
        />
        <circle cx="80" cy="340" r="3" fill="white" />
        <circle cx="520" cy="220" r="2.5" fill="white" />
        <circle cx="920" cy="140" r="2.5" fill="white" />
        <path d="M1128 78 l18 10 -10 4 4 12 -12-6 -10 8 z" fill="white" />
      </svg>

      <div className="relative mx-auto flex min-h-[min(100svh,720px)] w-[calc(100%-2rem)] max-w-[1440px] items-center py-12 sm:w-[calc(100%-3rem)] sm:py-14 xl:max-w-[1520px] lg:min-h-[680px] lg:py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:gap-16 xl:gap-20">
          <div className="relative mx-auto flex w-full max-w-[300px] justify-center lg:mx-0 lg:max-w-[320px] lg:justify-start">
            <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-ail-cyan/10 blur-2xl dark:bg-ail-cyan/15" />
            <HeroBrandMark />
            <p className="sr-only">
              {site.name}. {site.tagline}.
            </p>
          </div>

          <div className="min-w-0 text-center lg:text-left">
            <p className="animate-rise text-xs font-semibold uppercase tracking-[0.18em] text-ail-cyan sm:text-sm">
              Academia virtual de idiomas
            </p>

            <h1 className="animate-rise-delay-1 mt-4 font-display text-[2rem] font-bold leading-[1.12] text-ink sm:text-4xl lg:text-[2.75rem] xl:text-5xl dark:text-white">
              {headline}
              {showAccentLine ? (
                <>
                  <br />
                  <span className="font-semibold text-ink/90 dark:text-white/90">
                    personas, culturas y oportunidades.
                  </span>
                </>
              ) : null}
            </h1>

            <p className="animate-rise-delay-2 mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base lg:mx-0 dark:text-white/78">
              {hero.subheadline}
            </p>

            <ul className="animate-rise-delay-2 mt-6 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              {heroLanguages.map((language) => (
                <li
                  key={language.name}
                  className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/70 px-3 py-1.5 text-sm font-medium text-ink backdrop-blur-sm dark:border-white/15 dark:bg-white/5 dark:text-white"
                >
                  <span className="inline-flex items-center gap-1" aria-hidden>
                    {language.flags.map((flag) => (
                      <span
                        key={flag.code}
                        className="overflow-hidden rounded-full border border-white/70 shadow-sm"
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

            <ul className="mt-7 grid grid-cols-1 gap-2.5 text-left text-sm text-ink/85 sm:grid-cols-2 dark:text-white/85">
              {hero.advantages.map((item) => (
                <li key={item} className="inline-flex items-start gap-2">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="animate-rise-delay-3 mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <ButtonLink href={hero.primaryCtaHref} variant="lime">
                {hero.primaryCtaLabel}
              </ButtonLink>
              <ButtonLink href={hero.secondaryCtaHref} variant="secondary">
                {hero.secondaryCtaLabel}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
