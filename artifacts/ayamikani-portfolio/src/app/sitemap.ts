import type { MetadataRoute } from "next";
import { getPortfolioProjects } from "@/lib/supabase/queries";

const siteUrl = "https://ayamikani.vercel.app";
const publicRoutes = [
  "/",
  "/about",
  "/activities",
  "/certificates",
  "/contact",
  "/gallery",
  "/projects",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPortfolioProjects();
  const entries: MetadataRoute.Sitemap = [
    ...publicRoutes.map((route) => ({
      url: new URL(route, siteUrl).toString(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.7,
    })),
    ...projects.flatMap((project) => {
      const slug = project.slug.trim();
      if (!slug) return [];

      const lastModified = new Date(project.created_at);
      return [{
        url: new URL(`/projects/${encodeURIComponent(slug)}`, siteUrl).toString(),
        ...(Number.isNaN(lastModified.getTime()) ? {} : { lastModified }),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }];
    }),
  ];

  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
