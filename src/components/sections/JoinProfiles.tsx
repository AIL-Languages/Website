"use client";

import Link from "next/link";
import { useState } from "react";
import { TeacherApplicationModal } from "@/components/recruitment/TeacherApplicationModal";

export function JoinProfiles() {
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);

  return (
    <section id="registro" className="bg-card py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-[1.5rem] bg-navy p-6 text-white sm:p-8">
            <h2 className="font-display text-2xl font-semibold">
              ¿Te interesa enseñar con AIL?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Conoce nuestro proceso de selección docente.
            </p>
            <button
              type="button"
              onClick={() => setTeacherModalOpen(true)}
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-lime px-5 text-sm font-semibold text-navy-deep"
            >
              Postularme →
            </button>
          </article>

          <article className="rounded-[1.5rem] border border-navy/10 bg-mist/70 p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-navy">
              Crea tu cuenta
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Alumnos, empresas y coordinación pueden registrarse para acceder a la plataforma.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/registro?perfil=alumno"
                className="inline-flex min-h-11 items-center rounded-full bg-cyan px-5 text-sm font-semibold text-navy-deep"
              >
                Soy alumno
              </Link>
              <Link
                href="/registro?perfil=empresa"
                className="inline-flex min-h-11 items-center rounded-full border border-navy/15 px-5 text-sm font-semibold text-navy"
              >
                Soy empresa
              </Link>
            </div>
          </article>
        </div>
      </div>

      <TeacherApplicationModal
        open={teacherModalOpen}
        onClose={() => setTeacherModalOpen(false)}
      />
    </section>
  );
}
