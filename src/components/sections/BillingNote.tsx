import { AILButton } from "@/components/ui/AILButton";
import { IconBanknote, IconFileText, IconCalendarDays } from "@/components/director/icons";

const items = [
  { label: "Transferencia", Icon: IconBanknote },
  { label: "Opciones de pago", Icon: IconCalendarDays },
  { label: "Facturación disponible", Icon: IconFileText },
] as const;

export function BillingNote() {
  return (
    <section id="facturacion" className="ail-section ail-section--navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="ail-kicker">Pagos y facturación</p>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Pagos claros, facturación disponible
        </h2>
        <ul className="ail-band mt-6 justify-start sm:justify-start">
          {items.map((item) => (
            <li key={item.label} className="ail-band-item">
              <span className="ail-icon-bubble ail-icon-bubble--sm ail-icon-bubble--on-dark" aria-hidden="true">
                <item.Icon />
              </span>
              {item.label}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <AILButton
            href="/iniciar-sesion?next=/dashboard/pagos%23transferencia"
            variant="on-dark"
            arrow
          >
            Ir a mis pagos
          </AILButton>
        </div>
      </div>
    </section>
  );
}
