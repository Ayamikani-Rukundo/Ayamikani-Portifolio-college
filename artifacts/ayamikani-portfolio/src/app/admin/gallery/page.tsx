import GalleryManager from "@/components/gallery-manager";
import { AdminShell } from "@/components/admin-shell";
import { SetupNeeded } from "@/components/site";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getPortfolioGallery, getPortfolioProfile } from "@/lib/supabase/queries";

export default async function AdminGalleryPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const [profile, items] = await Promise.all([
    getPortfolioProfile(),
    getPortfolioGallery(),
  ]);

  return (
    <AdminShell path="/admin/gallery" avatarUrl={profile?.avatar_url}>
      <GalleryManager initial={items} />
    </AdminShell>
  );
}
