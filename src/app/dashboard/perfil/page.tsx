import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { requireProfile } from "@/lib/auth/profile";

export const metadata = {
  title: "Mi perfil",
};

export default async function ProfilePage() {
  const user = await requireProfile();

  return (
    <main>
      <section className="mb-8 rounded-[2rem] bg-navy px-6 py-8 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
          Mi perfil
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold">Tus datos en AIL</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/75">
          Consulta y actualiza tu información. El correo y el tipo de perfil no
          se modifican desde aquí.
        </p>
      </section>
      <ProfileCard user={user} />
    </main>
  );
}
