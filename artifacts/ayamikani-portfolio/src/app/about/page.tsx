import {
  ArrowUpRight,
  BrainCircuit,
  Clock3,
  Compass,
  Lightbulb,
  MapPin,
  MessageCircle,
  Sparkles,
  UsersRound,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PublicFrame, SetupNeeded } from "@/components/site";
import PortfolioImage from "@/components/portfolio-image";

const skillLevels = [
  { label: "Learning", description: "Exploring the foundations", value: 1 },
  { label: "Practicing", description: "Building through practice", value: 2 },
  { label: "Applied", description: "Used in projects or activities", value: 3 },
] as const;

const skillGroups = [
  {
    title: "Building digital things",
    description: "Tools and foundations for turning ideas into useful experiences.",
    icon: Wrench,
    skills: [
      { name: "HTML & CSS", level: 3 },
      { name: "JavaScript & TypeScript", level: 2 },
      { name: "React & Next.js", level: 2 },
      { name: "Responsive interface design", level: 3 },
      { name: "Supabase & PostgreSQL", level: 2 },
      { name: "Backend & API fundamentals", level: 1 },
      { name: "Git, GitHub & deployment", level: 2 },
    ],
  },
  {
    title: "Thinking & learning",
    description: "How I approach questions, challenges, and unfamiliar ideas.",
    icon: BrainCircuit,
    skills: [
      { name: "Problem solving", level: 3 },
      { name: "Research & self-directed learning", level: 3 },
      { name: "Creative thinking", level: 3 },
      { name: "Attention to detail", level: 2 },
    ],
  },
  {
    title: "Working with people",
    description: "Strengths shaped by collaboration and showing up for others.",
    icon: UsersRound,
    skills: [
      { name: "Teamwork & collaboration", level: 3 },
      { name: "Communication", level: 2 },
      { name: "Leadership & initiative", level: 2 },
      { name: "Community-minded thinking", level: 3 },
    ],
  },
];

const workPrinciples = [
  {
    icon: UsersRound,
    number: "01",
    title: "Start with people",
    description: "Understand who a solution is for and what would make it genuinely useful.",
  },
  {
    icon: Lightbulb,
    number: "02",
    title: "Make ideas tangible",
    description: "Turn a question into a small, testable first version instead of waiting for perfect.",
  },
  {
    icon: Compass,
    number: "03",
    title: "Keep learning",
    description: "Use feedback, reflection, and curiosity to make the next version better.",
  },
];

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

      <section className="about-skills-section">
        <div className="shell">
          <div className="about-section-heading">
            <div>
              <div className="eyebrow">A growing toolkit / 02</div>
              <h2>Skills, in <em>practice.</em></h2>
            </div>
            <p>
              A snapshot of the technical, thinking, and people skills I’m
              building and using along the way.
            </p>
          </div>
          <div className="skill-level-legend" aria-label="Skill level guide">
            {skillLevels.map((level) => (
              <span key={level.label}>
                <i className={`skill-level-dot skill-level-${level.value}`} />
                <strong>{level.label}</strong>
                <small>{level.description}</small>
              </span>
            ))}
          </div>
          <div className="skill-groups">
            {skillGroups.map((group) => {
              const Icon = group.icon;
              return (
                <article className="skill-group" key={group.title}>
                  <header className="skill-group-heading">
                    <span className="skill-group-icon"><Icon size={18} /></span>
                    <div>
                      <h3>{group.title}</h3>
                      <p>{group.description}</p>
                    </div>
                  </header>
                  <ul className="skill-list">
                    {group.skills.map((skill) => (
                      <li className="skill-item" key={skill.name}>
                        <span className="skill-name">{skill.name}</span>
                        <span
                          className="skill-rating"
                          aria-label={`${skillLevels[skill.level - 1].label}: ${skillLevels[skill.level - 1].description}`}
                          title={`${skillLevels[skill.level - 1].label} — ${skillLevels[skill.level - 1].description}`}
                        >
                          {skillLevels.map((level) => (
                            <i
                              className={level.value <= skill.level ? "filled" : ""}
                              key={level.value}
                            />
                          ))}
                        </span>
                        <span className="skill-rating-label">{skillLevels[skill.level - 1].label}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <p className="skills-disclaimer">
            A practical self-assessment, not a test score or formal certification.
            The levels describe current experience and will grow with the work.
          </p>
        </div>
      </section>

      <section className="shell about-approach-section">
        <div className="about-section-heading about-approach-heading">
          <div>
            <div className="eyebrow">A simple way of working / 03</div>
            <h2>Curiosity into <em>something useful.</em></h2>
          </div>
          <p>
            I want the process to be thoughtful, collaborative, and open to
            getting better.
          </p>
        </div>
        <div className="work-principles">
          {workPrinciples.map((principle) => {
            const Icon = principle.icon;
            return (
              <article className="work-principle" key={principle.number}>
                <div className="work-principle-top">
                  <span>{principle.number}</span>
                  <Icon size={19} aria-hidden="true" />
                </div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            );
          })}
        </div>
        <div className="about-approach-cta">
          <MessageCircle size={17} aria-hidden="true" />
          <span>Have an idea or a question?</span>
          <Link href="/contact">Let’s talk <ArrowUpRight size={14} /></Link>
        </div>
      </section>
    </PublicFrame>
  );
}
