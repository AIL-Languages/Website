import Link from "next/link";
import { languages, levels, optionLabel } from "@/lib/academic/options";
import { getDiplomaByFolio } from "@/lib/reports/store";
import { site } from "@/lib/site";

type Props = { params: Promise<{ folio: string }> };

export async function generateMetadata({ params }: Props) {
  const { folio } = await params;
  return { title: `Verificación ${decodeURIComponent(folio)}` };
}

export default async function CertificateVerifyPage({ params }: Props) {
  const { folio: raw } = await params;
  const folio = decodeURIComponent(raw).toUpperCase();
  const diploma = await getDiplomaByFolio(folio);

  return (
    <main className="min-h-screen bg-mist px-4 py-12">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
          {site.name}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy">
          Verificación de certificado
        </h1>
        {diploma ? (
          <article className="mt-8 rounded-[1.75rem] bg-white p-8 shadow-[0_12px_40px_rgba(0,26,61,0.08)]">
            <p className="text-sm font-semibold text-lime-deep">✓ Certificado válido</p>
            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="text-muted">Alumno</dt>
                <dd className="font-semibold text-navy">{diploma.studentName}</dd>
              </div>
              <div>
                <dt className="text-muted">Idioma</dt>
                <dd>{optionLabel(languages, diploma.language)}</dd>
              </div>
              <div>
                <dt className="text-muted">Nivel</dt>
                <dd>{optionLabel(levels, diploma.level)}</dd>
              </div>
              <div>
                <dt className="text-muted">Fecha de conclusión</dt>
                <dd>{new Date(diploma.issuedAt).toLocaleDateString("es-MX")}</dd>
              </div>
              <div>
                <dt className="text-muted">Folio</dt>
                <dd className="font-mono font-semibold">{diploma.folio}</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs text-muted">
              Este documento fue emitido por {site.name}. No se genera por tiempo
              transcurrido: requiere evaluación final, speaking y autorización
              académica.
            </p>
          </article>
        ) : (
          <article className="mt-8 rounded-[1.75rem] bg-white p-8">
            <p className="font-semibold text-red-700">Certificado no encontrado</p>
            <p className="mt-2 text-sm text-muted">
              El folio {folio} no corresponde a un diploma emitido por AIL.
            </p>
          </article>
        )}
        <Link href="/" className="mt-8 inline-flex text-sm font-semibold text-cyan">
          Ir al sitio de AIL →
        </Link>
      </div>
    </main>
  );
}
