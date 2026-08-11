import { SmrtHub } from "@/components/dashboard/SmrtHub";
import { requireProfile } from "@/lib/auth/profile";

export const metadata = {
  title: "Smrt English",
};

export default async function SmrtEnglishPage() {
  const user = await requireProfile();
  return <SmrtHub role={user.role} name={user.name} />;
}
