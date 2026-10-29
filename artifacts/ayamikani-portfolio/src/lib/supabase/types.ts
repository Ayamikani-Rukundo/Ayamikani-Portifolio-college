export type Profile = {
  id: boolean;
  full_name: string;
  headline: string;
  short_bio: string;
  long_bio: string;
  location: string;
  timezone: string;
  email: string;
  avatar_url: string;
  about_image_url: string;
  resume_url: string;
};

export type ProfileInput = Omit<Profile, "id">;

export type SocialLink = {
  id: string;
  label: string;
  url: string;
  icon_name: string;
  sort_order: number;
};

export type SocialLinkInput = Omit<SocialLink, "id">;

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  tech_stack: string[];
  cover_image_url: string | null;
  live_url: string;
  repo_url: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
};

export type ProjectInput = Omit<Project, "id" | "created_at">;

export type Activity = {
  id: string;
  title: string;
  organization: string;
  role: string;
  category: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  image_url: string | null;
  link_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
};

export type ActivityInput = Omit<Activity, "id" | "created_at">;

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issued_on: string | null;
  description: string;
  file_url: string;
  credential_url: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
};

export type CertificateInput = Omit<Certificate, "id" | "created_at">;

export type GalleryItem = {
  id: string;
  image_url: string;
  image_urls: string[];
  caption: string;
  taken_at: string | null;
  sort_order: number;
  created_at: string;
};

export type GalleryItemInput = Omit<GalleryItem, "id" | "created_at">;

export const ACTIVITY_CATEGORIES = [
  "Leadership",
  "Robotics",
  "Coding",
  "Entrepreneurship",
  "Community Service",
  "Science",
  "Awards",
  "Other",
] as const;
