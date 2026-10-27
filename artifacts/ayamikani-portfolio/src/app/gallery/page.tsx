import { getPortfolioGallery, getPortfolioContent } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PublicFrame, SetupNeeded } from "@/components/site";
import GalleryViewer from "@/components/gallery-viewer";

export default async function GalleryPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const [{ profile, socialLinks }, items] = await Promise.all([
    getPortfolioContent(),
    getPortfolioGallery(),
  ]);

  return (
    <PublicFrame path="/gallery" socialLinks={socialLinks} avatarUrl={profile?.avatar_url}>
      <section className="shell page-hero gallery-page-hero">
        <div>
          <div className="eyebrow">Little moments / 05</div>
          <h1 className="page-title">Life in<br /><em className="serif">pictures.</em></h1>
        </div>
        <p className="page-lede">
          A visual journal of the people, places, and moments that make the journey.
          Select a photo to see its date and story.
        </p>
      </section>
      <section className="shell gallery-section">
        <div className="gallery-section-heading">
          <div>
            <div className="eyebrow">The visual journal</div>
            <h2>Moments &amp; memories</h2>
          </div>
          <span>{String(items.length).padStart(2, "0")} {items.length === 1 ? "photo" : "photos"}</span>
        </div>
        <GalleryViewer items={items} />
      </section>
    </PublicFrame>
  );
}
