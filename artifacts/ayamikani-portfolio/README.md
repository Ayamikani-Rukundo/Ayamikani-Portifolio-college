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

## 4. Run locally on Windows

Open **Command Prompt** and run these commands from the repository root (the folder containing `pnpm-workspace.yaml`):

```cmd
cd /d "C:\Users\rukun\OneDrive\Documents\Codes\Ayamikani-Portfolio-CMS"
pnpm.cmd install --filter @workspace/ayamikani-portfolio...
if not exist artifacts\ayamikani-portfolio\.env.local copy artifacts\ayamikani-portfolio\.env.example artifacts\ayamikani-portfolio\.env.local
notepad artifacts\ayamikani-portfolio\.env.local
pnpm.cmd --filter @workspace/ayamikani-portfolio run dev
```

In Notepad, replace the empty values for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your Supabase project URL and anon/publishable key, then save the file. If you have not configured Supabase yet, leave them empty; the app displays a setup screen instead of crashing. Open **http://localhost:3000** in your browser after the dev command starts. The server also binds to `0.0.0.0` for preview access. Keep this Command Prompt window open while you use the site; press **Ctrl+C** to stop the server.

If you use PowerShell instead, use `pnpm.cmd` as shown (rather than `pnpm`) to avoid PowerShell execution-policy issues with the `pnpm.ps1` shim.

## 5. Publish with Vercel

Import the GitHub repository into Vercel and select **Next.js** as the framework. Add the same two environment variables in the Vercel project settings for each environment you use. Build from the repository root with:

```bash
pnpm --filter @workspace/ayamikani-portfolio run build
```

Keep the repository's `pnpm-workspace.yaml` and `pnpm-lock.yaml` at the root so Vercel can resolve workspace dependencies. After deploying, verify the public site and `/admin/login`, then sign in with the manually created Supabase user.

## Content management

Sign in at `/admin/login` to manage the profile, social links, projects, and activities. Uploaded images and the optional resume are stored in Supabase Storage's public `portfolio` bucket. Public content is read through the anon key under RLS and refreshed after admin edits.

The site starts in dark mode. Use the theme control in the public navigation or admin header to switch to light mode; the choice is saved in the current browser.

On the first full page visit in a browser session, a short animated opening screen appears once. Moving between pages does not replay it. Use the **Admin** button in the header to open the private sign-in page. Once an avatar is uploaded and saved in the admin profile, it replaces the initials mark in the public header/footer and admin workspace.
