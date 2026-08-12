import { ButtonLink } from "@/components/ButtonLink";

/**
 * Sección pública de pagos: solo información general.
 * Nunca incluye CLABE, beneficiario ni Dimo®.
 */
export function BillingNote() {
  return (
    <section id="facturacion" className="bg-mist py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-navy/8 bg-card px-8 py-10 sm:px-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            Pagos y facturación
          </p>
          <h2 className="max-w-2xl font-display text-2xl font-bold text-ink sm:text-3xl">
            Emitimos factura por nuestros servicios para alumnos, profesionistas y
            empresas.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            AIL acepta transferencias bancarias y ofrece facturación de los
            servicios contratados. Los datos concretos para transferir están
            disponibles únicamente dentro de tu cuenta, una vez que inicies sesión
            como alumno o empresa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              href="/iniciar-sesion?next=/dashboard/pagos%23transferencia"
              variant="primary"
            >
              Entrar a ver datos de pago
            </ButtonLink>
            <ButtonLink
              href="/iniciar-sesion?next=/dashboard/pagos%23comprobantes"
              variant="ghost"
            >
              Entrar y subir comprobante
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
