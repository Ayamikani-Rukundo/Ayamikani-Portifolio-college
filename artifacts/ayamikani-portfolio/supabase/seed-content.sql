-- Run after schema.sql in the Supabase SQL Editor.
-- Adds public portfolio content only. Contact details and image URLs are
-- intentionally omitted; add those yourself when you are ready.
-- Safe to rerun: existing profile fields are preserved and existing entries
-- are not overwritten.

begin;

insert into public.profile (
  id,
  full_name,
  headline,
  short_bio,
  long_bio,
  location
)
values (
  true,
  'Ayamikani Rukundo Emmanuel',
  'Rwandan student developer · robotics mentor · community-minded builder',
  'I am a Rwandan student developer and robotics mentor who builds practical software for real needs. I enjoy turning complex ideas into useful products—and helping other young people learn to build, too.',
  $$I am a student at Bridge2Rwanda/Isomo Academy in Rwanda, learning computer science by building for real people. I work across frontend and backend development, UI/UX, Python, Java, JavaScript, React, Node.js, and PostgreSQL—choosing tools to fit the problem.

I have co-built digital products for insurance comparison and career guidance, and developed systems for attendance, parking, and utility-token management. Beyond coding, I lead robotics teams, teach younger students and international learners, and contribute to community-focused AI and data work.

The thread through all of it is practical, collaborative problem-solving: build something useful, listen to the people who will use it, and help others gain the skills and confidence to make things too.$$,
  'Rwanda'
)
on conflict (id) do update
set full_name = coalesce(nullif(btrim(profile.full_name), ''), excluded.full_name),
    headline = coalesce(nullif(btrim(profile.headline), ''), excluded.headline),
    short_bio = coalesce(nullif(btrim(profile.short_bio), ''), excluded.short_bio),
    long_bio = coalesce(nullif(btrim(profile.long_bio), ''), excluded.long_bio),
    location = coalesce(nullif(btrim(profile.location), ''), excluded.location);

