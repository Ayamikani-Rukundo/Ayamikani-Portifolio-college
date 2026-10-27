import CertificateManager from "@/components/certificate-manager";
import { AdminShell } from "@/components/admin-shell";
import { SetupNeeded } from "@/components/site";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getPortfolioCertificates, getPortfolioProfile } from "@/lib/supabase/queries";

export default async function AdminCertificatesPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const [profile, certificates] = await Promise.all([
    getPortfolioProfile(),
    getPortfolioCertificates(),
  ]);

  return (
    <AdminShell path="/admin/certificates" avatarUrl={profile?.avatar_url}>
      <CertificateManager initial={certificates} />
    </AdminShell>
  );
}
