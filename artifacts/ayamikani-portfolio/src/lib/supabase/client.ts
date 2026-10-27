"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./config";

export function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured.");
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export async function uploadPortfolioFile(
  file: File,
  folder: "profile" | "about" | "projects" | "activities",
) {
  const maxSize = file.type === "application/pdf" ? 8 : 10;
  if (file.size > maxSize * 1024 * 1024) {
    throw new Error(`Choose a file smaller than ${maxSize} MB.`);
  }
  const allowed =
    file.type === "application/pdf" ||
    ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type);
  if (!allowed) {
    throw new Error("Use a JPG, PNG, WebP, GIF, or PDF file.");
  }

  const supabase = createSupabaseBrowserClient();
  const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "file";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("portfolio")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
  return data.publicUrl;
}
