import { getPortfolioProfile, getPortfolioSocialLinks } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminShell } from "@/components/admin-shell";
import { SetupNeeded } from "@/components/site";
import ContentManager from "@/components/content-manager";

export default async function AdminSocialLinksPage({searchParams}:{searchParams:Promise<{new?:string}>}){
  if(!isSupabaseConfigured)return <SetupNeeded/>;
  const [profile,socialLinks,query]=await Promise.all([getPortfolioProfile(),getPortfolioSocialLinks(),searchParams]);
  return <AdminShell path="/admin/social-links" avatarUrl={profile?.avatar_url}><ContentManager resource="social-links" initial={socialLinks} startOpen={query.new==="1"}/></AdminShell>;
}
