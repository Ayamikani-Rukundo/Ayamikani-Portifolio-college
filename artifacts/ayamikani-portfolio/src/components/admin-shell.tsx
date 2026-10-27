import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAdmin } from "@/app/actions/auth";

const nav = [["/admin","Overview"],["/admin/profile","Profile"],["/admin/social-links","Social links"],["/admin/projects","Projects"],["/admin/activities","Activities"]];
export function AdminShell({ children, path }: { children: ReactNode; path: string }) {
  const section = path === "/admin" ? "Overview" : path.split("/").pop()?.replace("-", " ");
  return <div className="admin-shell"><aside className="admin-side">
    <Link href="/" className="admin-brand"><span className="brand-mark">AR</span><span>Portfolio editor<small>AYAMIKANI RUKUNDO</small></span></Link>
    <nav className="admin-nav" aria-label="Admin navigation"><span className="admin-nav-label">Workspace</span>{nav.map(([href,label])=><Link key={href} href={href} aria-current={path===href?"page":undefined}><span aria-hidden="true">{label==="Overview"?"◌":label==="Profile"?"◍":label==="Social links"?"↗":label==="Projects"?"▧":"◷"}</span>{label}</Link>)}</nav>
    <div className="admin-bottom">A careful workbench.<br/>Changes publish to the portfolio.</div>
  </aside><div className="admin-main"><header className="admin-topbar"><span className="eyebrow">{section}</span><div style={{display:"flex",gap:20,alignItems:"center"}}><Link href="/" target="_blank">View portfolio ↗</Link><form action={signOutAdmin}><button className="mini-button" type="submit">Sign out</button></form></div></header>{children}</div></div>;
}
export function AdminPageHeading({ eyebrow, title, description }: { eyebrow:string; title:string; description:string }) {
  return <><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="admin-subtitle">{description}</p></>;
}
