# A-Inman Languages — Sitio web

Sitio profesional de A-Inman Languages (Next.js + TypeScript) conectado a **Supabase** (Auth + Postgres).

## Desarrollo

1. Copia `.env.example` a `.env.local` y completa las claves de Supabase.
2. En Supabase → **SQL Editor**, ejecuta en orden `001_init.sql`, `002_sole_admin.sql` y `003_teacher_role.sql`.
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

Proyecto Supabase: `bnxhxkpqbstgzxlzwuii` (`https://bnxhxkpqbstgzxlzwuii.supabase.co`).

## Autenticación y dashboard

- Registro público: `/registro` (Supabase Auth)
- Inicio de sesión: `/iniciar-sesion`
- Dashboard protegido: `/dashboard`
- El **único administrador** es `ainman.languages@gmail.com`. Cualquier otra cuenta es estudiante.
- La administradora puede crear estudiantes con `SUPABASE_SERVICE_ROLE_KEY`.
- Contacto guarda leads en la tabla `leads` de Supabase.

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — producción
- `npm start` — servir build
- `npm run lint` — ESLint
