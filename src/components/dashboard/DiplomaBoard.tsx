"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { languages, levels, optionLabel } from "@/lib/academic/options";
import type { PublicUser } from "@/lib/auth/types";
import { isDiplomaEligible, type Diploma, type LevelCompletion } from "@/lib/reports/types";
import { diplomaForCompletion } from "@/lib/reports/stats";

type Props = {
  students: PublicUser[];
  completions: LevelCompletion[];
  diplomas: Diploma[];
  canIssue: boolean;
  defaultStudentId?: string;
};

export function DiplomaBoard({
  students,
  completions,
  diplomas,
  canIssue,
  defaultStudentId,
}: Props) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(defaultStudentId || students[0]?.id || "");
  const [error, setError] = useState("");
  const student = students.find((item) => item.id === studentId);
  const items = useMemo(
    () => completions.filter((item) => !studentId || item.studentId === studentId),
    [completions, studentId],
  );

  async function issue(completionId: string) {
    setError("");
    const response = await fetch("/api/reports/diplomas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completionId }),
    });
    const payload = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !payload.ok) {
      setError(payload.error || "No se pudo emitir el diploma.");
      return;
    }
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
            className="mt-2 w-full rounded-xl border border-navy/10 px-4 py-3"
          >
            {students.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {items.length === 0 ? (
        <p className="rounded-[1.5rem] bg-white p-6 text-sm text-muted">
          Aún no hay un nivel en seguimiento para {student?.name || "este alumno"}.
          El diploma no se genera por tiempo transcurrido: requiere 100 % del nivel,
          evaluación final, speaking, nivel completado y autorización académica.
        </p>
      ) : null}

      {items.map((item) => {
        const diploma = diplomaForCompletion(diplomas, item);
        const ready = isDiplomaEligible(item);
        return (
          <article key={item.id} className="rounded-[1.75rem] bg-white p-6 sm:p-8">
            <p className="text-sm font-semibold text-cyan">
              {optionLabel(levels, item.level)}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-navy">
              {item.studentName}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {optionLabel(languages, item.language)}
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              <li>Progreso del nivel: {item.progressPercent} %</li>
              <li>Evaluación final: {item.finalExamPassed ? "Aprobada ✓" : "Pendiente"}</li>
              <li>Speaking: {item.speakingPassed ? "Aprobado ✓" : "Pendiente"}</li>
              <li>Estatus: {item.levelCompleted ? "Nivel completado ✓" : "En curso"}</li>
              <li>
                Autorización académica:{" "}
                {item.academicAuthorized ? "Autorizado ✓" : "Pendiente"}
              </li>
            </ul>

            {diploma ? (
              <div className="mt-6 rounded-2xl bg-mist p-5">
                <p className="font-display text-lg font-semibold text-navy">
                  Tu diploma está disponible
                </p>
                <p className="mt-1 text-sm text-muted">Folio {diploma.folio}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={`/api/reports/export?kind=diploma&folio=${encodeURIComponent(diploma.folio)}`}
                    className="rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep"
                  >
                    Descargar diploma PDF
                  </a>
                  <a
                    href={`/verificar/${encodeURIComponent(diploma.folio)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy"
                  >
                    Ver verificación pública
                  </a>
                </div>
              </div>
            ) : ready && canIssue ? (
              <button
                type="button"
                onClick={() => void issue(item.id)}
                className="mt-6 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
              >
                Emitir diploma
              </button>
            ) : (
              <p className="mt-6 text-sm text-muted">
                El diploma se habilita solo cuando el flujo está completo: nivel al
                100 %, evaluación final, speaking, nivel completado y autorización
                académica.
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