insert into public.projects (
  title,
  slug,
  summary,
  description,
  tech_stack,
  repo_url,
  featured,
  sort_order
)
values
  (
    'CoverSoko',
    'coversoko',
    'An insurance-technology MVP for comparing insurance options online.',
    'I co-built CoverSoko and led its frontend and UI/UX design, shaping an experience for comparing insurance quotes. Our team presented the product in a national pitch competition; the platform was later acquired and developed further.',
    '{}',
    '',
    true,
    0
  ),
  (
    'INZIRA AI',
    'inzira-ai',
    'A team-built AI career-guidance platform designed to help people navigate career pathways.',
    'As part of a team, I helped develop INZIRA AI, a platform intended to help people make informed career decisions and avoid dropping out of their career paths. The project earned second place in a national AI competition.',
    '{}',
    '',
    true,
    1
  ),
  (
    'Nyagatare Seventh-day Adventist Attendance System',
    'nyagatare-sda-attendance-system',
    'A church attendance application that replaces manual tracking with a digital workflow.',
    'I built a React-based attendance system for church administrators and connected it to PostgreSQL. The project digitized attendance records and improved tracking accuracy by approximately 40%.',
    array['React', 'PostgreSQL'],
    '',
    true,
    2
  ),
  (
    'Path Finder',
    'path-finder',
    'An AI career platform built with an international team during an entrepreneurship fellowship.',
    'During the Yale Entrepreneurial Society AI/ML fellowship, I led a three-person international team as project lead, backend developer, and designer. We developed Path Finder as an AI-supported career platform.',
    '{}',
    '',
    false,
    3
  ),
  (
    'Parking Management System',
    'parking-management-system',
    'A software system for organizing parking allocation and tracking available spaces.',
    'I designed and developed a Node.js parking-management system with real-time tracking of available spaces and REST APIs for communication with external services.',
    array['Node.js', 'REST APIs'],
    '',
    false,
    4
  ),
  (
    'EUCL Token Management System',
    'eucl-token-management-system',
    'A utility-token management project built as part of my independent software work.',
    'I developed a utility-token management system as one of several independent software projects focused on practical operational needs.',
    '{}',
    '',
    false,
    5
  ),
  (
    'Solar-Powered Water Purification',
    'solar-water-purification',
    'A science-club project exploring solar energy and practical water purification.',
    'As a student researcher and team member, I helped develop a solar-powered water purification system, applying physics, engineering, and problem-solving to a practical water-access challenge.',
    '{}',
    '',
    false,
    6
  ),
  (
    'Career Compass MVP',
    'career-compass-mvp',
    'A responsive career-assessment prototype that collects structured career preferences.',
    'A web-based career assessment MVP designed to collect career-preference responses and send them to a connected Google Sheet for analysis.',
    array['TypeScript', 'Google Sheets'],
    'https://github.com/Ayamikani-Rukundo/career-compass-mvp',
    false,
    7
  ),
  (
    'Campus Church Connect',
    'campus-church-connect',
    'A full-stack campus church website for sharing community information and resources.',
    'A church web application with gallery, leadership, announcements, about, and resource pages. Its documented stack includes a React and Tailwind CSS frontend with a Node.js and Express backend and MongoDB.',
    array['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    'https://github.com/Ayamikani-Rukundo/church-management-system',
    false,
    8
  ),
  (
    'GWIZA Research',
    'gwiza-research',
    'A mobile-first action-research platform about secondary-school student well-being and support in Rwanda.',
    'A research-data platform designed with privacy in mind. Its documentation says participants are not asked for personal names or contact details; a school name is collected for authorized research administrators. The project is for research, not diagnosis, treatment, or mental-health services.',
    array['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Express', 'Supabase', 'PostgreSQL'],
    'https://github.com/Ayamikani-Rukundo/GWIZA-ISOMO',
    false,
    9
  )
on conflict (slug) do nothing;

with seed (
  title,
  organization,
  role,
  category,
  start_date,
  end_date,
  is_current,
  description,
  featured,
  sort_order
) as (
  values
    (
      'CoverSoko',
      'CoverSoko',
      'Founding Frontend Developer & UI/UX Designer',
      'Coding',
      date '2026-03-01',
      date '2026-05-01',
      false,
      'Co-built an insurance-technology MVP and led frontend and UI/UX design for insurance quote comparisons. The platform was later acquired and developed further.',
      true,
      0
    ),
    (
      'Independent Software Development',
      'Independent Projects',
      'Full-Stack Developer',
      'Coding',
      date '2025-02-01',
      date '2026-03-01',
      false,
      'Built practical software projects including parking, church attendance, and utility-token systems. Project work used tools such as Node.js, React, Java, APIs, and PostgreSQL.',
      false,
      1
    ),
    (
      'FIRST LEGO League Robotics',
      'FIRST LEGO League / Coderina Rwanda',
      'Team Leader & Robot Programmer',
      'Robotics',
      null,
      null,
      false,
      'Competed for three seasons and led the team in the last two. Built and programmed robots, researched solutions, and presented projects through Rwanda’s FIRST LEGO League pathway.',
      true,
      2
    ),
    (
      'Yale Entrepreneurial Society AI/ML Fellowship',
      'Yale Entrepreneurial Society',
      'Project Team Leader, Backend Developer & Designer',
      'Entrepreneurship',
      date '2026-02-07',
      date '2026-04-11',
      false,
      'Led a three-person international team in an eight-week AI/ML cohort and helped build Path Finder, an AI-supported career platform.',
      false,
      3
    ),
    (
      'Full-Stack Development Mentorship',
      'High School Science & Computing Club',
      'Student Instructor & Mentor',
      'Coding',
      null,
      null,
      false,
      'Taught full-stack web development to senior students and mentored peers building and maintaining school software and other projects during the 2025–2026 school year.',
      false,
      4
    ),
    (
      'Debate Club & Competitions',
      'iDebate',
      'Co-Leader & Second Speaker',
      'Leadership',
      null,
      null,
      false,
      'Debated for three years, co-led the club in senior school, and helped teams compete in district and provincial competitions.',
      false,
      5
    ),
    (
      'Wavumbuzi Challenge',
      'Wavumbuzi Challenge Rwanda',
      'Participant & Strategy Pitcher',
      'Entrepreneurship',
      null,
      null,
      false,
      'Developed and pitched business ideas across three years, modeled startup concepts, ranked 11th nationally in 2025, and won a weekly challenge award.',
      false,
      6
    ),
    (
      'Community Technology, Data & Monitoring',
      'Heart of Sympathy',
      'IT, Data & Monitoring and Evaluation Officer',
      'Community Service',
      date '2026-09-01',
      null,
      true,
      'Support community programs through IT systems, organized digital records, data collection, and monitoring and evaluation.',
      true,
      7
    ),
    (
      'Isomo December Challenge',
      'Isomo Academy',
      'Communications Lead',
      'Community Service',
      date '2024-12-01',
      date '2025-12-01',
      false,
      'Led communications for a three-person team across two community challenges and helped coordinate practical support for local people.',
      false,
      8
    ),
    (
      'Solar Water Purification Research',
      'Science Club',
      'Student Researcher & Team Member',
      'Science',
      null,
      null,
      false,
      'Helped develop a solar-powered water purification system during science-club work in 2024 and 2025.',
      false,
      9
    ),
    (
      'Student Business Pitch Competitions',
      'NESA / Educate',
      'Participant & Pitcher',
      'Entrepreneurship',
      null,
      null,
      false,
      'Developed and pitched business ideas in student competitions, earning provincial recognition and contributing to an award-winning team.',
      false,
      10
    ),
    (
      'AI in STEM Global Network',
      'AI in STEM',
      'International Ambassador for Rwanda',
      'Coding',
      date '2026-02-01',
      null,
      true,
      'Represent Rwanda in an international AI-in-STEM network, organize local learning sessions, contribute to workshop and curriculum preparation, and connect Rwandan learners with global peers.',
      true,
      11
    ),
    (
      'Global Python Classes',
      'AI/ML Learning Community',
      'Python Instructor & Mentor',
      'Coding',
      null,
      null,
      true,
      'Teach virtual Python classes to students from 25 countries, explain programming concepts, guide projects, and support learners as they build technical skills.',
      false,
      12
    ),
    (
      'Robotics & AI Hackathon Coaching',
      'Robotics & AI Competitions',
      'National-Level Coach & Mentor',
      'Robotics',
      date '2026-01-01',
      null,
      true,
      'Coach youth teams in robotics and AI competitions, mentoring students from Nyagatare schools as they progress through provincial and national events.',
      false,
      13
    ),
    (
      'Agricultural Operations & Inventory',
      'Nyamiyaga Agrodealers',
      'Stock Manager',
      'Other',
      date '2026-10-01',
      null,
      true,
      'Manage inventory and data records for an agricultural business, monitor supplies, and support day-to-day operational decisions.',
      false,
      14
    ),
    (
      'John C. Maxwell iLead Program',
      'iLead',
      'Regional School Coordinator',
      'Leadership',
      null,
      null,
      false,
      'Coordinated school leadership activities, shared learning resources, connected students with regional leaders, and facilitated free peer-learning courses.',
      false,
      15
    ),
    (
      'International FIRST LEGO League Placement',
      'FIRST LEGO League',
      'Team Member',
      'Awards',
      null,
      null,
      false,
      'Earned fourth place internationally with the team.',
      false,
      16
    ),
    (
      'Rising All-Star Golden LEGO Kit Trophy',
      'FIRST LEGO League / AI Hackathon',
      'Team Award',
      'Awards',
      null,
      null,
      false,
      'Received the Rising All-Star Golden LEGO Kit Trophy as a team recognition.',
      false,
      17
    ),
    (
      'Second Place, District O-Level National Examinations',
      'Rwanda National Examinations',
      'Academic Recognition',
      'Awards',
      null,
      null,
      false,
      'Ranked second among 4,383 students in district-level O-Level national examinations in 2023–2024.',
      false,
      18
    ),
    (
      'Academic Excellence Award',
      'Isomo Academy',
      'First in Class',
      'Awards',
      null,
      null,
      false,
      'Earned first-in-class academic recognition for three consecutive years (grades 10, 11, and 12).',
      false,
      19
    ),
    (
      'Bronze Medal & Outstanding Award, Business Pitch',
      'NESA / Educate',
      'Team Award',
      'Awards',
      null,
      null,
      false,
      'Received a Bronze Medal and Outstanding Award at a provincial student business pitch competition; the team earned a 300,000 RWF prize.',
      false,
      20
    ),
    (
      'Second Best Speaker, District Debate Competition',
      'iDebate',
      'Second Best Speaker',
      'Awards',
      null,
      null,
      false,
      'Recognized as second best speaker and received a silver medal and certificate of recognition.',
      false,
      21
    ),
    (
      'Wavumbuzi National Ranking & Weekly Challenge Award',
      'Wavumbuzi Challenge Rwanda',
      'National Finalist',
      'Awards',
      null,
      null,
      false,
      'Ranked 11th nationally in 2025 and won a weekly challenge award.',
      false,
      22
    )
)
insert into public.activities (
  title,
  organization,
  role,
  category,
  start_date,
  end_date,
  is_current,
  description,
  featured,
  sort_order
)
select
  seed.title,
  seed.organization,
  seed.role,
  seed.category,
  seed.start_date,
  seed.end_date,
  seed.is_current,
  seed.description,
  seed.featured,
  seed.sort_order
from seed
where not exists (
  select 1
  from public.activities as existing
  where existing.title = seed.title
    and existing.organization = seed.organization
    and existing.role = seed.role
    and existing.category = seed.category
);

do $realtime$
declare
  table_name text;
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    raise exception 'Supabase Realtime publication is missing. Run schema.sql first.';
  end if;

  foreach table_name in array array['profile', 'social_links', 'projects', 'activities']
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

commit;
