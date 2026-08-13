import { requireModuleAccess } from "@/lib/auth/profile";

export default async function CoordinationLayout({
  children,
}: LayoutProps<"/dashboard/coordinacion">) {
  await requireModuleAccess("/dashboard/coordinacion");
  return children;
}
