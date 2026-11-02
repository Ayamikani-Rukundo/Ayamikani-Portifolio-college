-- Run once in the Supabase SQL Editor for an existing portfolio project.
-- Stores page views without IP addresses or browser fingerprints.

begin;

create table if not exists public.site_analytics_events (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  path text not null check (
    char_length(path) between 1 and 200
    and path like '/%'
    and path not like '//%'
    and path not like '/admin%'
    and path not like '/api%'
  ),
  country text check (country is null or char_length(country) <= 80),
  region text check (region is null or char_length(region) <= 80),
  city text check (city is null or char_length(city) <= 80),
  visited_at timestamptz not null default now()
);

create index if not exists site_analytics_events_visited_at_idx
  on public.site_analytics_events (visited_at desc);
create index if not exists site_analytics_events_session_visited_at_idx
  on public.site_analytics_events (session_id, visited_at desc);

alter table public.site_analytics_events enable row level security;

drop policy if exists "Anonymous visitors can record page views" on public.site_analytics_events;
create policy "Anonymous visitors can record page views"
  on public.site_analytics_events for insert to anon
  with check (true);

drop policy if exists "Authenticated users can read analytics" on public.site_analytics_events;
create policy "Authenticated users can read analytics"
  on public.site_analytics_events for select to authenticated
  using (auth.uid() is not null);

drop policy if exists "Authenticated users can prune analytics" on public.site_analytics_events;
create policy "Authenticated users can prune analytics"
  on public.site_analytics_events for delete to authenticated
  using (auth.uid() is not null);

grant insert on public.site_analytics_events to anon;
grant select, delete on public.site_analytics_events to authenticated;
grant usage, select on sequence public.site_analytics_events_id_seq to anon, authenticated;

commit;