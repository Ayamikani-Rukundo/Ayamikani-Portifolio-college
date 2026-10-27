import { connection } from "next/server";
import { isSupabaseConfigured } from "./config";
import { createSupabasePublicClient } from "./server";
import type { Activity, Certificate, GalleryItem, Profile, Project, SocialLink } from "./types";

export async function getPortfolioContent() {
  await connection();
  if (!isSupabaseConfigured) {
    return { profile: null, socialLinks: [], projects: [], activities: [] };
  }

  const supabase = await createSupabasePublicClient();
  const [profile, socialLinks, projects, activities] = await Promise.all([
    supabase.from("profile").select("*").eq("id", true).maybeSingle(),
    supabase.from("social_links").select("*").order("sort_order"),
    supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false }),
    supabase
      .from("activities")
      .select("*")
      .order("sort_order")
      .order("start_date", { ascending: false }),
  ]);
  const error =
    profile.error ?? socialLinks.error ?? projects.error ?? activities.error;
  if (error) throw new Error(`Could not load portfolio content: ${error.message}`);

  return {
    profile: (profile.data as Profile | null) ?? null,
    socialLinks: (socialLinks.data as SocialLink[]) ?? [],
    projects: (projects.data as Project[]) ?? [],
    activities: (activities.data as Activity[]) ?? [],
  };
}

export async function getPortfolioProfile() {
  await connection();
  if (!isSupabaseConfigured) return null;

  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw new Error(`Could not load portfolio profile: ${error.message}`);
  return (data as Profile | null) ?? null;
}

export async function getPortfolioProjects() {
  await connection();
  if (!isSupabaseConfigured) return [];

  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load projects: ${error.message}`);
  return (data as Project[]) ?? [];
}

export async function getPortfolioActivities() {
  await connection();
  if (!isSupabaseConfigured) return [];

  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("sort_order")
    .order("start_date", { ascending: false });
  if (error) throw new Error(`Could not load activities: ${error.message}`);
  return (data as Activity[]) ?? [];
}

export async function getPortfolioSocialLinks() {
  await connection();
  if (!isSupabaseConfigured) return [];

  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("sort_order");
  if (error) throw new Error(`Could not load social links: ${error.message}`);
  return (data as SocialLink[]) ?? [];
}

export async function getPortfolioCertificates() {
  await connection();
  if (!isSupabaseConfigured) return [];

  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("sort_order")
    .order("issued_on", { ascending: false, nullsFirst: false });
  if (error) throw new Error(`Could not load certificates: ${error.message}`);
  return (data as Certificate[]) ?? [];
}

export async function getPortfolioGallery() {
  await connection();
  if (!isSupabaseConfigured) return [];

  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order")
    .order("taken_at", { ascending: false, nullsFirst: false });
  if (error) throw new Error(`Could not load gallery: ${error.message}`);
  return (data as GalleryItem[]) ?? [];
}

export async function getProjectBySlug(slug: string) {
  await connection();
  if (!isSupabaseConfigured) return null;

  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Could not load project: ${error.message}`);
  return (data as Project | null) ?? null;
}
