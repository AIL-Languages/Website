-- A-Inman Languages — schema inicial para Auth + perfiles + leads
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  phone text,
  interest text,
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles (id)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  interest text,
  goals text,
  availability text,
  source text not null default 'website-contact'
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.profiles enable row level security;
alter table public.leads enable row level security;

-- Profiles: cada usuario ve/edita su perfil; admins ven todos
drop policy if exists "Profiles select own or admin" on public.profiles;
create policy "Profiles select own or admin"
  on public.profiles
  for select
  to authenticated
  using (
    auth.uid() = id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

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
  with check (auth.uid() = id);

-- Leads: inserción pública (formulario web) + lectura solo admin
drop policy if exists "Leads insert anon" on public.leads;
create policy "Leads insert anon"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Leads select admin" on public.leads;
create policy "Leads select admin"
  on public.leads
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Crear perfil automáticamente al registrarse.
-- Único admin: ainman.languages@gmail.com
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role text := coalesce(new.raw_user_meta_data->>'role', 'student');
begin
  if lower(new.email) = 'ainman.languages@gmail.com' then
    assigned_role := 'admin';
  elsif assigned_role not in ('teacher', 'student') then
    assigned_role := 'student';
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
