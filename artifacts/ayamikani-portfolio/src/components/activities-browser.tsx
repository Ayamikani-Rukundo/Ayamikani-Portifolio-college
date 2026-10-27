"use client";
import { useMemo, useState } from "react";
import type { Activity } from "@/lib/supabase/types";
import { ACTIVITY_CATEGORIES } from "@/lib/supabase/types";
import PortfolioImage from "@/components/portfolio-image";
import { activityCategoryClass } from "@/lib/supabase/categories";

function formatDate(date: string | null) {
  if (!date) return "Date to come";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en", { month: "short", year: "numeric" });
}
export default function ActivitiesBrowser({ activities }: { activities: Activity[] }) {
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => category === "All" ? activities : activities.filter(a => a.category === category), [activities, category]);
  return <>
    <div className="filter-row" aria-label="Filter activities">{["All", ...ACTIVITY_CATEGORIES].map(c=><button key={c} type="button" className={`filter-chip${category===c?" active":""}`} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    {filtered.length ? <div className="activity-timeline">{filtered.map(activity=><article className="activity-entry" key={activity.id}>
      <div className="activity-date">{formatDate(activity.start_date)}<br/>to {activity.is_current ? "Present" : formatDate(activity.end_date)}</div>
      <div className="activity-content"><span className={`category-tag ${activityCategoryClass(activity.category)}`}>{activity.category}</span><h3>{activity.title}</h3><div className="role">{[activity.role,activity.organization].filter(Boolean).join(" · ")}</div><PortfolioImage src={activity.image_url} alt={`${activity.title} activity`} className="activity-image"/><p>{activity.description}</p>{activity.link_url && <a className="button text-button" href={activity.link_url} target="_blank" rel="noreferrer">Learn more ↗</a>}</div>
    </article>)}</div> : <div className="empty-note"><strong>{category === "All" ? "The story is still unfolding." : `No ${category.toLowerCase()} entries yet.`}</strong>{category === "All" ? "When an activity is ready to share, it will appear here." : "Choose another filter to explore."}</div>}
  </>;
}
