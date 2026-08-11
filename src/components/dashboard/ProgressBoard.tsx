"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { languages, levels, optionLabel } from "@/lib/academic/options";
import type { PublicUser } from "@/lib/auth/types";
import type {
  AttendanceRecord,
  LevelCompletion,
  ProgressSnapshot,
} from "@/lib/reports/types";
import { attendanceSummary, latestProgress } from "@/lib/reports/stats";

const input = "w-full rounded-xl border border-navy/10 px-4 py-3";

type Props = {
  students: PublicUser[];
  progress: ProgressSnapshot[];
  completions: LevelCompletion[];
  attendance: AttendanceRecord[];
  canCapture: boolean;
  canAuthorize: boolean;
  defaultStudentId?: string;
};

export function ProgressBoard({
  students,
  progress,
  completions,
  attendance,
  canCapture,
  canAuthorize,
  defaultStudentId,
}: Props) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(defaultStudentId || students[0]?.id || "");
  const student = students.find((item) => item.id === studentId);
  const snapshots = useMemo(
    () => progress.filter((item) => item.studentId === studentId),
    [progress, studentId],
  );
  const latest = latestProgress(snapshots);
  const completion = completions.find(
    (item) =>
      item.studentId === studentId &&
      item.language === (student?.details.language || item.language) &&
      item.level === (student?.details.level || item.level),
  );
  const attendancePct = attendanceSummary(
    attendance.filter((item) => item.studentId === studentId),
  ).percent;

  async function onProgress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    await fetch("/api/reports/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await fetch("/api/reports/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        finalExamPassed: data.finalExamPassed === "on",
        speakingPassed: data.speakingPassed === "on",
        levelCompleted: data.levelCompleted === "on",
        academicAuthorized: data.academicAuthorized === "on",
      }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] bg-white p-6">
        <label className="text-sm font-medium">
          Alumno
          <select
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            className={`${input} mt-2`}
          >
            {students.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {latest || student ? (
        <article className="rounded-[1.75rem] bg-navy p-6 text-white sm:p-8">
          <p className="text-sm text-lime">REPORTE DE PROGRESO ACADÉMICO</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            {student?.name}
          </h2>
          <p className="mt-3 text-sm text-white/75">
            Idioma: {optionLabel(languages, latest?.language || student?.details.language)} ·
            Nivel: {optionLabel(levels, latest?.level || student?.details.level)} ·
            Profesor: {latest?.teacherName || student?.details.teacher || "—"}
          </p>
          <p className="mt-4 font-display text-3xl font-semibold">
            Progreso: {latest?.progressPercent ?? completion?.progressPercent ?? 0} %
          </p>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <li>Listening — {latest?.skills.listening ?? "—"} %</li>
            <li>Speaking — {latest?.skills.speaking ?? "—"} %</li>
            <li>Reading — {latest?.skills.reading ?? "—"} %</li>
            <li>Writing — {latest?.skills.writing ?? "—"} %</li>
            <li>Grammar — {latest?.skills.grammar ?? "—"} %</li>
            <li>Asistencia — {attendancePct} %</li>
          </ul>
          <p className="mt-4 text-sm text-white/80">
            Observaciones: {latest?.teacherObservations || "—"}
          </p>
          <p className="mt-2 text-sm text-white/80">
            Recomendación: {latest?.academicRecommendation || "—"}
          </p>
          <p className="mt-4 text-xs text-cyan-soft">
            Registro manual AIL. Smrt English no se consulta por API en esta versión.
          </p>
        </article>
      ) : null}

      {studentId ? (
        <a
          href={`/api/reports/export?kind=progreso&studentId=${encodeURIComponent(studentId)}`}
          className="inline-flex rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep"
        >
          Descargar reporte PDF
        </a>
      ) : null}

      {canCapture ? (
        <form onSubmit={onProgress} className="grid gap-3 rounded-[1.75rem] bg-white p-6 sm:grid-cols-2">
          <h3 className="font-display text-lg font-semibold text-navy sm:col-span-2">
            Registrar evaluación / progreso
          </h3>
          <input type="hidden" name="studentId" value={studentId} />
          <select name="language" defaultValue={student?.details.language || "ingles"} className={input}>
            {languages.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <select name="level" defaultValue={student?.details.level || "A1"} className={input}>
            {levels.filter((item) => item.value !== "diagnostico").map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <input name="periodStart" type="date" defaultValue={latest?.periodStart} className={input} />
          <input name="periodEnd" type="date" defaultValue={latest?.periodEnd} className={input} />
          <input name="progressPercent" type="number" min={0} max={100} placeholder="Progreso %" defaultValue={latest?.progressPercent ?? 0} className={input} />
          <input name="listening" type="number" min={0} max={100} placeholder="Listening %" className={input} />
          <input name="speaking" type="number" min={0} max={100} placeholder="Speaking %" className={input} />
          <input name="reading" type="number" min={0} max={100} placeholder="Reading %" className={input} />
          <input name="writing" type="number" min={0} max={100} placeholder="Writing %" className={input} />
          <input name="grammar" type="number" min={0} max={100} placeholder="Grammar %" className={input} />
          <textarea name="teacherObservations" rows={3} placeholder="Observaciones del profesor" className={`${input} sm:col-span-2`} />
          <textarea name="academicRecommendation" rows={3} placeholder="Recomendación académica" className={`${input} sm:col-span-2`} />
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="finalExamPassed" defaultChecked={completion?.finalExamPassed} />
            Evaluación final aprobada (Listening, Reading, Grammar, Writing)
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="speakingPassed" defaultChecked={completion?.speakingPassed} />
            Speaking aprobado por el profesor
          </label>
          {canAuthorize ? (
            <>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="levelCompleted" defaultChecked={completion?.levelCompleted} />
                Nivel completado
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="academicAuthorized" defaultChecked={completion?.academicAuthorized} />
                Autorización académica para diploma
              </label>
              <input name="hoursCompleted" type="number" min={0} placeholder="Horas cursadas" className={input} />
            </>
          ) : null}
          <button className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white sm:col-span-2">
            Guardar progreso
          </button>
        </form>
      ) : null}
    </div>
  );
}
