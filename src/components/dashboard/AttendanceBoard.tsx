"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicUser } from "@/lib/auth/types";
import type { AttendanceRecord } from "@/lib/reports/types";
import { attendanceSummary } from "@/lib/reports/stats";

const input = "w-full rounded-xl border border-navy/10 px-4 py-3";

type Props = {
  students: PublicUser[];
  records: AttendanceRecord[];
  canCapture: boolean;
  defaultStudentId?: string;
};

const labels = {
  asistio: "Asistió",
  falta: "Inasistencia",
  cancelada: "Cancelada",
  reprogramada: "Reprogramada",
};

export function AttendanceBoard({
  students,
  records,
  canCapture,
  defaultStudentId,
}: Props) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(defaultStudentId || students[0]?.id || "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const visible = useMemo(
    () => records.filter((item) => !studentId || item.studentId === studentId),
    [records, studentId],
  );
  const summary = attendanceSummary(visible, from || undefined, to || undefined);
  const student = students.find((item) => item.id === studentId);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    await fetch("/api/reports/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    event.currentTarget.reset();
    router.refresh();
  }

  const exportHref = `/api/reports/export?kind=asistencia&studentId=${encodeURIComponent(studentId)}${
    from ? `&from=${from}` : ""
  }${to ? `&to=${to}` : ""}`;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-[1.5rem] bg-white p-6 sm:grid-cols-4">
        <label className="text-sm font-medium sm:col-span-2">
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
        <label className="text-sm font-medium">
          Desde
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className={`${input} mt-2`} />
        </label>
        <label className="text-sm font-medium">
          Hasta
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} className={`${input} mt-2`} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Programadas", summary.programmed],
          ["Asistidas", summary.attended],
          ["Inasistencias", summary.absences],
          ["Cancelaciones", summary.cancelled],
          ["Asistencia", `${summary.percent} %`],
        ].map(([label, value]) => (
          <article key={label} className="rounded-[1.5rem] bg-white p-5">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-navy">{value}</p>
          </article>
        ))}
      </div>

      {studentId ? (
        <a
          href={exportHref}
          className="inline-flex rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep"
        >
          Descargar reporte PDF
        </a>
      ) : null}

      {canCapture ? (
        <form onSubmit={onCreate} className="grid gap-3 rounded-[1.5rem] bg-white p-6 sm:grid-cols-2">
          <h3 className="font-display text-lg font-semibold text-navy sm:col-span-2">
            Registrar clase
          </h3>
          <select name="studentId" defaultValue={studentId} required className={input}>
            {students.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <input type="date" name="date" required className={input} />
          <select name="status" required className={input}>
            <option value="asistio">Asistió</option>
            <option value="falta">Inasistencia</option>
            <option value="cancelada">Cancelada</option>
            <option value="reprogramada">Reprogramada</option>
          </select>
          <input name="notes" placeholder="Nota (opcional)" className={input} />
          <button className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white sm:col-span-2">
            Guardar asistencia
          </button>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-[1.75rem] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-mist text-muted">
            <tr>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Alumno</th>
              <th className="px-5 py-3">Estatus</th>
              <th className="px-5 py-3">Nota</th>
            </tr>
          </thead>
          <tbody>
            {summary.items.map((item) => (
              <tr key={item.id} className="border-t border-navy/8">
                <td className="px-5 py-3">{item.date}</td>
                <td className="px-5 py-3">{item.studentName}</td>
                <td className="px-5 py-3">{labels[item.status]}</td>
                <td className="px-5 py-3 text-muted">{item.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {student ? (
        <p className="text-sm text-muted">
          {student.name} · {student.details.language || "idioma"} · {student.details.level || "nivel"}
        </p>
      ) : null}
    </div>
  );
}
