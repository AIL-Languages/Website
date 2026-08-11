import Image from "next/image";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { roleLabel } from "@/lib/auth/admin";
import { requireProfile } from "@/lib/auth/profile";
import { site } from "@/lib/site";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const user = await requireProfile();

  return (
    <div className="min-h-screen bg-mist">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-ail.png"
              alt={site.name}
              width={140}
              height={52}
              className="h-11 w-auto"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-cyan-soft sm:inline-flex">
              {roleLabel(user.role)}
            </span>
            <LogoutButton />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <DashboardNav />
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
