import Link from "next/link";

type Props = {
  kicker: string;
  title: string;
  text: string;
  backHref?: string;
  backLabel?: string;
};

export function AdminModuleHeader({
  kicker,
  title,
  text,
  backHref = "/dashboard",
  backLabel = "← Inicio",
}: Props) {
  return (
    <section className="rounded-[2rem] bg-navy px-6 py-8 text-white sm:px-10">
      <Link
        href={backHref}
        className="text-sm font-semibold text-cyan-soft hover:text-white"
      >
        {backLabel}
      </Link>
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-lime">
        {kicker}
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm text-white/75">{text}</p>
    </section>
  );
}
