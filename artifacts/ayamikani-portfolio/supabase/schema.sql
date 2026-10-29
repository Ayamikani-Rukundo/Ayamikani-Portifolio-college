-- IMPORTANT: Disable public sign-ups in Supabase under Authentication > Settings.
-- Create the portfolio admin account manually in Authentication > Users.
-- This schema uses only the public anon key and Supabase Row Level Security;
-- never add a service-role key to this application.

create table if not exists public.profile (
  id boolean primary key default true check (id is true),
  full_name text not null default '',
  headline text not null default '',
  short_bio text not null default '',
  long_bio text not null default '',
  location text not null default '',
  timezone text not null default 'Africa/Kigali',
  email text not null default '',
  avatar_url text not null default '',
  about_image_url text not null default '',
  resume_url text not null default ''
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  icon_name text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  description text not null default '',
  tech_stack text[] not null default '{}',
  cover_image_url text,
  live_url text not null default '',
  repo_url text not null default '',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null default '',
  role text not null default '',
  category text not null default 'Other',
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text not null default '',
  image_url text,
  link_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint activities_date_order check (
    start_date is null or end_date is null or end_date >= start_date
  )
);

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

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  image_urls text[] not null default '{}',
  caption text not null default '',
  taken_at date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profile enable row level security;
alter table public.social_links enable row level security;
alter table public.projects enable row level security;
alter table public.activities enable row level security;
alter table public.certificates enable row level security;
alter table public.gallery_items enable row level security;

drop policy if exists "Public can read profile" on public.profile;
create policy "Public can read profile"
  on public.profile for select to anon, authenticated using (true);
drop policy if exists "Authenticated users can manage profile" on public.profile;
create policy "Authenticated users can manage profile"
  on public.profile for all to authenticated using (true) with check (true);

drop policy if exists "Public can read social links" on public.social_links;
create policy "Public can read social links"
  on public.social_links for select to anon, authenticated using (true);
drop policy if exists "Authenticated users can manage social links" on public.social_links;
create policy "Authenticated users can manage social links"
  on public.social_links for all to authenticated using (true) with check (true);

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select to anon, authenticated using (true);
drop policy if exists "Authenticated users can manage projects" on public.projects;
create policy "Authenticated users can manage projects"
  on public.projects for all to authenticated using (true) with check (true);

drop policy if exists "Public can read activities" on public.activities;
create policy "Public can read activities"
  on public.activities for select to anon, authenticated using (true);
drop policy if exists "Authenticated users can manage activities" on public.activities;
create policy "Authenticated users can manage activities"
  on public.activities for all to authenticated using (true) with check (true);
drop policy if exists "Public can read certificates" on public.certificates;
create policy "Public can read certificates"
  on public.certificates for select to anon, authenticated using (true);
drop policy if exists "Authenticated users can manage certificates" on public.certificates;
create policy "Authenticated users can manage certificates"
  on public.certificates for all to authenticated using (true) with check (true);
drop policy if exists "Public can read gallery items" on public.gallery_items;
create policy "Public can read gallery items"
  on public.gallery_items for select to anon, authenticated using (true);
drop policy if exists "Authenticated users can manage gallery items" on public.gallery_items;
create policy "Authenticated users can manage gallery items"
  on public.gallery_items for all to authenticated using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant select on public.profile, public.social_links, public.projects, public.activities
  to anon, authenticated;
grant select on public.certificates to anon, authenticated;
grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.profile, public.social_links, public.projects, public.activities
  to authenticated;
grant insert, update, delete on public.certificates to authenticated;
grant insert, update, delete on public.gallery_items to authenticated;

do $realtime$
declare
  table_name text;
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    raise exception 'Supabase Realtime publication is missing.';
  end if;

  foreach table_name in array array['profile', 'social_links', 'projects', 'activities', 'certificates', 'gallery_items']
  loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end
$realtime$;

insert into public.profile (id)
values (true)
on conflict (id) do nothing;

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

drop policy if exists "Public can view portfolio files" on storage.objects;
create policy "Public can view portfolio files"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio');

drop policy if exists "Authenticated users can upload portfolio files" on storage.objects;
create policy "Authenticated users can upload portfolio files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated users can update portfolio files" on storage.objects;
create policy "Authenticated users can update portfolio files"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio') with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated users can delete portfolio files" on storage.objects;
create policy "Authenticated users can delete portfolio files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio');
