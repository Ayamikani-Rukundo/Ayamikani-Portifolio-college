import { getPortfolioActivities, getPortfolioProfile } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminShell } from "@/components/admin-shell";
import { SetupNeeded } from "@/components/site";
import ContentManager from "@/components/content-manager";

export default async function AdminActivitiesPage({searchParams}:{searchParams:Promise<{new?:string}>}){
  if(!isSupabaseConfigured)return <SetupNeeded/>;
  const [profile,activities,query]=await Promise.all([getPortfolioProfile(),getPortfolioActivities(),searchParams]);
  return <AdminShell path="/admin/activities" avatarUrl={profile?.avatar_url}><ContentManager resource="activities" initial={activities} startOpen={query.new==="1"}/></AdminShell>;
}
