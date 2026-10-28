import { getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PublicFrame, SetupNeeded } from "@/components/site";
import ProjectsBrowser from "@/components/projects-browser";

export default async function ProjectsPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const { profile, projects, socialLinks } = await getPortfolioContent();
  return <PublicFrame path="/projects" socialLinks={socialLinks} avatarUrl={profile?.avatar_url}>
    <div className="shell page-hero"><div><div className="eyebrow">An open workbench</div><h1 className="page-title">Projects<br/><em className="serif">in practice.</em></h1></div><p className="page-lede">Things I’ve made, questions I’ve followed, and ideas still getting their shape. The process matters as much as the polish.</p></div>
    <section className="shell section projects-section" style={{paddingTop:10}}>
      <ProjectsBrowser projects={projects} />
    </section>
  </PublicFrame>;
}
