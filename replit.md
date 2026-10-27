# Ayamikani Portfolio

A public personal portfolio and private admin CMS for Ayamikani Rukundo Emmanuel, powered by Supabase.

## Run & Operate

- `pnpm --filter @workspace/ayamikani-portfolio run dev` — run the Next.js portfolio
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required app env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Supabase schema source: `artifacts/ayamikani-portfolio/supabase/schema.sql`

## Stack

- pnpm workspace, Node.js 24, TypeScript
- Web: Next.js App Router, Tailwind CSS, Framer Motion
- Auth, database, and file storage: Supabase only

## Where things live

- `artifacts/ayamikani-portfolio/src/app/` — public routes and admin routes
- `artifacts/ayamikani-portfolio/src/lib/supabase/` — Supabase clients, queries, types, and write helpers
- `artifacts/ayamikani-portfolio/supabase/schema.sql` — idempotent schema and RLS policies
- `artifacts/ayamikani-portfolio/README.md` — setup and Vercel deployment

## Architecture decisions

- Supabase is the only app data/auth/storage provider; do not add Replit Database or Replit Auth.
- The public anon key is the only Supabase key used by the app. RLS gates all writes.
- Portfolio content intentionally starts empty.

## Product

Public portfolio pages and a password-protected admin CMS for profile, links, projects, and activities.

## User preferences

- Do not hardcode real projects, activities, or awards; the owner adds them in the admin.
- Do not use a service-role key or public sign-up.

## Gotchas

- Run the Supabase SQL file in the Supabase SQL Editor before using authenticated data management.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
