"use client";

import { useState } from "react";
import { TeacherApplicationModal } from "@/components/recruitment/TeacherApplicationModal";
import {
  AILCard,
  AILCardText,
  AILCardTitle,
  AILIconBubble,
} from "@/components/ui/AILCard";
import { AILButton } from "@/components/ui/AILButton";
import { IconChalkboard, IconUserPlus } from "@/components/director/icons";

export function JoinProfiles() {
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);

  return (
    <section id="registro" className="ail-section ail-section--navy-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <AILCard>
            <AILIconBubble>
              <IconChalkboard />
            </AILIconBubble>
            <AILCardTitle className="text-2xl">
              ¿Te interesa enseñar con AIL?
            </AILCardTitle>
            <AILCardText>
              Conoce nuestro proceso de selección docente.
            </AILCardText>
            <AILButton
              type="button"
              arrow
              className="mt-2"
              onClick={() => setTeacherModalOpen(true)}
            >
              Postularme
            </AILButton>
          </AILCard>

          <AILCard>
            <AILIconBubble>
              <IconUserPlus />
            </AILIconBubble>
            <AILCardTitle className="text-2xl">Crea tu cuenta</AILCardTitle>
            <AILCardText>
              Alumnos y empresas pueden registrarse para acceder a la plataforma.
            </AILCardText>
            <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
              <AILButton href="/registro?perfil=alumno" className="sm:flex-1">
                Soy alumno
              </AILButton>
              <AILButton
                href="/registro?perfil=empresa"
                variant="secondary"
                className="sm:flex-1"
              >
                Soy empresa
              </AILButton>
            </div>
          </AILCard>
        </div>
      </div>

      <TeacherApplicationModal
        open={teacherModalOpen}
        onClose={() => setTeacherModalOpen(false)}
      />
    </section>
  );
}
