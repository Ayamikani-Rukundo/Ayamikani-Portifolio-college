import { ArrowUpRight, Clock3, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PublicFrame, SetupNeeded } from "@/components/site";
import PortfolioImage from "@/components/portfolio-image";

export default async function AboutPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const { profile, socialLinks } = await getPortfolioContent();
  const name = profile?.full_name || "Ayamikani Rukundo Emmanuel";

  return (
    <PublicFrame path="/about" socialLinks={socialLinks} avatarUrl={profile?.avatar_url}>
      <section className="shell page-hero about-page-hero">
        <div>
          <div className="eyebrow">Beyond the screen / 01</div>
          <h1 className="page-title">The person<br /><em className="serif">behind the work.</em></h1>
        </div>
        <div className="about-hero-aside">
          <Sparkles size={18} aria-hidden="true" />
          <p>{profile?.headline || "Student developer, careful listener, and enthusiastic maker of things that help."}</p>
        </div>
      </section>

      <section className="shell about-layout">
        <aside className="about-profile">
          <div className="about-photo-frame">
            <div className="about-photo-topline">
              <span className="about-photo-indicator" />
              <span>THE HUMAN SIDE</span>
              <span>01 — 01</span>
            </div>
            <PortfolioImage
              src={profile?.about_image_url || profile?.avatar_url}
              alt={name}
              className="about-portrait"
            />
            <div className="about-photo-caption">
              <span className="about-photo-monogram" aria-hidden="true">A.</span>
              <span>Curious by nature.<br />Building with intention.</span>
            </div>
          </div>
          <div className="about-identity">
            <div className="eyebrow">A little introduction</div>
            <h2>{name}</h2>
            {profile?.headline && <p>{profile.headline}</p>}
          </div>
          <div className="about-facts">
            {profile?.location && (
              <div className="about-fact">
                <MapPin size={16} aria-hidden="true" />
                <span><small>Based in</small><strong>{profile.location}</strong></span>
              </div>
            )}
            {profile?.timezone && (
              <div className="about-fact">
                <Clock3 size={16} aria-hidden="true" />
                <span><small>Local time zone</small><strong>{profile.timezone}</strong></span>
              </div>
            )}
          </div>
        </aside>

        <article className="about-story">
          <div className="about-story-heading">
            <div className="eyebrow">A story still unfolding</div>
            <span className="about-story-mark" aria-hidden="true">“</span>
          </div>
          <div className="about-currently">
            <span className="about-currently-label">RIGHT NOW</span>
            <p>{profile?.short_bio || "Add a brief introduction from the admin when you’re ready."}</p>
          </div>
          <div className="about-biography">
            {profile?.long_bio
              ? profile.long_bio.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)
              : <p>This space is ready for a short introduction from Ayamikani.</p>}
          </div>
          <div className="about-story-footer">
            {profile?.resume_url && (
              <a className="button primary" href={profile.resume_url} target="_blank" rel="noreferrer">
                View résumé <ArrowUpRight size={15} />
              </a>
            )}
            <Link className="button" href="/activities">Things I care about <ArrowUpRight size={15} /></Link>
            <Link className="about-contact-link" href="/contact">Have a question? Let’s talk <ArrowUpRight size={14} /></Link>
          </div>
        </article>
      </section>
    </PublicFrame>
  );
}
