import { unstable_cache } from "next/cache";
import { isSupabaseConfigured } from "./config";
import { createSupabasePublicClient } from "./server";
import type { Activity, Profile, Project, SocialLink } from "./types";

const cacheOptions = { revalidate: 300, tags: ["portfolio"] };

const cachedPortfolio = unstable_cache(
  async () => {
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
    const error = profile.error ?? socialLinks.error ?? projects.error ?? activities.error;
    if (error) throw new Error(`Could not load portfolio content: ${error.message}`);

    return {
      profile: (profile.data as Profile | null) ?? null,
      socialLinks: (socialLinks.data as SocialLink[]) ?? [],
      projects: (projects.data as Project[]) ?? [],
      activities: (activities.data as Activity[]) ?? [],
    };
  },
  ["portfolio-public-content"],
  cacheOptions,
);

const cachedProfile = unstable_cache(
  async () => {
    const supabase = await createSupabasePublicClient();
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", true)
      .maybeSingle();
    if (error) throw new Error(`Could not load portfolio profile: ${error.message}`);
    return (data as Profile | null) ?? null;
  },
  ["portfolio-profile"],
  cacheOptions,
);

const cachedProjects = unstable_cache(
  async () => {
    const supabase = await createSupabasePublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Could not load projects: ${error.message}`);
    return (data as Project[]) ?? [];
  },
  ["portfolio-projects"],
  cacheOptions,
);

const cachedActivities = unstable_cache(
  async () => {
    const supabase = await createSupabasePublicClient();
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("sort_order")
      .order("start_date", { ascending: false });
    if (error) throw new Error(`Could not load activities: ${error.message}`);
    return (data as Activity[]) ?? [];
  },
  ["portfolio-activities"],
  cacheOptions,
);

const cachedSocialLinks = unstable_cache(
  async () => {
    const supabase = await createSupabasePublicClient();
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .order("sort_order");
    if (error) throw new Error(`Could not load social links: ${error.message}`);
    return (data as SocialLink[]) ?? [];
  },
  ["portfolio-social-links"],
  cacheOptions,
);

export async function getPortfolioContent() {
  if (!isSupabaseConfigured) {
    return { profile: null, socialLinks: [], projects: [], activities: [] };
  }
  return cachedPortfolio();
}

export async function getPortfolioProfile() {
  if (!isSupabaseConfigured) return null;
  return cachedProfile();
}

export async function getPortfolioProjects() {
  if (!isSupabaseConfigured) return [];
  return cachedProjects();
}

export async function getPortfolioActivities() {
  if (!isSupabaseConfigured) return [];
  return cachedActivities();
}

export async function getPortfolioSocialLinks() {
  if (!isSupabaseConfigured) return [];
  return cachedSocialLinks();
}

const cachedProjectBySlug = unstable_cache(
  async (slug: string) => {
    const supabase = await createSupabasePublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(`Could not load project: ${error.message}`);
    return (data as Project | null) ?? null;
  },
  ["portfolio-project-by-slug"],
  cacheOptions,
);

export async function getProjectBySlug(slug: string) {
  if (!isSupabaseConfigured) return null;
  return cachedProjectBySlug(slug);
}
