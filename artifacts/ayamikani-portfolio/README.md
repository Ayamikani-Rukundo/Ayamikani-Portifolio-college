# Ayamikani Portfolio

A public portfolio and private admin panel for Ayamikani Rukundo Emmanuel. The app uses Next.js, TypeScript, Tailwind CSS, Framer Motion, and Supabase for Postgres, email/password authentication, and file storage. It does not use Replit Database, Replit Auth, or a service-role key.

## 1. Create a Supabase project

Create a project at Supabase, then open **SQL Editor** in its dashboard. Paste and run [`supabase/schema.sql`](supabase/schema.sql). It creates the empty profile row, portfolio tables, public image bucket, and row-level security policies. You can safely run the script again.

## 2. Create the admin account

In Supabase, turn off public sign-ups under **Authentication → Settings**. Then create the owner account manually under **Authentication → Users**. There is no sign-up page in this app.

## 3. Configure the app

Copy `.env.example` to `.env.local` and fill in the Supabase project URL and anon/publishable key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

`.env.local` is ignored by Git. The app only needs these two values; never add the Supabase service-role key.

## 4. Run locally

From the repository root:

```bash
pnpm install
pnpm --filter @workspace/ayamikani-portfolio run dev
```

Open the URL printed by Next.js. If Supabase is not configured, the app displays a setup screen instead of failing.

## 5. Publish with Vercel

Import the GitHub repository into Vercel and select **Next.js** as the framework. Add the same two environment variables in the Vercel project settings for each environment you use. Build from the repository root with:

```bash
pnpm --filter @workspace/ayamikani-portfolio run build
```

Keep the repository's `pnpm-workspace.yaml` and `pnpm-lock.yaml` at the root so Vercel can resolve workspace dependencies. After deploying, verify the public site and `/admin/login`, then sign in with the manually created Supabase user.

## Content management

Sign in at `/admin/login` to manage the profile, social links, projects, and activities. Uploaded images and the optional resume are stored in Supabase Storage's public `portfolio` bucket. Public content is read through the anon key under RLS and refreshed after admin edits.
