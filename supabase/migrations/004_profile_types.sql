-- Roles ampliados y detalles académicos dinámicos
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('student', 'teacher', 'coordinator', 'company', 'admin'));

alter table public.profiles
  add column if not exists details jsonb not null default '{}'::jsonb;

create or replace function public.resolve_profile_role(user_email text, requested text)
returns text
language sql
immutable
as $$
  select case
    when lower(trim(user_email)) = 'ainman.languages@gmail.com' then 'admin'
    when requested in ('teacher', 'coordinator', 'company', 'student') then requested
    else 'student'
  end;
$$;

create or replace function public.enforce_sole_admin()
returns trigger
language plpgsql
as $$
begin
  new.role := public.resolve_profile_role(new.email, new.role);
  return new;
end;
$$;

drop trigger if exists profiles_enforce_sole_admin on public.profiles;
create trigger profiles_enforce_sole_admin
  before insert or update on public.profiles
  for each row execute function public.enforce_sole_admin();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone, interest, role, details)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'interest', ''),
    public.resolve_profile_role(new.email, new.raw_user_meta_data->>'role'),
    coalesce(new.raw_user_meta_data->'details', '{}'::jsonb)
  )
  on conflict (id) do update
    set
      email = excluded.email,
      phone = excluded.phone,
      interest = excluded.interest,
      role = public.resolve_profile_role(excluded.email, excluded.role),
      details = excluded.details;

  return new;
end;
$$;
