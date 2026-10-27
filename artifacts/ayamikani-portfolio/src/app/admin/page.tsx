import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminPageHeading, AdminShell } from "@/components/admin-shell";
import { SetupNeeded } from "@/components/site";

export default async function AdminDashboard() {
  if(!isSupabaseConfigured)return <SetupNeeded/>;
  const {profile,socialLinks,projects,activities}=await getPortfolioContent();
  return <AdminShell path="/admin"><div className="admin-content">
    <AdminPageHeading eyebrow="Your portfolio, at a glance" title={`Good to have you, ${profile?.full_name?.split(" ")[0]||"Ayamikani"}.`} description="A quiet place to keep the public story current. Every save is reflected on the portfolio."/>
    <div className="admin-grid"><div className="stat"><b>{projects.length.toString().padStart(2,"0")}</b><span>Projects</span></div><div className="stat"><b>{activities.length.toString().padStart(2,"0")}</b><span>Activities</span></div><div className="stat"><b>{socialLinks.length.toString().padStart(2,"0")}</b><span>Social links</span></div></div>
    <section className="admin-card"><div className="eyebrow">Quick add</div><h2 style={{font:"600 25px var(--serif)"}}>What would you like to add?</h2><div className="quick-actions"><Link className="button" href="/admin/projects?new=1">Project <ArrowUpRight size={14}/></Link><Link className="button" href="/admin/activities?new=1">Activity <ArrowUpRight size={14}/></Link><Link className="button" href="/admin/social-links?new=1">Social link <ArrowUpRight size={14}/></Link></div></section>
    <section className="admin-card"><div className="eyebrow">Portfolio profile</div><h2 style={{font:"600 25px var(--serif)"}}>{profile?.headline||"Your headline is waiting."}</h2><p className="admin-subtitle">{profile?.short_bio||"Add a few words about what you care about and what you’re building."}</p><Link href="/admin/profile" className="button">Edit profile <ArrowUpRight size={14}/></Link></section>
    <div style={{display:"flex",justifyContent:"space-between",gap:20,flexWrap:"wrap"}}>{[["Projects",projects.length,"/admin/projects"],["Activities",activities.length,"/admin/activities"],["Social links",socialLinks.length,"/admin/social-links"]].map(([label,count,href])=><Link key={String(label)} href={String(href)} className="button">{String(label)} · {String(count)} <ArrowUpRight size={14}/></Link>)}</div>
  </div></AdminShell>;
}
