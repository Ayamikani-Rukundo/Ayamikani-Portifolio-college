import { revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "./server";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export function isHttpUrl(value: string) {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function runAuthenticatedWrite(
  operation: (
    supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  ) => PromiseLike<{ error: { message: string } | null }>,
): Promise<ActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { ok: false, error: "Please sign in again to make this change." };
    }

    const { error } = await operation(supabase);
    if (error) return { ok: false, error: error.message };

    revalidateTag("portfolio", "max");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
}
