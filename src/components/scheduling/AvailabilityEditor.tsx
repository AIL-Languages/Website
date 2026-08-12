"use client";

import { useMemo, useState } from "react";
import {
  WEEKDAYS,
  WEEKDAY_LABELS,
  type AvailabilitySlot,
  type Weekday,
} from "@/lib/scheduling/types";

export type DraftSlot = {
  weekday: Weekday;
  availableFrom: string;
  availableTo: string;
  timezone: string;
};

type Props = {
  name?: string;
  title?: string;
  hint?: string;
  initial?: DraftSlot[];
  timezone?: string;
};

function toDraft(slots: AvailabilitySlot[] | DraftSlot[]): DraftSlot[] {
  return slots.map((slot) => ({
    weekday: slot.weekday,
    availableFrom: slot.availableFrom,
    availableTo: slot.availableTo,
    timezone: slot.timezone || "America/Chihuahua",
  }));
}

export function AvailabilityEditor({
  name = "availabilityPayload",
  title = "¿Cuándo puedes tomar tus clases?",
  hint = "Selecciona días y uno o varios rangos. Horarios en America/Chihuahua.",
  initial = [],
  timezone = "America/Chihuahua",
}: Props) {
  const [slots, setSlots] = useState<DraftSlot[]>(() =>
    initial.length ? toDraft(initial) : [],
  );
  const [day, setDay] = useState<Weekday>("lunes");
  const [from, setFrom] = useState("17:00");
  const [to, setTo] = useState("20:00");

  const payload = useMemo(() => JSON.stringify(slots), [slots]);

  function addSlot() {
    if (!from || !to || from >= to) return;
    setSlots((prev) => [
      ...prev,
      { weekday: day, availableFrom: from, availableTo: to, timezone },
    ]);
  }

  function removeSlot(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  }

  const grouped = WEEKDAYS.map((weekday) => ({
    weekday,
    items: slots
      .map((slot, index) => ({ ...slot, index }))
      .filter((slot) => slot.weekday === weekday),
  })).filter((group) => group.items.length);

  return (
    <div className="space-y-4 rounded-2xl border border-navy/10 bg-mist/40 p-4">
      <div>
        <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
        <p className="mt-1 text-sm text-muted">{hint}</p>
      </div>

      <input type="hidden" name={name} value={payload} />

      <div className="grid gap-3 sm:grid-cols-4">
        <label className="text-sm font-medium">
          Día
          <select
            value={day}
            onChange={(event) => setDay(event.target.value as Weekday)}
            className="mt-2 w-full rounded-xl border border-navy/10 px-3 py-2"
          >
            {WEEKDAYS.map((item) => (
              <option key={item} value={item}>
                {WEEKDAY_LABELS[item]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Desde
          <input
            type="time"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="mt-2 w-full rounded-xl border border-navy/10 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium">
          Hasta
          <input
            type="time"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="mt-2 w-full rounded-xl border border-navy/10 px-3 py-2"
          />
        </label>
        <div className="flex items-end">
          <button
            type="button"
            onClick={addSlot}
            className="w-full rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white"
          >
            Agregar rango
          </button>
        </div>
      </div>

      {grouped.length ? (
        <ul className="space-y-3 text-sm">
          {grouped.map((group) => (
            <li key={group.weekday}>
              <p className="font-semibold text-navy">
                {WEEKDAY_LABELS[group.weekday]}
              </p>
              <ul className="mt-1 space-y-1">
                {group.items.map((item) => (
                  <li
                    key={`${item.weekday}-${item.index}`}
                    className="flex items-center justify-between rounded-xl bg-white px-3 py-2"
                  >
                    <span>
                      {item.availableFrom}–{item.availableTo} · {item.timezone}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSlot(item.index)}
                      className="text-xs font-semibold text-red-600"
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Aún no hay franjas registradas.</p>
      )}
    </div>
  );
}
