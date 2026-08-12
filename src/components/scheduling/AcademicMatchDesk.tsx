"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AvailabilityEditor, type DraftSlot } from "@/components/scheduling/AvailabilityEditor";
import type { PublicUser } from "@/lib/auth/types";
import { WEEKDAY_LABELS } from "@/lib/scheduling/store";

type Match = {
  teacherId: string;
  teacherName: string;
  score: number;
  reasons: string[];
};

type Row = {
  student: PublicUser;
  matches: Match[];
  availability: DraftSlot[];
};

type Props = {
  rows: Row[];
  teachers: { id: string; name: string }[];
};

export function AcademicMatchDesk({ rows: initial, teachers }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function assign(studentId: string, teacherId: string) {
    setBusy(studentId);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/scheduling/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, teacherId }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo asignar.");
      }
      setMessage("Profesor asignado.");
      setRows((prev) =>
        prev.map((row) =>
          row.student.id === studentId
            ? {
                ...row,
                student: {
                  ...row.student,
                  details: {
                    ...row.student.details,
                    teacherId,
                    teacher:
                      row.matches.find((item) => item.teacherId === teacherId)
                        ?.teacherName || row.student.details.teacher,
                  },
                },
              }
            : row,
        ),
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar.");
    } finally {
      setBusy(null);
    }
  }

  async function onManualAssign(event: FormEvent<HTMLFormElement>, studentId: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const teacherId = String(form.get("teacherId") || "");
    if (!teacherId) return;
    await assign(studentId, teacherId);
  }

  return (
    <div className="space-y-6">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-lime-deep">{message}</p> : null}

      {rows.map((row) => {
        const assigned = Boolean(row.student.details.teacherId);
        return (
          <article
            key={row.student.id}
            className="rounded-[1.75rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,26,61,0.05)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-navy">
                  {row.student.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{row.student.email}</p>
              </div>
              {assigned ? (
                <span className="rounded-full bg-lime/40 px-3 py-1 text-xs font-semibold text-navy-deep">
                  Asignado: {row.student.details.teacher}
                </span>
              ) : (
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-navy">
                  Pendiente de match
                </span>
              )}
            </div>

            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">Idioma</dt>
                <dd>{row.student.details.language || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">Nivel</dt>
                <dd>{row.student.details.level || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">Modalidad</dt>
                <dd>{row.student.details.courseType || row.student.details.plan || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">Plan</dt>
                <dd>{row.student.details.plan || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Fecha deseada de inicio
                </dt>
                <dd>
                  {row.student.details.preferredStartDate ||
                    row.student.details.startDate ||
                    "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Clases / semana
                </dt>
                <dd>{row.student.details.sessionsPerWeek || "—"}</dd>
              </div>
            </dl>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Disponibilidad
              </p>
              {row.availability.length ? (
                <ul className="mt-2 space-y-1 text-sm text-ink">
                  {row.availability.map((slot, index) => (
                    <li key={`${slot.weekday}-${index}`}>
                      {WEEKDAY_LABELS[slot.weekday]} {slot.availableFrom}–
                      {slot.availableTo}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted">Sin franjas registradas.</p>
              )}
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Profesores compatibles
              </p>
              {row.matches.length ? (
                <ul className="mt-3 space-y-3">
                  {row.matches.map((match) => (
                    <li
                      key={match.teacherId}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy/10 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-navy">{match.teacherName}</p>
                        <p className="text-xs text-muted">
                          Score {match.score} · {match.reasons.join(" · ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={busy === row.student.id}
                        onClick={() => assign(row.student.id, match.teacherId)}
                        className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        Asignar profesor
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  No hay coincidencias automáticas. Puedes asignar manualmente abajo.
                </p>
              )}
            </div>

            <form
              className="mt-5 flex flex-wrap items-end gap-3"
              onSubmit={(event) => onManualAssign(event, row.student.id)}
            >
              <label className="min-w-[220px] flex-1 text-sm font-medium">
                Asignación manual
                <select
                  name="teacherId"
                  required
                  className="mt-2 w-full rounded-xl border border-navy/10 px-3 py-2"
                  defaultValue=""
                >
                  <option value="">Selecciona profesor</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                disabled={busy === row.student.id}
                className="rounded-full border border-navy/15 px-4 py-2.5 text-sm font-semibold text-navy"
              >
                Confirmar
              </button>
            </form>

            <form
              className="mt-4 grid gap-3 rounded-2xl border border-dashed border-navy/15 p-4 sm:grid-cols-[1fr_auto]"
              onSubmit={async (event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                setBusy(row.student.id);
                setError("");
                try {
                  const response = await fetch("/api/scheduling/rooms", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      studentId: row.student.id,
                      joinUrl: form.get("joinUrl"),
                      meetingId: form.get("meetingId") || undefined,
                      password: form.get("password") || undefined,
                    }),
                  });
                  const payload = (await response.json()) as {
                    ok?: boolean;
                    error?: string;
                  };
                  if (!response.ok || !payload.ok) {
                    throw new Error(payload.error || "No se pudo guardar Zoom.");
                  }
                  setMessage("Aula Zoom individual guardada.");
                  router.refresh();
                } catch (err) {
                  setError(
                    err instanceof Error ? err.message : "Error al guardar Zoom.",
                  );
                } finally {
                  setBusy(null);
                }
              }}
            >
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Zoom individual (fase 1 manual)
                </p>
                <p className="mt-1 text-xs text-muted">
                  Solo join URL del alumno. Nunca uses /myhome ni host URL.
                </p>
              </div>
              <label className="text-sm font-medium sm:col-span-2">
                Join URL
                <input
                  name="joinUrl"
                  required
                  placeholder="https://zoom.us/j/..."
                  className="mt-2 w-full rounded-xl border border-navy/10 px-3 py-2"
                />
              </label>
              <label className="text-sm font-medium">
                Meeting ID
                <input
                  name="meetingId"
                  className="mt-2 w-full rounded-xl border border-navy/10 px-3 py-2"
                />
              </label>
              <label className="text-sm font-medium">
                Password (opcional)
                <input
                  name="password"
                  className="mt-2 w-full rounded-xl border border-navy/10 px-3 py-2"
                />
              </label>
              <button
                type="submit"
                disabled={busy === row.student.id}
                className="rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white sm:col-span-2 sm:justify-self-start"
              >
                Guardar aula Zoom
              </button>
            </form>
          </article>
        );
      })}

      {!rows.length ? (
        <p className="rounded-[1.5rem] bg-white p-6 text-sm text-muted">
          Aún no hay alumnos para asignación académica.
        </p>
      ) : null}
    </div>
  );
}
