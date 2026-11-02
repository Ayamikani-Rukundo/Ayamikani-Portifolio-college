import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function locationValue(value: string | null) {
  if (!value) return null;
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    // Keep the original value if the hosting header is not URL-encoded.
  }
  return decoded.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 80) || null;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Analytics is not configured." }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !("path" in payload) ||
    typeof payload.path !== "string" ||
    !("sessionId" in payload) ||
    typeof payload.sessionId !== "string"
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const path = payload.path;
  const sessionId = payload.sessionId;
  if (
    path.length > 200 ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.startsWith("/admin") ||
    path.startsWith("/api") ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return new Response(null, { status: 204 });

  const { error } = await supabase.from("site_analytics_events").insert({
    session_id: sessionId,
    path,
    country: locationValue(request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry")),
    region: locationValue(request.headers.get("x-vercel-ip-country-region")),
    city: locationValue(request.headers.get("x-vercel-ip-city")),
  });

  if (error) {
    return NextResponse.json({ error: "Could not record analytics." }, { status: 503 });
  }
  return new Response(null, { status: 204 });
}