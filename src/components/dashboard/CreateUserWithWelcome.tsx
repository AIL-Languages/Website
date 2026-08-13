"use client";

import { useState } from "react";
import { CreateUserForm } from "@/components/dashboard/CreateUserForm";
import {
  WelcomeEmailModal,
  type WelcomeDraftRecipient,
} from "@/components/dashboard/WelcomeEmailModal";
import type { PublicProfileRole } from "@/lib/auth/admin";

type Props = {
  allowedRoles?: PublicProfileRole[];
};

export function CreateUserWithWelcome({ allowedRoles }: Props) {
  const [welcome, setWelcome] = useState<WelcomeDraftRecipient | null>(null);

  return (
    <>
      <CreateUserForm allowedRoles={allowedRoles} onCreated={setWelcome} />
      <WelcomeEmailModal
        open={Boolean(welcome)}
        recipient={welcome}
        onClose={() => setWelcome(null)}
      />
    </>
  );
}
