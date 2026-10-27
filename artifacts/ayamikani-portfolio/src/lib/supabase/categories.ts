export function activityCategoryClass(category: string) {
  const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `category-${slug.replace(/^-|-$/g, "") || "other"}`;
}
