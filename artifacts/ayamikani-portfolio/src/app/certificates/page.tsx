import { Award, ArrowUpRight } from "lucide-react";
import { getPortfolioCertificates, getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PublicFrame, SetupNeeded } from "@/components/site";
import CertificateViewer from "@/components/certificate-viewer";

export default async function CertificatesPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const [{ profile, socialLinks }, certificates] = await Promise.all([
    getPortfolioContent(),
    getPortfolioCertificates(),
  ]);

  return (
    <PublicFrame path="/certificates" socialLinks={socialLinks} avatarUrl={profile?.avatar_url}>
      <section className="shell page-hero certificate-page-hero">
        <div>
          <div className="eyebrow">Proof of curiosity / 04</div>
          <h1 className="page-title">Learning,<br /><em className="serif">recognized.</em></h1>
        </div>
        <p className="page-lede">
          A collection of certificates and milestones earned along the way.
          Select any certificate to view it up close.
        </p>
      </section>
      <section className="shell certificate-section">
        <div className="certificate-section-heading">
          <span className="certificate-heading-icon"><Award size={20} /></span>
          <div>
            <div className="eyebrow">The collection</div>
            <h2>Credentials &amp; milestones</h2>
          </div>
          <span className="certificate-count">{String(certificates.length).padStart(2, "0")} certificates</span>
        </div>
        <CertificateViewer certificates={certificates} />
        <p className="certificate-note">
          Each credential marks a question explored, a skill practiced, or a goal reached.
          <a href="/contact"> Let’s talk about them <ArrowUpRight size={13} /></a>
        </p>
      </section>
    </PublicFrame>
  );
}
