-- Leads: estado inicial, origen y seguimiento del correo de bienvenida al prospecto.
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- No afecta la bienvenida académica de alumnos inscritos.

alter table public.leads add column if not exists status text not null default 'new';
alter table public.leads add column if not exists company text;
alter table public.leads add column if not exists request_id text;
alter table public.leads add column if not exists welcome_email_sent boolean not null default false;
alter table public.leads add column if not exists welcome_email_sent_at timestamptz;
alter table public.leads add column if not exists welcome_email_error text;
alter table public.leads add column if not exists lead_welcome_email_sent boolean not null default false;
alter table public.leads add column if not exists lead_welcome_email_sent_at timestamptz;
alter table public.leads add column if not exists lead_welcome_email_error text;

-- Si el proyecto usa columnas en español, alinea name/phone/interest/source.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'leads' and column_name = 'nombre'
  ) then
    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'name'
    ) then
      alter table public.leads add column name text;
      update public.leads set name = nombre where name is null;
    end if;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'leads' and column_name = 'telefono'
  ) then
    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'leads' and column_name = 'phone'
    ) then
      alter table public.leads add column phone text;
      update public.leads set phone = telefono where phone is null;
    end if;
  end if;
end $$;

create unique index if not exists leads_request_id_uidx
  on public.leads (request_id)
  where request_id is not null;

create index if not exists leads_email_created_idx
  on public.leads (email, created_at desc);
