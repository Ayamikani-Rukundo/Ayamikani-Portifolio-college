import { getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminPageHeading, AdminShell } from "@/components/admin-shell";
import { SetupNeeded } from "@/components/site";
import ProfileEditor from "@/components/profile-editor";

export default async function AdminProfilePage(){
  if(!isSupabaseConfigured)return <SetupNeeded/>;
  const {profile}=await getPortfolioContent();
  return <AdminShell path="/admin/profile"><div className="admin-content"><AdminPageHeading eyebrow="The story behind the work" title="Profile" description="A little context goes a long way. Keep your public introduction honest and current."/><section className="admin-card"><ProfileEditor profile={profile}/></section></div></AdminShell>;
}
