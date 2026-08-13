-- Journey de emails: flags de alumno inscrito y vínculo lead → student.
-- El correo comercial de prospecto usa welcome_email_sent / lead_welcome_email_sent.
-- El correo académico usa student_welcome_email_sent. Son independientes.

alter table public.leads add column if not exists lead_welcome_email_sent boolean not null default false;
alter table public.leads add column if not exists lead_welcome_email_sent_at timestamptz;
alter table public.leads add column if not exists lead_welcome_email_error text;

update public.leads
set lead_welcome_email_sent = welcome_email_sent
where exists (
  select 1 from information_schema.columns
  where table_schema = 'public' and table_name = 'leads' and column_name = 'welcome_email_sent'
)
and lead_welcome_email_sent = false
and welcome_email_sent = true;

alter table public.profiles add column if not exists lead_id uuid;
alter table public.profiles add column if not exists student_welcome_email_sent boolean not null default false;
alter table public.profiles add column if not exists student_welcome_email_sent_at timestamptz;
alter table public.profiles add column if not exists student_welcome_email_error text;

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'leads'
  ) then
    begin
      alter table public.profiles
        drop constraint if exists profiles_lead_id_fkey;
      alter table public.profiles
        add constraint profiles_lead_id_fkey
        foreign key (lead_id) references public.leads (id) on delete set null;
    exception
      when others then
        null;
    end;
  end if;
end $$;

create index if not exists profiles_lead_id_idx on public.profiles (lead_id);
