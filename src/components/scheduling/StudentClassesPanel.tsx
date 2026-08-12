"use client";

import { useState } from "react";
import { CalendlyScheduler } from "@/components/scheduling/CalendlyScheduler";
import {
  classStatusLabel,
  type ClassStatus,
  type ScheduledClass,
  type VirtualRoom,
} from "@/lib/scheduling/types";

type CourseInfo = {
  language: string;
  level: string;
  teacher: string;
  plan: string;
  used: number;
  total: number;
  hasTeacher: boolean;
};

type Props = {
  course: CourseInfo;
  upcoming: ScheduledClass[];
  history: ScheduledClass[];
  room: VirtualRoom | null;
  calendlyUrl: string;
  policies: {
    cancellationLimitHours: number;
    rescheduleLimitHours: number;
    noShowPolicy: string;
  };
  timezone: string;
};

function formatWhen(iso: string, timezone: string) {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      timeZone: timezone,
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleString("es-MX");
  }
}

function statusTone(status: ClassStatus) {
  if (status === "scheduled") return "bg-cyan/15 text-navy";
  if (status === "completed") return "bg-lime/30 text-navy-deep";
  if (status === "rescheduled") return "bg-amber-100 text-amber-900";
  return "bg-red-50 text-red-700";
}

export function StudentClassesPanel({
  course,
  upcoming,
  history,
  room,
  calendlyUrl,
  policies,
  timezone,
}: Props) {
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const [openCalendly, setOpenCalendly] = useState(false);
  const next = upcoming[0];
  const progress = course.total
    ? Math.min(100, Math.round((course.used / course.total) * 100))
    : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy">Mi curso</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Idioma
            </dt>
            <dd className="mt-1 text-sm text-ink">{course.language}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Nivel
            </dt>
            <dd className="mt-1 text-sm text-ink">{course.level}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Profesor
            </dt>
            <dd className="mt-1 text-sm text-ink">{course.teacher}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Plan
            </dt>
            <dd className="mt-1 text-sm text-ink">{course.plan}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Clases utilizadas
            </dt>
            <dd className="mt-1 text-sm text-ink">{course.used}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              Clases restantes
            </dt>
            <dd className="mt-1 text-sm text-ink">
              {Math.max(0, course.total - course.used)}
            </dd>
          </div>
        </dl>
        {course.total ? (
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs font-semibold text-muted">
              <span>
                {course.used} / {course.total}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-mist">
              <div
                className="h-full rounded-full bg-cyan"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
      </section>

      {course.hasTeacher ? (
        <section className="rounded-[1.75rem] bg-navy p-6 text-white sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
            Tu próximo paso
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            Tu profesor ya fue asignado
          </h2>
          <p className="mt-2 text-sm text-white/75">
            {course.teacher} · {course.language} · {course.level}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setOpenCalendly(true)}
              className="rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep"
            >
              + Agendar clase
            </button>
            {room?.joinUrl ? (
              <a
                href={room.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-navy-deep"
              >
                Entrar a mi aula
              </a>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="rounded-[1.75rem] bg-white p-6 text-sm text-muted">
          Estamos revisando tu disponibilidad para asignarte un profesor compatible.
        </section>
      )}

      {next ? (
        <section className="rounded-[1.75rem] bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-navy">
            Próxima clase
          </h2>
          <p className="mt-4 font-display text-2xl font-semibold capitalize text-ink">
            {formatWhen(next.startDatetime, timezone)}
          </p>
          <p className="mt-2 text-sm text-muted">
            {course.teacher} · Online ·{" "}
            {Math.round(
              (new Date(next.endDatetime).getTime() -
                new Date(next.startDatetime).getTime()) /
                60000,
            )}{" "}
            min
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {room?.joinUrl ? (
              <a
                href={room.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep"
              >
                Entrar a mi clase
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setOpenCalendly(true)}
              className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy"
            >
              Reprogramar
            </button>
            <button
              type="button"
              className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-muted"
              title={`Cancelación con al menos ${policies.cancellationLimitHours} h de anticipación`}
            >
              Cancelar
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">
            Políticas: reprogramar ≥ {policies.rescheduleLimitHours} h · cancelar ≥{" "}
            {policies.cancellationLimitHours} h. {policies.noShowPolicy}
          </p>
        </section>
      ) : null}

      <section className="rounded-[1.75rem] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-navy">
            Mis clases
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab("upcoming")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                tab === "upcoming" ? "bg-navy text-white" : "bg-mist text-navy"
              }`}
            >
              Próximas clases
            </button>
            <button
              type="button"
              onClick={() => setTab("history")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                tab === "history" ? "bg-navy text-white" : "bg-mist text-navy"
              }`}
            >
              Historial
            </button>
          </div>
        </div>

        {tab === "upcoming" ? (
          <ClassList
            items={upcoming}
            timezone={timezone}
            empty="Aún no tienes clases agendadas."
            showActions
            onReschedule={() => setOpenCalendly(true)}
          />
        ) : (
          <ClassList
            items={history}
            timezone={timezone}
            empty="Sin historial todavía."
          />
        )}
      </section>

      <section className="rounded-[1.75rem] bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy">
          Mi aula virtual
        </h2>
        <p className="mt-2 text-sm text-muted">
          Esta es tu aula virtual personal AIL. Utilizarás este mismo acceso durante
          tus clases personalizadas.
        </p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-muted">Profesor</dt>
            <dd className="text-sm text-ink">{course.teacher}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-muted">Idioma</dt>
            <dd className="text-sm text-ink">{course.language}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-muted">Nivel</dt>
            <dd className="text-sm text-ink">{course.level}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-muted">
              Próxima clase
            </dt>
            <dd className="text-sm text-ink">
              {next ? formatWhen(next.startDatetime, timezone) : "Por agendar"}
            </dd>
          </div>
        </dl>
        {room?.joinUrl ? (
          <div className="mt-5 space-y-2">
            <a
              href={room.joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep"
            >
              Entrar a mi clase
            </a>
            {room.password ? (
              <p className="text-xs text-muted">Contraseña: {room.password}</p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Tu aula se habilitará cuando el pago esté confirmado y tengas profesor
            asignado.
          </p>
        )}
      </section>

      <CalendlyScheduler
        url={calendlyUrl}
        open={openCalendly}
        onClose={() => setOpenCalendly(false)}
      />
    </div>
  );
}

function ClassList({
  items,
  timezone,
  empty,
  showActions,
  onReschedule,
}: {
  items: ScheduledClass[];
  timezone: string;
  empty: string;
  showActions?: boolean;
  onReschedule?: () => void;
}) {
  if (!items.length) {
    return <p className="mt-4 text-sm text-muted">{empty}</p>;
  }

  return (
    <>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2 pr-4">Fecha</th>
              <th className="py-2 pr-4">Hora</th>
              <th className="py-2 pr-4">Estado</th>
              {showActions ? <th className="py-2">Acciones</th> : null}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-navy/10">
                <td className="py-3 pr-4 capitalize">
                  {formatWhen(item.startDatetime, timezone).split(",")[0]}
                </td>
                <td className="py-3 pr-4">
                  {new Date(item.startDatetime).toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: timezone,
                  })}
                  –
                  {new Date(item.endDatetime).toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: timezone,
                  })}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(item.status)}`}
                  >
                    {classStatusLabel[item.status]}
                  </span>
                </td>
                {showActions ? (
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={onReschedule}
                      className="mr-3 text-xs font-semibold text-cyan"
                    >
                      Reprogramar
                    </button>
                    <button
                      type="button"
                      className="text-xs font-semibold text-muted"
                    >
                      Cancelar
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 space-y-3 md:hidden">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-navy/10 p-4">
            <p className="font-semibold capitalize text-navy">
              {formatWhen(item.startDatetime, timezone)}
            </p>
            <p className="mt-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(item.status)}`}
              >
                {classStatusLabel[item.status]}
              </span>
            </p>
            {showActions ? (
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={onReschedule}
                  className="text-xs font-semibold text-cyan"
                >
                  Reprogramar
                </button>
                <button type="button" className="text-xs font-semibold text-muted">
                  Cancelar
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
