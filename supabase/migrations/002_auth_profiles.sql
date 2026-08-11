-- Perfiles para Supabase Auth.
-- Esta migracion es idempotente: se puede ejecutar mas de una vez.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  phone text,
  interest text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles (id)
);

create index if not exists profiles_role_idx on public.profiles (role);

alter table public.profiles enable row level security;

revoke all on public.profiles from anon;
revoke update on public.profiles from authenticated;
grant select, insert on public.profiles to authenticated;
grant update (name, email, phone, interest) on public.profiles to authenticated;

-- Evita recursion infinita al comprobar si el usuario actual es admin.
create or replace function public.is_profile_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_profile_admin() from public;
grant execute on function public.is_profile_admin() to authenticated;

drop policy if exists "Profiles select own or admin" on public.profiles;
create policy "Profiles select own or admin"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id or public.is_profile_admin());

drop policy if exists "Profiles update own" on public.profiles;
create policy "Profiles update own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Profiles insert own" on public.profiles;
create policy "Profiles insert own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id and role = 'student');

-- Crea el perfil automaticamente. Solo el primer usuario recibe rol admin;
-- nunca se confia en un rol enviado por el navegador.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role text := 'student';
begin
  perform pg_advisory_xact_lock(hashtext('ail_first_profile_role'));

  if not exists (select 1 from public.profiles) then
    assigned_role := 'admin';
  end if;

  insert into public.profiles (id, name, email, phone, interest, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'interest', ''),
    assigned_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Recupera usuarios Auth previos si existieran al aplicar la migracion.
insert into public.profiles (id, name, email, phone, interest, role, created_at)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.email,
  nullif(u.raw_user_meta_data->>'phone', ''),
  nullif(u.raw_user_meta_data->>'interest', ''),
  case
    when row_number() over (order by u.created_at, u.id) = 1 then 'admin'
    else 'student'
  end,
  u.created_at
from auth.users u
where u.email is not null
on conflict (id) do nothing;
