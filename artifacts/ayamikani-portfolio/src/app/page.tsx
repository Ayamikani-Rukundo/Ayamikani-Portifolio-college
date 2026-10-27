import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { activityCategoryClass } from "@/lib/supabase/categories";
import { PublicFrame, SetupNeeded } from "@/components/site";
import PortfolioImage from "@/components/portfolio-image";

export default async function HomePage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const content = await getPortfolioContent();
  const name = content.profile?.full_name || "Ayamikani Rukundo Emmanuel";
  const headline =
    content.profile?.headline ||
    "Student software developer · robotics leader · entrepreneur";
  const bio =
    content.profile?.short_bio ||
    "A student software developer, robotics leader, and entrepreneur from Rwanda.";
  const projects = content.projects.filter((project) => project.featured).slice(0, 3);
  const activities = content.activities
    .filter((activity) => activity.featured)
    .slice(0, 3);
  return <PublicFrame path="/" socialLinks={content.socialLinks}>
    <section className="shell hero">
      <div className="hero-copy"><div className="eyebrow">{name}</div>
        <h1>Ideas with<br/><em>people</em> in mind.</h1>
        <p className="hero-headline">{headline}</p>
        <p className="hero-description">{bio}</p>
        <div className="hero-actions"><Link href="/projects" className="button primary">See what I’m building <ArrowUpRight size={15}/></Link><Link href="/about" className="button text-button">A little about me <ArrowDownRight size={15}/></Link></div>
      </div>
      <div className="hero-art">
        <div className="orbit"/><div className="orbit two"/>
        {content.profile?.avatar_url ? (
          <PortfolioImage
            src={content.profile.avatar_url}
            alt={name}
            className="hero-avatar"
          />
        ) : (
          <div className="art-paper" role="img" aria-label="Abstract colorful portrait artwork"><span className="eyebrow">Curiosity / care</span><span className="art-letter">a.</span><span className="art-bottom">A practice of making<br/>things work for people.</span><span className="art-scribble">keep going</span></div>
        )}
        <div className="art-stamp">BUILD<br/>WITH<br/>CARE</div>
      </div>
    </section>
    <div className="intro-strip"><div className="shell strip-inner"><span className="strip-item"><span>+</span> {headline}</span><span className="strip-item"><span>↗</span> {content.profile?.location || "From Rwanda"}</span><span className="strip-item"><span>+</span> Learning in public</span></div></div>
    <section className="shell section">
      <div className="section-head"><div><div className="eyebrow">Selected work / 01</div><h2>Made to be useful.</h2></div><p>Featured projects chosen by Ayamikani.</p></div>
      {projects.length ? <div className="project-list">{projects.map((project, index) => <Link href={`/projects/${project.slug}`} className="project-row" key={project.id}><span className="project-index">0{index + 1}</span><PortfolioImage src={project.cover_image_url} alt={`${project.title} cover`} className="project-thumb" tone={index}/><h3>{project.title}</h3><p>{project.summary}</p><span className="arrow-circle"><ArrowUpRight size={18}/></span></Link>)}</div> :
        <div className="empty-note"><strong>Room for what comes next.</strong>There are no featured projects yet. When something is ready to share, it will find its place here.</div>}
      <div style={{marginTop:28}}><Link href="/projects" className="button">Explore the work <ArrowUpRight size={15}/></Link></div>
    </section>
    <section className="featured-activities">
      <div className="shell section">
        <div className="section-head"><div><div className="eyebrow">Learning with others / 02</div><h2>Where I show up.</h2></div><p>Featured activities selected by Ayamikani.</p></div>
        {activities.length ? (
          <div className="featured-activity-grid">
            {activities.map((activity, index) => (
              <article className="featured-activity" key={activity.id}>
                <PortfolioImage
                  src={activity.image_url}
                  alt={`${activity.title} image`}
                  className="featured-activity-image"
                  tone={index + 1}
                />
                <div className={`category-tag ${activityCategoryClass(activity.category)}`}>{activity.category}</div>
                <h3>{activity.title}</h3>
                <p>{[activity.role, activity.organization].filter(Boolean).join(" · ")}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-note">
            <strong>The story is still unfolding.</strong>
            There are no featured activities yet. Shared work will appear here when it is ready.
          </div>
        )}
        <div style={{ marginTop: 28 }}>
          <Link href="/activities" className="button">Explore activities <ArrowUpRight size={15}/></Link>
        </div>
      </div>
    </section>
    <section className="section manifesto"><div className="shell"><div className="eyebrow">A working principle</div><blockquote>“The best technology doesn’t just <em>work.</em> It makes more things possible for more people.”</blockquote></div></section>
    <section className="shell section callout-grid"><div className="callout-copy"><div className="eyebrow">Beyond the screen</div><h2>Built with people, not just for them.</h2><p>{content.profile?.long_bio?.slice(0, 310) || "This space is ready for Ayamikani’s own words about the work, the people, and the questions that matter."}</p><Link className="button text-button" href="/activities">See where I show up <ArrowUpRight size={15}/></Link></div><div className="note-card"><p>Make the useful thing. Make it generous.</p><small>Notes from the workbench / 001</small></div></section>
    <section className="shell section" style={{paddingTop:0}}><div className="contact-panel"><div><div className="eyebrow">The next good conversation</div><h2>Have a question, an idea, or a seat at the table?</h2><p>I’d love to hear what you’re working on.</p></div><div><Link href="/contact" className="button">Get in touch <ArrowUpRight size={16}/></Link></div></div></section>
  </PublicFrame>;
}
