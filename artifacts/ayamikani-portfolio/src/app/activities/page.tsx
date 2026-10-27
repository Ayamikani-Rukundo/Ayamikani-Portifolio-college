import { getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PublicFrame, SetupNeeded } from "@/components/site";
import ActivitiesBrowser from "@/components/activities-browser";

export default async function ActivitiesPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const { activities, socialLinks } = await getPortfolioContent();
  return <PublicFrame path="/activities" socialLinks={socialLinks}>
    <div className="shell page-hero"><div><div className="eyebrow">Learning with others</div><h1 className="page-title">A life of<br/><em className="serif">showing up.</em></h1></div><p className="page-lede">The rooms I’ve learned in, the people I’ve worked alongside, and the parts of a community I’ve helped hold together.</p></div>
    <section className="shell section" style={{paddingTop:12}}><ActivitiesBrowser activities={activities}/></section>
  </PublicFrame>;
}
