import { getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PublicFrame, SetupNeeded } from "@/components/site";
import ContactMethods from "@/components/contact-methods";

export default async function ContactPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const { profile, socialLinks } = await getPortfolioContent();
  return <PublicFrame path="/contact" socialLinks={socialLinks} avatarUrl={profile?.avatar_url}>
    <section className="shell page-hero"><div><div className="eyebrow">There’s room for a good question</div><h1 className="page-title">Let’s start<br/><em className="serif">somewhere.</em></h1></div><p className="page-lede">A project you want to think through. A community you’re building. A school with a place for a curious mind. I’m listening.</p></section>
    <section className="shell">
      <div className="contact-panel"><div><div className="eyebrow">Reach out directly</div><h2>Good things begin with a conversation.</h2><p>Choose the way that works best for you. I look forward to hearing from you.</p></div><div className="contact-panel-note">A thoughtful message is always welcome.</div></div>
      <ContactMethods email={profile?.email || ""} location={profile?.location || ""} timezone={profile?.timezone || ""} socialLinks={socialLinks}/>
    </section>
  </PublicFrame>;
}
