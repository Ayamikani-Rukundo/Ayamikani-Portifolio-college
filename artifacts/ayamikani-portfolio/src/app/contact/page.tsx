import { ArrowUpRight } from "lucide-react";
import { getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PublicFrame, SetupNeeded } from "@/components/site";

export default async function ContactPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const { profile, socialLinks } = await getPortfolioContent();
  return <PublicFrame path="/contact" socialLinks={socialLinks} avatarUrl={profile?.avatar_url}>
    <section className="shell page-hero"><div><div className="eyebrow">There’s room for a good question</div><h1 className="page-title">Let’s start<br/><em className="serif">somewhere.</em></h1></div><p className="page-lede">A project you want to think through. A community you’re building. A school with a place for a curious mind. I’m listening.</p></section>
    <section className="shell"><div className="contact-panel"><div><div className="eyebrow">Reach out directly</div><h2>Good things begin with a conversation.</h2><p>I usually reply as soon as I can. Thank you for stopping by.</p></div><div>{profile?.email ? <a className="button" href={`mailto:${profile.email}`}>Write me an email <ArrowUpRight size={16}/></a> : <div className="empty-note"><strong>Email coming soon.</strong>Contact details have not been added yet.</div>}</div></div>
      {socialLinks.length > 0 && <div className="contact-socials"><div className="eyebrow">Elsewhere online</div><h2>Find me around.</h2><div className="footer-links">{socialLinks.map(link => <a key={link.id} href={link.url} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size={13}/></a>)}</div></div>}
    </section>
  </PublicFrame>;
}
