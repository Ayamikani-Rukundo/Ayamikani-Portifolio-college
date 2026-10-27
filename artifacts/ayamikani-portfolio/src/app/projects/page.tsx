import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PublicFrame, SetupNeeded } from "@/components/site";
import PortfolioImage from "@/components/portfolio-image";

export default async function ProjectsPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const { projects, socialLinks } = await getPortfolioContent();
  return <PublicFrame path="/projects" socialLinks={socialLinks}>
    <div className="shell page-hero"><div><div className="eyebrow">An open workbench</div><h1 className="page-title">Projects<br/><em className="serif">in practice.</em></h1></div><p className="page-lede">Things I’ve made, questions I’ve followed, and ideas still getting their shape. The process matters as much as the polish.</p></div>
    <section className="shell section" style={{paddingTop:10}}>{projects.length ? <div className="project-grid">{projects.map((project,index)=><Link href={`/projects/${project.slug}`} className="project-card" key={project.id}>
      <PortfolioImage src={project.cover_image_url} alt={`${project.title} cover`} className="project-grid-image" tone={index}/>
      <div className="project-card-meta"><span className="project-index">{String(index+1).padStart(2,"0")}</span>{project.featured&&<span className="project-featured">Featured</span>}</div>
      <div className="project-card-title"><h2>{project.title}</h2><ArrowUpRight size={18}/></div>
      <p>{project.summary}</p>
      {project.tech_stack.length>0&&<div className="project-tech">{project.tech_stack.slice(0,5).map(tech=><span key={tech}>{tech}</span>)}</div>}
    </Link>)}</div> : <div className="empty-note"><strong>The workbench is being set.</strong>No projects have been published yet. Check back when there’s something worth sharing.</div>}</section>
  </PublicFrame>;
}
