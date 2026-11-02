import { AdminPageHeading, AdminShell } from "@/components/admin-shell";
import { SetupNeeded } from "@/components/site";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AnalyticsEvent = {
  session_id: string;
  path: string;
  country: string | null;
  region: string | null;
  city: string | null;
  visited_at: string;
};

const timeZone = "Africa/Kigali";
const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const dayFormatter = new Intl.DateTimeFormat("en", { timeZone, month: "short", day: "numeric" });
const timeFormatter = new Intl.DateTimeFormat("en", {
  timeZone,
  dateStyle: "medium",
  timeStyle: "short",
});

function getDayKey(value: Date | string) {
  const parts = dayKeyFormatter.formatToParts(new Date(value));
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function shiftDayKey(dayKey: string, offset: number) {
  const [year, month, day] = dayKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + offset));
  return date.toISOString().slice(0, 10);
}

export default async function AdminAnalyticsPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;

  const supabase = await createSupabaseServerClient();
  const todayKey = getDayKey(new Date());
  const since = new Date(`${shiftDayKey(todayKey, -29)}T00:00:00+02:00`);

  await supabase.from("site_analytics_events").delete().lt("visited_at", since.toISOString());
  const { data, error } = await supabase
    .from("site_analytics_events")
    .select("session_id, path, country, region, city, visited_at")
    .gte("visited_at", since.toISOString())
    .order("visited_at", { ascending: false })
    .limit(10000);

  const events = (data ?? []) as AnalyticsEvent[];
  const sessions = new Set(events.map((event) => event.session_id));
  const todayViews = events.filter((event) => getDayKey(event.visited_at) === todayKey).length;

  const dailyViews = Array.from({ length: 14 }, (_, index) => {
    const key = shiftDayKey(todayKey, index - 13);
    const date = new Date(`${key}T12:00:00+02:00`);
    return {
      key,
      label: dayFormatter.format(date),
      count: events.filter((event) => getDayKey(event.visited_at) === key).length,
    };
  });
  const maximumDailyViews = Math.max(1, ...dailyViews.map((day) => day.count));
  const pageCounts = new Map<string, number>();
  const locationSessions = new Map<string, Set<string>>();
  for (const event of events) {
    pageCounts.set(event.path, (pageCounts.get(event.path) ?? 0) + 1);
    const location = [event.city, event.region, event.country].filter(Boolean).join(", ") || "Location unavailable";
    const sessionsAtLocation = locationSessions.get(location) ?? new Set<string>();
    sessionsAtLocation.add(event.session_id);
    locationSessions.set(location, sessionsAtLocation);
  }
  const topPages = [...pageCounts].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const topLocations = [...locationSessions]
    .map(([location, locationVisitors]) => [location, locationVisitors.size] as const)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return <AdminShell path="/admin/analytics"><div className="admin-content analytics-content">
    <AdminPageHeading eyebrow="Audience" title="Analytics" description="Visits over the last 30 days. Times are shown in Kigali time (Africa/Kigali)." />
    {error ? <section className="admin-card analytics-setup"><h2>Analytics needs one setup step</h2><p>Run the <code>analytics-migration.sql</code> script from the portfolio Supabase folder, then refresh this page.</p></section> : <>
      <div className="admin-grid analytics-stats">
        <div className="stat"><b>{sessions.size.toLocaleString()}</b><span>Visitor sessions · 30 days</span></div>
        <div className="stat"><b>{events.length.toLocaleString()}</b><span>Page views · 30 days</span></div>
        <div className="stat"><b>{todayViews.toLocaleString()}</b><span>Page views · today</span></div>
      </div>

      <section className="admin-card analytics-panel">
        <div className="analytics-panel-heading"><div><div className="eyebrow">Last 14 days</div><h2>Daily page views</h2></div><span>{dailyViews.reduce((sum, day) => sum + day.count, 0).toLocaleString()} total</span></div>
        <div className="analytics-chart" role="img" aria-label="Daily page views over the last 14 days">
          {dailyViews.map((day) => <div className="analytics-day" key={day.key} title={`${day.label}: ${day.count} page views`}>
            <span className="analytics-bar" style={{ height: `${Math.max(3, (day.count / maximumDailyViews) * 100)}%` }} />
            <small>{day.label.split(" ")[1]}</small>
          </div>)}
        </div>
      </section>

      <div className="analytics-columns">
        <section className="admin-card analytics-panel"><div className="eyebrow">Most visited</div><h2>Popular pages</h2>
          {topPages.length ? <div className="analytics-list">{topPages.map(([path, count]) => <div className="analytics-list-row" key={path}><code>{path}</code><strong>{count}</strong></div>)}</div> : <p className="analytics-empty">Page views will appear here as people visit.</p>}
        </section>
        <section className="admin-card analytics-panel"><div className="eyebrow">Visitor sessions by location</div><h2>Where visits come from</h2>
          {topLocations.length ? <div className="analytics-list">{topLocations.map(([location, count]) => <div className="analytics-list-row" key={location}><span>{location}</span><strong>{count}</strong></div>)}</div> : <p className="analytics-empty">Your hosting provider may not supply location data.</p>}
        </section>
      </div>

      <section className="admin-card analytics-panel"><div className="eyebrow">Recent activity</div><h2>Latest page views</h2>
        {events.length ? <div className="analytics-list analytics-recent">{events.slice(0, 12).map((event, index) => <div className="analytics-list-row" key={`${event.visited_at}-${index}`}><span><code>{event.path}</code><small>{[event.city, event.country].filter(Boolean).join(", ") || "Location unavailable"}</small></span><time dateTime={event.visited_at}>{timeFormatter.format(new Date(event.visited_at))}</time></div>)}</div> : <p className="analytics-empty">No visits recorded yet.</p>}
      </section>
      <p className="analytics-privacy">Visitor sessions use a temporary ID stored only for this browser tab. IP addresses and browser details are not saved in this report. Location depends on hosting-provider data.</p>
    </>}</div></AdminShell>;
}