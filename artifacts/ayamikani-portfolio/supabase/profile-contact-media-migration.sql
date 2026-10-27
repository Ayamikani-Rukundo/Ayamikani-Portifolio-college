-- Run once in the Supabase SQL Editor for an existing portfolio project.
-- Adds a separate About-page portrait and the editable time zone field, then
-- fills contact details and social links shown in the supplied media list.
-- Existing non-empty profile fields and matching social links are preserved.

begin;

alter table public.profile
  add column if not exists timezone text not null default 'Africa/Kigali',
  add column if not exists about_image_url text not null default '';

update public.profile
set email = case
      when nullif(btrim(email), '') is null then 'ayamikani.rukundo@gmail.com'
      else email
    end,
    location = case
      when nullif(btrim(location), '') is null or btrim(location) = 'Rwanda'
        then 'Eastern Province, Rwanda'
      else location
    end,
    timezone = case
      when nullif(btrim(timezone), '') is null then 'Africa/Kigali'
      else timezone
    end
where id is true;

insert into public.social_links (label, url, icon_name, sort_order)
select seed.label, seed.url, seed.icon_name, seed.sort_order
from (
  values
    ('LinkedIn', 'https://www.linkedin.com/in/ayamikani-rukundo-1595b134a', 'linkedin', 0),
    ('Instagram', 'https://www.instagram.com/ayamikani_rukundo', 'instagram', 1),
    ('Facebook', 'https://www.facebook.com/ayamikani', 'facebook', 2),
    ('X', 'https://x.com/Ayamikani_R', 'x', 3)
) as seed(label, url, icon_name, sort_order)
where not exists (
  select 1
  from public.social_links as existing
  where existing.url = seed.url
);

commit;
