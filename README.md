# A-Inman Languages — Sitio web

Sitio profesional de A-Inman Languages (Next.js + TypeScript) conectado a **Supabase** (Auth + Postgres).

## Desarrollo

1. Copia `.env.example` a `.env.local` y completa las claves de Supabase.
2. En Supabase → **SQL Editor**, ejecuta en orden las migraciones de `supabase/migrations/` (`001` … `006`).
3. En Supabase → **Authentication → Providers → Email**, desactiva temporalmente “Confirm email” si quieres registro inmediato en desarrollo.
4. Arranca el proyecto:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Dónde obtenerla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Connect → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Connect → Publishable key **o** Settings → API → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → `service_role` (secreta, solo servidor) |
| `RESEND_API_KEY` o `EMAIL_API_KEY` | [Resend](https://resend.com/api-keys) → API Keys (solo servidor) |
| `RESEND_FROM` o `EMAIL_FROM` | Remitente verificado, p. ej. `A-Inman Languages <xavier.y@example.org>` |
| `CONTACT_INBOX_EMAIL` | Buzón interno de nuevos leads (`ainman.languages@gmail.com`) |
| `PUBLIC_SITE_URL` | Dominio público para CTAs de correo (no usar URL de staging) |

Proyecto Supabase: `bnxhxkpqbstgzxlzwuii` (`https://bnxhxkpqbstgzxlzwuii.supabase.co`).

## Autenticación y dashboard

- Registro público: `/registro` (Supabase Auth)
- Inicio de sesión: `/iniciar-sesion`
- Dashboard protegido: `/dashboard`
- El **único administrador** es `ainman.languages@gmail.com`. Cualquier otra cuenta es estudiante.
- La administradora puede crear estudiantes con `SUPABASE_SERVICE_ROLE_KEY`.
- Contacto registra el lead en `leads` y dispara **solo** el correo comercial (`lead_created`). No envía onboarding académico.
- Alumno inscrito: el correo académico (`student_enrolled`) se envía al crear el alumno desde el dashboard o al pasar `enrollmentStatus` a `active`. No reenvía el correo de prospecto.
- `/dashboard/correos` separa prospecto, alumno inscrito y plantillas de equipo.

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — producción
- `npm start` — servir build
- `npm run lint` — ESLint
- `npm test` — tests del journey de emails (prospecto vs alumno)
