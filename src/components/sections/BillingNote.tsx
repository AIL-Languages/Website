import { BankTransferCard } from "@/components/billing/BankTransferCard";
import { ButtonLink } from "@/components/ButtonLink";
import { resolveBankTransfer } from "@/lib/billing/transfer";
import { getSettings } from "@/lib/settings/store";

export async function BillingNote() {
  const settings = await getSettings();
  const transfer = resolveBankTransfer(settings);

  return (
    <section id="facturacion" className="bg-mist py-16 sm:py-20">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-navy/8 bg-card px-8 py-10 sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            Pagos y facturación
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl font-bold text-ink sm:text-3xl">
            Emitimos factura por nuestros servicios para alumnos, profesionistas
            y empresas.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Consulta los datos para transferir, identifica tu pago con tu nombre
            y servicio, y sube tu comprobante desde tu cuenta. Si necesitas
            factura, puedes solicitarla en la misma sección.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#transferencia" variant="primary">
              Ver datos de transferencia
            </ButtonLink>
            <ButtonLink
              href="/iniciar-sesion?next=/dashboard/pagos%23comprobantes"
              variant="ghost"
            >
              Entrar y subir comprobante
            </ButtonLink>
          </div>
        </div>

        <BankTransferCard
          details={transfer}
          paidHref="/iniciar-sesion?next=/dashboard/pagos%23comprobantes"
        />
      </div>
    </section>
  );
}
