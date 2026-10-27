-- Run once in the Supabase SQL Editor for an existing portfolio project.
-- Adds a public photo gallery with authenticated management and Realtime.
-- Photos use the existing public "portfolio" storage bucket.

begin;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text not null default '',
  taken_at date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery_items enable row level security;

drop policy if exists "Public can read gallery items" on public.gallery_items;
create policy "Public can read gallery items"
  on public.gallery_items for select to anon, authenticated using (true);

drop policy if exists "Authenticated users can manage gallery items" on public.gallery_items;
create policy "Authenticated users can manage gallery items"
  on public.gallery_items for all to authenticated using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.gallery_items to authenticated;

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
      and tablename = 'gallery_items'
  ) then
    alter publication supabase_realtime add table public.gallery_items;
  end if;
end
$realtime$;

commit;
