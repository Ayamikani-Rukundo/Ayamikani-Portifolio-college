-- Run once in the Supabase SQL Editor for an existing portfolio project.
-- Adds a public certificate library with authenticated management and Realtime.
-- Uploaded certificate files use the existing public "portfolio" storage bucket.

begin;

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  issued_on date,
  description text not null default '',
  file_url text not null,
  credential_url text not null default '',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.certificates enable row level security;

drop policy if exists "Public can read certificates" on public.certificates;
create policy "Public can read certificates"
  on public.certificates for select to anon, authenticated using (true);

drop policy if exists "Authenticated users can manage certificates" on public.certificates;
create policy "Authenticated users can manage certificates"
  on public.certificates for all to authenticated using (true) with check (true);

grant select on public.certificates to anon, authenticated;
grant insert, update, delete on public.certificates to authenticated;

insert into storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
values (
  'portfolio',
  'portfolio',
  true,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
  10485760
)
on conflict (id) do update
set public = excluded.public,
    allowed_mime_types = excluded.allowed_mime_types,
    file_size_limit = excluded.file_size_limit;

do $realtime$
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    raise exception 'Supabase Realtime publication is missing. Run schema.sql first.';
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'certificates'
  ) then
    alter publication supabase_realtime add table public.certificates;
  end if;
end
$realtime$;

commit;
