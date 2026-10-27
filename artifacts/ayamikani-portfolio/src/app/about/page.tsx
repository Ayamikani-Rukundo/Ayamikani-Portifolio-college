import { getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PublicFrame, SetupNeeded } from "@/components/site";
import PortfolioImage from "@/components/portfolio-image";

export default async function AboutPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const { profile, socialLinks } = await getPortfolioContent();
  return <PublicFrame path="/about" socialLinks={socialLinks}>
    <div className="shell page-hero"><div><div className="eyebrow">A person behind the projects</div><h1 className="page-title">About, in<br/><em className="serif">progress.</em></h1></div><p className="page-lede">{profile?.headline || "Student developer, careful listener, and enthusiastic maker of things that help."}</p></div>
    <section className="shell about-grid"><aside className="about-aside"><PortfolioImage src={profile?.avatar_url} alt={profile?.full_name || "Ayamikani Rukundo Emmanuel"} className="portrait-fallback"/></aside><div><div className="eyebrow">{profile?.location || "From Rwanda"}</div><div className="prose">{profile?.long_bio ? profile.long_bio.split(/\n{2,}/).map((p,i)=><p key={i}>{p}</p>) : <p>This space is ready for a short introduction from Ayamikani.</p>}</div><div className="eyebrow" style={{marginTop:40}}>Currently</div><p className="page-lede">{profile?.short_bio || "Add a brief introduction from the admin when you’re ready."}</p>{profile?.resume_url && <p style={{marginTop:28}}><a className="button" href={profile.resume_url} target="_blank" rel="noreferrer">View résumé ↗</a></p>}</div></section>
  </PublicFrame>;
}
