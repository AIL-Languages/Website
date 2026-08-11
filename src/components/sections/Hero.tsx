import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { site } from "@/lib/site";

const advantages = [
  "100 % online",
  "Clases personalizadas",
  "Profesores certificados",
  "Horarios flexibles",
];

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate min-h-[100svh] overflow-hidden bg-navy text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a2a56_0%,_#001a3d_48%,_#000f24_100%)]" />
      <div className="animate-glow pointer-events-none absolute left-1/2 top-1/3 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-lime/15 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Image
            src="/logo-ail.png"
            alt="A-Inman Languages"
            width={420}
            height={160}
            priority
            className="animate-rise animate-float mx-auto mb-8 h-auto w-[min(86vw,420px)]"
            style={{ width: "auto", height: "auto" }}
          />

          <h1 className="animate-rise-delay-1 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {site.headline}
          </h1>

          <p className="animate-rise-delay-2 mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Academia virtual de inglés, portugués y español para extranjeros, con
            metodología práctica y formación adaptada a tus objetivos.
          </p>

          <div className="animate-rise-delay-3 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="#cursos" variant="primary">
              Conoce nuestros cursos
            </ButtonLink>
            <ButtonLink href="#registro" variant="secondary">
              Crea tu cuenta
            </ButtonLink>
          </div>
        </div>

        <ul className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-cyan-soft/95 sm:text-base">
          {advantages.map((item, index) => (
            <li key={item} className="inline-flex items-center gap-6">
              {index > 0 ? (
                <span className="hidden h-1 w-1 rounded-full bg-lime sm:inline-block" aria-hidden />
              ) : null}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
