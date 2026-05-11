create table if not exists public.app_records (
  owner_key text not null,
  data_key text not null,
  data jsonb not null default 'null'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (owner_key, data_key)
);

alter table public.app_records enable row level security;

drop policy if exists "No direct read access to app records" on public.app_records;
drop policy if exists "No direct create access to app records" on public.app_records;
drop policy if exists "No direct edit access to app records" on public.app_records;
drop policy if exists "No direct delete access to app records" on public.app_records;

create policy "No direct read access to app records"
on public.app_records for select to anon, authenticated using (false);

create policy "No direct create access to app records"
on public.app_records for insert to anon, authenticated with check (false);

create policy "No direct edit access to app records"
on public.app_records for update to anon, authenticated using (false) with check (false);

create policy "No direct delete access to app records"
on public.app_records for delete to anon, authenticated using (false);

create or replace function public.update_app_records_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_app_records_updated_at on public.app_records;
create trigger trg_app_records_updated_at
before update on public.app_records
for each row execute function public.update_app_records_updated_at();