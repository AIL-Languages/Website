import { IconClock3 } from "@/components/director/icons";
import type { PartnershipStatusKind } from "@/lib/partnerships";

const config: Record<
  PartnershipStatusKind,
  { label: string; className: string }
> = {
  comingSoon: {
    label: "Próximamente",
    className:
      "border-ail-cyan/35 bg-ail-cyan/10 text-ail-cyan group-hover:border-ail-cyan/55 group-hover:bg-ail-cyan/15",
  },
  active: {
    label: "Convenio activo",
    className:
      "border-ail-green/40 bg-ail-green/12 text-ail-green",
  },
  paused: {
    label: "En pausa",
    className: "border-white/25 bg-white/8 text-white/75",
  },
};

export function PartnershipStatus({
  status,
  className = "",
}: {
  status: PartnershipStatusKind;
  className?: string;
}) {
  const item = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition duration-300 ${item.className} ${className}`}
    >
      {status === "comingSoon" ? <IconClock3 className="h-3.5 w-3.5" /> : null}
      {item.label}
    </span>
  );
}
