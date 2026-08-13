import type { ReactElement, ReactNode } from "react";
import type { ModuleIconName } from "@/lib/auth/modules";

type IconProps = { className?: string };

function SvgIcon({
  children,
  className = "h-6 w-6",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function IconCms({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path
        d="M4 5h16v14H4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4 9h16M8 5v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function IconMail({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function IconUsers({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.8 19c.7-3 2.8-4.7 5.2-4.7s4.5 1.7 5.2 4.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16.2 14.4c2 .3 3.6 1.7 4.2 4.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function IconSettings({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 16l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 8.1l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function IconPanel({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect x="3" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="4" width="7" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="11" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </SvgIcon>
  );
}

function IconBilling({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

function IconDocuments({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

function IconTeachers({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path
        d="M22 10 12 5 2 10l10 5 10-5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6 12.5v4.2c0 .8 2.7 2.3 6 2.3s6-1.5 6-2.3v-4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function IconCoordination({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path
        d="M12 7v13M12 7c-2-1.6-5.2-2.2-8-2v13c2.8.2 6 1 8 2.5M12 7c2-1.6 5.2-2.2 8-2v13c-2.8.2-6 1-8 2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function IconAssignment({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <circle cx="7" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 19c.6-2.8 2.3-4.3 3-4.3S9.4 16.2 10 19M14 19c.6-2.8 2.3-4.3 3-4.3s2.4 1.5 3 4.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M10 9.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

function IconReports({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path
        d="M5 19V9M10 19V5M15 19v-7M20 19V8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

const icons: Record<ModuleIconName, (props: IconProps) => ReactElement> = {
  cms: IconCms,
  mail: IconMail,
  users: IconUsers,
  settings: IconSettings,
  panel: IconPanel,
  billing: IconBilling,
  documents: IconDocuments,
  teachers: IconTeachers,
  coordination: IconCoordination,
  assignment: IconAssignment,
  reports: IconReports,
};

export function ModuleIcon({
  name,
  className = "h-6 w-6",
}: {
  name: ModuleIconName;
  className?: string;
}) {
  const Icon = icons[name];
  return <Icon className={className} />;
}
