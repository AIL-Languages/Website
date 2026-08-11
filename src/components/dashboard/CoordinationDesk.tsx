"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { languages, levels, optionLabel } from "@/lib/academic/options";
import type {
  AcademicFollowUp,
  AcademicGroup,
  ScheduleSlot,
  TeacherAssignment,
} from "@/lib/academic/store";
import type { PublicUser } from "@/lib/auth/types";

type Tab = "alumnos" | "grupos" | "horarios" | "asignaciones" | "seguimiento";

type Props = {
  students: PublicUser[];
  teachers: PublicUser[];
  groups: AcademicGroup[];
  assignments: TeacherAssignment[];
  schedules: ScheduleSlot[];
  followUps: AcademicFollowUp[];
};

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const input = "w-full rounded-xl border border-navy/10 px-4 py-3";

export function CoordinationDesk({
  students,
  teachers,
  groups,
  assignments,
  schedules,
  followUps,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("alumnos");

  async function post(body: Record<string, unknown>) {
    await fetch("/api/academic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
  }

  function teacherName(id?: string) {
    return teachers.find((item) => item.id === id)?.name || "Por asignar";
  }

  async function onGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const teacher = teachers.find((item) => item.id === data.teacherId);
    await post({ ...data, teacher: teacher?.name || "Por asignar" });
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["alumnos", "👩‍🎓 Alumnos"],
            ["grupos", "👥 Grupos"],
            ["horarios", "📅 Horarios"],
            ["asignaciones", "🔗 Asignaciones"],
            ["seguimiento", "📈 Seguimiento"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === id ? "bg-navy text-white" : "bg-white text-navy"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "alumnos" ? (
        <div className="overflow-hidden rounded-[1.75rem] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-mist text-muted">
              <tr>
                <th className="px-5 py-3">Alumno</th>
                <th className="px-5 py-3">Idioma</th>
                <th className="px-5 py-3">Nivel</th>
                <th className="px-5 py-3">Profesor</th>
                <th className="px-5 py-3">Inicio</th>
                <th className="px-5 py-3">Estatus</th>
                <th className="px-5 py-3">Smrt</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const assigned = assignments.find((item) => item.studentId === student.id);
                return (
                  <tr key={student.id} className="border-t border-navy/8">
                    <td className="px-5 py-3">{student.name}</td>
                    <td className="px-5 py-3">{optionLabel(languages, student.details.language)}</td>
                    <td className="px-5 py-3">{optionLabel(levels, student.details.level)}</td>
                    <td className="px-5 py-3">
                      {teacherName(assigned?.teacherId || student.details.teacherId) ||
                        student.details.teacher ||
                        "—"}
                    </td>
                    <td className="px-5 py-3">{student.details.startDate || "—"}</td>
                    <td className="px-5 py-3">
                      {student.details.academicStatus || student.accountStatus}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {student.details.smrtCourse || "Manual"}{" "}
                      {student.details.smrtProgress ? `· ${student.details.smrtProgress}%` : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "grupos" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={onGroup} className="space-y-3 rounded-[1.75rem] bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-navy">Crear grupo</h3>
            <input name="name" required placeholder="Nombre" className={input} />
            <select name="language" required className={input}>
              {languages.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
            <select name="level" required className={input}>
              {levels.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
            <select name="teacherId" className={input}>
              <option value="">Profesor responsable</option>
              {teachers.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <input name="schedule" required placeholder="Horario" className={input} />
            <input name="weeklyHours" placeholder="Horas semanales" className={input} />
            <button className="rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep">
              Crear grupo
            </button>
          </form>
          <div className="rounded-[1.75rem] bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-navy">Grupos</h3>
            <ul className="mt-4 space-y-5 text-sm text-muted">
              {groups.map((group) => (
                <li key={group.id} className="rounded-2xl bg-mist/70 p-4">
                  <strong className="text-ink">{group.name}</strong>
                  <p>
                    {optionLabel(languages, group.language)} {group.level} · {group.teacher} · {group.schedule}
                  </p>
                  <p className="mt-2">
                    Alumnos:{" "}
                    {group.studentIds.length
                      ? group.studentIds
                          .map(
                            (id) =>
                              students.find((item) => item.id === id)?.name || id,
                          )
                          .join(", ")
                      : "sin alumnos"}
                  </p>
                  <form
                    className="mt-3 flex flex-wrap gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const studentId = String(
                        new FormData(event.currentTarget).get("studentId") ?? "",
                      );
                      if (!studentId) return;
                      void post({
                        type: "group-update",
                        id: group.id,
                        studentIds: [...group.studentIds, studentId],
                      });
                    }}
                  >
                    <select name="studentId" className="rounded-xl border border-navy/10 px-3 py-2">
                      <option value="">Agregar alumno</option>
                      {students
                        .filter((item) => !group.studentIds.includes(item.id))
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                    <button className="rounded-full bg-navy px-3 py-2 text-xs font-semibold text-white">
                      Agregar
                    </button>
                  </form>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.studentIds.map((id) => (
                      <button
                        key={id}
                        type="button"
                        className="rounded-full border border-navy/15 px-3 py-1 text-xs"
                        onClick={() =>
                          void post({
                            type: "group-update",
                            id: group.id,
                            studentIds: group.studentIds.filter((item) => item !== id),
                          })
                        }
                      >
                        Quitar {students.find((item) => item.id === id)?.name || "alumno"}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {tab === "horarios" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <form
            className="space-y-3 rounded-[1.75rem] bg-white p-6"
            onSubmit={(event) => {
              event.preventDefault();
              const data = Object.fromEntries(new FormData(event.currentTarget).entries());
              void post({ type: "schedule", ...data });
              event.currentTarget.reset();
            }}
          >
            <h3 className="font-display text-lg font-semibold text-navy">Nuevo horario</h3>
            <select name="day" required className={input}>
              {days.map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input type="time" name="start" required className={input} />
              <input type="time" name="end" required className={input} />
            </div>
            <select name="teacherId" className={input}>
              <option value="">Profesor</option>
              {teachers.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <select name="studentId" className={input}>
              <option value="">Alumno (opcional)</option>
              {students.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <select name="groupId" className={input}>
              <option value="">Grupo (opcional)</option>
              {groups.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <button className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white">
              Guardar horario
            </button>
          </form>
          <ul className="space-y-3 rounded-[1.75rem] bg-white p-6 text-sm">
            {schedules.map((slot) => (
              <li key={slot.id}>
                <strong>{slot.day} {slot.start}–{slot.end}</strong>
                <p className="text-muted">
                  {teacherName(slot.teacherId)} ·{" "}
                  {students.find((item) => item.id === slot.studentId)?.name ||
                    groups.find((item) => item.id === slot.groupId)?.name ||
                    "Sin asignar"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tab === "asignaciones" ? (
        <form
          className="space-y-3 rounded-[1.75rem] bg-white p-6"
          onSubmit={(event) => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(event.currentTarget).entries());
            void post({ type: "assignment", ...data });
          }}
        >
          <h3 className="font-display text-lg font-semibold text-navy">
            Asignar profesor a alumno
          </h3>
          <select name="studentId" required className={input}>
            <option value="">Alumno</option>
            {students.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <select name="teacherId" required className={input}>
            <option value="">Profesor</option>
            {teachers.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <select name="groupId" className={input}>
            <option value="">Grupo (opcional)</option>
            {groups.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <button className="rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-deep">
            Guardar asignación
          </button>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {assignments.map((item) => (
              <li key={item.id}>
                {students.find((user) => user.id === item.studentId)?.name || item.studentId}
                {" → "}
                {teacherName(item.teacherId)}
              </li>
            ))}
          </ul>
        </form>
      ) : null}

      {tab === "seguimiento" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <form
            className="space-y-3 rounded-[1.75rem] bg-white p-6"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const data = Object.fromEntries(new FormData(form).entries());
              const student = students.find((item) => item.id === data.studentId);
              void post({
                type: "followup",
                studentId: data.studentId,
                studentName: student?.name,
                notes: data.notes,
              });
              if (student) {
                void fetch(`/api/users/${student.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    details: {
                      ...student.details,
                      academicStatus: String(data.academicStatus || student.details.academicStatus || ""),
                      smrtCourse: String(data.smrtCourse || student.details.smrtCourse || ""),
                      smrtProgress: String(data.smrtProgress || student.details.smrtProgress || ""),
                      observations: String(data.notes || ""),
                    },
                  }),
                }).then(() => router.refresh());
              }
              form.reset();
            }}
          >
            <h3 className="font-display text-lg font-semibold text-navy">Nueva observación</h3>
            <select name="studentId" required className={input}>
              <option value="">Alumno</option>
              {students.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <input name="academicStatus" placeholder="Estatus académico (activo, pausa…)" className={input} />
            <input name="smrtCourse" placeholder="Curso Smrt, ej. English 120" className={input} />
            <input name="smrtProgress" placeholder="Progreso Smrt %" className={input} />
            <textarea name="notes" required rows={4} placeholder="Progreso, evaluación u observación" className={input} />
            <button className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white">
              Registrar seguimiento
            </button>
            <p className="text-xs text-muted">
              Smrt se registra de forma manual si la plataforma no expone el dato.
            </p>
          </form>
          <ul className="space-y-3 rounded-[1.75rem] bg-white p-6 text-sm">
            {followUps.map((item) => (
              <li key={item.id}>
                <strong>{item.studentName}</strong>
                <p className="text-muted">{item.notes}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
