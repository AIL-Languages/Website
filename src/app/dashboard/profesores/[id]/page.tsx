import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminModuleHeader } from "@/components/dashboard/AdminModuleHeader";
import { TeacherFileForm } from "@/components/dashboard/TeacherFileForm";
import { TeacherAvailabilityBlock } from "@/components/scheduling/TeacherAvailabilityBlock";
import { getAcademicBundle } from "@/lib/academic/store";
import {
  getProfileById,
  listProfiles,
  requireCoordinatorAccess,
} from "@/lib/auth/profile";
import { visibleDocuments } from "@/lib/documents/access";
import { listDocuments, toPublicDocument } from "@/lib/documents/store";
import { teacherLoad } from "@/lib/ops/load";
import { listAvailability } from "@/lib/scheduling/store";

export const metadata = { title: "Expediente docente" };

type Props = { params: Promise<{ id: string }> };

export default async function TeacherFilePage({ params }: Props) {
  const current = await requireCoordinatorAccess();
  const { id } = await params;
  const teacher = await getProfileById(id);
  if (!teacher || teacher.role !== "teacher") notFound();

  const { groups, assignments, schedules } = await getAcademicBundle();
  const students = (await listProfiles()).filter((item) => item.role === "student");
  const load = teacherLoad(teacher, groups);
  const docs = visibleDocuments(current, await listDocuments())
    .filter(
      (item) =>
        item.linkedUserId === teacher.id ||
        (item.kind === "certificacion" &&
          item.extracted.summary.toLowerCase().includes(teacher.name.toLowerCase())),
    )
    .map(toPublicDocument);
  const teacherSlots = await listAvailability(teacher.id, "teacher");

  return (
    <main className="space-y-8">
      <AdminModuleHeader
        kicker="Expediente docente"
        title={teacher.name}
        backHref="/dashboard/profesores"
        backLabel="← Plantilla docente"
        text={`${teacher.email} · disponibilidad ${load.max || "—"} h · asignadas ${load.assigned} h · disponibles ${load.available} h`}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] bg-white p-5 text-sm">
          <p className="text-muted">Alumnos individuales</p>
          <ul className="mt-2 space-y-1 text-ink">
            {assignments
              .filter((item) => item.teacherId === teacher.id)
              .map((item) => (
                <li key={item.id}>
                  {students.find((student) => student.id === item.studentId)?.name ||
                    "Alumno"}
                </li>
              ))}
            {assignments.every((item) => item.teacherId !== teacher.id) ? (
              <li className="text-muted">Sin asignaciones</li>
            ) : null}
          </ul>
        </article>
        <article className="rounded-[1.5rem] bg-white p-5 text-sm">
          <p className="text-muted">Grupos</p>
          <ul className="mt-2 space-y-1 text-ink">
            {groups
              .filter((item) => item.teacherId === teacher.id)
              .map((item) => (
                <li key={item.id}>
                  {item.name} · {item.schedule}
                </li>
              ))}
            {groups.every((item) => item.teacherId !== teacher.id) ? (
              <li className="text-muted">Sin grupos</li>
            ) : null}
          </ul>
        </article>
        <article className="rounded-[1.5rem] bg-white p-5 text-sm">
          <p className="text-muted">Horarios</p>
          <ul className="mt-2 space-y-1 text-ink">
            {schedules
              .filter((item) => item.teacherId === teacher.id)
              .map((item) => (
                <li key={item.id}>
                  {item.day} {item.start}–{item.end}
                </li>
              ))}
            {schedules.every((item) => item.teacherId !== teacher.id) ? (
              <li className="text-muted">Sin horarios</li>
            ) : null}
          </ul>
        </article>
      </div>
      <TeacherFileForm teacher={teacher} />
      <TeacherAvailabilityBlock
        teacherId={teacher.id}
        initial={teacherSlots.map((slot) => ({
          weekday: slot.weekday,
          availableFrom: slot.availableFrom,
          availableTo: slot.availableTo,
          timezone: slot.timezone,
        }))}
        calendlyUrl={teacher.details.calendlyUrl}
        calendlyUserId={teacher.details.calendlyUserId}
        calendlyEventTypeId={teacher.details.calendlyEventTypeId}
        zoomUserId={teacher.details.zoomUserId}
      />
      {docs.length ? (
        <section className="rounded-[1.75rem] bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-navy">
            Certificaciones y PDF vinculados
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {docs.map((item) => (
              <li key={item.id}>
                <a
                  href={`/api/documents/${item.id}/file`}
                  className="font-semibold text-cyan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.originalName}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <Link href="/dashboard/usuarios" className="text-sm font-semibold text-muted">
        Administrar cuenta de acceso →
      </Link>
    </main>
  );
}
