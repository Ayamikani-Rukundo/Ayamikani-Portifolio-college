import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPortfolioContent, getProjectBySlug } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PublicFrame, SetupNeeded } from "@/components/site";
import PortfolioImage from "@/components/portfolio-image";

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const { slug } = await params;
  const [project, content] = await Promise.all([getProjectBySlug(slug), getPortfolioContent()]);
  if (!project) notFound();
  return <PublicFrame path="/projects" socialLinks={content.socialLinks}>
    <article><div className="shell detail-hero"><Link href="/projects" className="eyebrow"><ArrowLeft size={14} style={{verticalAlign:"middle"}}/> Back to projects</Link><h1>{project.title}</h1><p className="page-lede">{project.summary}</p></div>
      <div className="shell detail-media"><PortfolioImage src={project.cover_image_url} alt={`${project.title} project`} className="detail-project-image"/></div>
      <div className="shell detail-body"><aside><div className="eyebrow">The toolkit</div><div className="tech-list">{project.tech_stack.map(t=><span key={t}>{t}</span>)}</div><div style={{display:"grid",gap:12,marginTop:30}}>{project.live_url && <a className="button" href={project.live_url} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size={14}/></a>}{project.repo_url && <a className="button" href={project.repo_url} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={14}/></a>}</div></aside><div className="prose">{project.description ? project.description.split(/\n{2,}/).map((p,i)=><p key={i}>{p}</p>) : <p>This project is still finding its words.</p>}</div></div>
    </article>
  </PublicFrame>;
}
