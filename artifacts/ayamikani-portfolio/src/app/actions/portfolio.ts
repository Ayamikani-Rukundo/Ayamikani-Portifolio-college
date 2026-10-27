"use server";

import { ACTIVITY_CATEGORIES } from "@/lib/supabase/types";
import type {
  ActivityInput,
  ProfileInput,
  ProjectInput,
  SocialLinkInput,
} from "@/lib/supabase/types";
import {
  isHttpUrl,
  isUuid,
  runAuthenticatedWrite,
  type ActionResult,
} from "@/lib/supabase/write-helpers";

function validText(value: unknown, maxLength = 5000): value is string {
  return typeof value === "string" && value.length <= maxLength;
}

function validOrder(value: number) {
  return Number.isInteger(value) && value >= 0 && value <= 100000;
}

function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function validTimeZone(value: string) {
  if (!value) return true;
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function validProfile(input: ProfileInput) {
  return (
    validText(input.full_name, 120) &&
    input.full_name.trim().length > 0 &&
    validText(input.headline, 180) &&
    validText(input.short_bio, 500) &&
    validText(input.long_bio, 10000) &&
    validText(input.location, 120) &&
    validText(input.timezone, 80) &&
    validTimeZone(input.timezone) &&
    validText(input.email, 254) &&
    validText(input.avatar_url, 2048) &&
    validText(input.about_image_url, 2048) &&
    validText(input.resume_url, 2048) &&
    isHttpUrl(input.avatar_url) &&
    isHttpUrl(input.about_image_url) &&
    isHttpUrl(input.resume_url)
  );
}

function validSocialLink(input: SocialLinkInput) {
  return (
    validText(input.label, 80) &&
    input.label.trim().length > 0 &&
    validText(input.url, 2048) &&
    input.url.trim().length > 0 &&
    isHttpUrl(input.url) &&
    validText(input.icon_name, 40) &&
    validOrder(input.sort_order)
  );
}

function validProject(input: ProjectInput) {
  return (
    validText(input.title, 160) &&
    input.title.trim().length > 0 &&
    validText(input.slug, 180) &&
    validSlug(input.slug) &&
    validText(input.summary, 500) &&
    validText(input.description, 12000) &&
    Array.isArray(input.tech_stack) &&
    input.tech_stack.length <= 30 &&
    input.tech_stack.every((item) => validText(item, 60)) &&
    (input.cover_image_url === null ||
      (validText(input.cover_image_url, 2048) &&
        isHttpUrl(input.cover_image_url))) &&
    validText(input.live_url, 2048) &&
    isHttpUrl(input.live_url) &&
    validText(input.repo_url, 2048) &&
    isHttpUrl(input.repo_url) &&
    typeof input.featured === "boolean" &&
    validOrder(input.sort_order)
  );
}

function validDate(value: string | null) {
  return value === null || /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validActivity(input: ActivityInput) {
  return (
    validText(input.title, 160) &&
    input.title.trim().length > 0 &&
    validText(input.organization, 160) &&
    validText(input.role, 160) &&
    validText(input.category, 80) &&
    ACTIVITY_CATEGORIES.includes(
      input.category as (typeof ACTIVITY_CATEGORIES)[number],
    ) &&
    validDate(input.start_date) &&
    validDate(input.end_date) &&
    (input.start_date === null ||
      input.end_date === null ||
      input.end_date >= input.start_date) &&
    typeof input.is_current === "boolean" &&
    validText(input.description, 10000) &&
    (input.image_url === null ||
      (validText(input.image_url, 2048) && isHttpUrl(input.image_url))) &&
    (input.link_url === null ||
      (validText(input.link_url, 2048) && isHttpUrl(input.link_url))) &&
    typeof input.featured === "boolean" &&
    validOrder(input.sort_order)
  );
}

function invalid(message: string): ActionResult {
  return { ok: false, error: message };
}

export async function saveProfile(input: ProfileInput): Promise<ActionResult> {
  if (!validProfile(input)) return invalid("Check the profile fields and try again.");
  return runAuthenticatedWrite((supabase) =>
    supabase.from("profile").upsert({ id: true, ...input }, { onConflict: "id" }),
  );
}

export async function createSocialLink(
  input: SocialLinkInput,
): Promise<ActionResult> {
  if (!validSocialLink(input)) return invalid("Check the social link fields and try again.");
  return runAuthenticatedWrite((supabase) =>
    supabase.from("social_links").insert(input),
  );
}

export async function updateSocialLink(
  id: string,
  input: SocialLinkInput,
): Promise<ActionResult> {
  if (!isUuid(id) || !validSocialLink(input)) {
    return invalid("Check the social link fields and try again.");
  }
  return runAuthenticatedWrite((supabase) =>
    supabase.from("social_links").update(input).eq("id", id),
  );
}

export async function deleteSocialLink(id: string): Promise<ActionResult> {
  if (!isUuid(id)) return invalid("That social link could not be found.");
  return runAuthenticatedWrite((supabase) =>
    supabase.from("social_links").delete().eq("id", id),
  );
}

export async function createProject(input: ProjectInput): Promise<ActionResult> {
  if (!validProject(input)) return invalid("Check the project fields and try again.");
  return runAuthenticatedWrite((supabase) =>
    supabase.from("projects").insert(input),
  );
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<ActionResult> {
  if (!isUuid(id) || !validProject(input)) {
    return invalid("Check the project fields and try again.");
  }
  return runAuthenticatedWrite((supabase) =>
    supabase.from("projects").update(input).eq("id", id),
  );
}

export async function deleteProject(id: string): Promise<ActionResult> {
  if (!isUuid(id)) return invalid("That project could not be found.");
  return runAuthenticatedWrite((supabase) =>
    supabase.from("projects").delete().eq("id", id),
  );
}

export async function createActivity(
  input: ActivityInput,
): Promise<ActionResult> {
  if (!validActivity(input)) return invalid("Check the activity fields and try again.");
  return runAuthenticatedWrite((supabase) =>
    supabase.from("activities").insert(input),
  );
}

export async function updateActivity(
  id: string,
  input: ActivityInput,
): Promise<ActionResult> {
  if (!isUuid(id) || !validActivity(input)) {
    return invalid("Check the activity fields and try again.");
  }
  return runAuthenticatedWrite((supabase) =>
    supabase.from("activities").update(input).eq("id", id),
  );
}

export async function deleteActivity(id: string): Promise<ActionResult> {
  if (!isUuid(id)) return invalid("That activity could not be found.");
  return runAuthenticatedWrite((supabase) =>
    supabase.from("activities").delete().eq("id", id),
  );
}
