-- Único administrador: ainman.languages@gmail.com
-- Ejecutar en Supabase → SQL Editor si el proyecto ya tiene 001_init aplicado.

create or replace function public.role_for_email(user_email text)
returns text
language sql
immutable
as $$
  select case
    when lower(trim(user_email)) = 'ainman.languages@gmail.com' then 'admin'
    else 'student'
  end;
$$;

create or replace function public.enforce_sole_admin()
returns trigger
language plpgsql
as $$
begin
  new.role := public.role_for_email(new.email);
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
  insert into public.profiles (id, name, email, phone, interest, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'interest', ''),
    public.role_for_email(new.email)
  )
  on conflict (id) do update
    set
      email = excluded.email,
      role = public.role_for_email(excluded.email);

  return new;
end;
$$;

update public.profiles
set role = public.role_for_email(email);
