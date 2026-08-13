import { ButtonLink } from "@/components/ButtonLink";

export function BillingNote() {
  return (
    <section id="facturacion" className="bg-mist py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
          Pagos y facturación
        </p>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Pagos claros, facturación disponible
        </h2>
        <ul className="mt-4 grid gap-2 text-sm text-ink/85 sm:grid-cols-3">
          <li>✓ Transferencia</li>
          <li>✓ Opciones de pago</li>
          <li>✓ Facturación disponible</li>
        </ul>
        <div className="mt-5">
          <ButtonLink
            href="/iniciar-sesion?next=/dashboard/pagos%23transferencia"
            variant="primary"
          >
            Ir a mis pagos →
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
