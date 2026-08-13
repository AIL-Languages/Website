import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { roleLabel, canCoordinate, canManageSystem } from "@/lib/auth/admin";
import { requireProfile } from "@/lib/auth/profile";
import { site } from "@/lib/site";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const user = await requireProfile();
  const showCms = canManageSystem(user.role, user.email);
  const showCoordination = canCoordinate(user.role, user.email);

  return (
    <div className="min-h-screen bg-background text-foreground transition-[background-color,color] duration-300">
      <header className="bg-ail-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo
              variant="horizontal"
              forceTheme="dark"
              className="hidden h-11 w-auto sm:block"
              width={180}
              height={56}
            />
            <BrandLogo
              variant="isotype"
              forceTheme="dark"
              className="h-10 w-auto sm:hidden"
              width={88}
              height={56}
            />
            <span className="sr-only">{site.name}</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-cyan-soft sm:inline-flex">
              {roleLabel(user.role)}
            </span>
            <ThemeToggle className="border-white/25 bg-white/10 text-white hover:border-ail-cyan/60" />
            <LogoutButton />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <DashboardNav showCms={showCms} showCoordination={showCoordination} />
        </div>
      </header>
      <div className="mx-auto min-w-0 max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
