"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, LogIn, Menu, X } from "lucide-react";
import type { SocialLink } from "@/lib/supabase/types";
import ThemeToggle from "@/components/theme-toggle";
import BrandMark from "@/components/brand-mark";

const links = [{ href: "/", label: "Home" }, { href: "/about", label: "About" }, { href: "/projects", label: "Projects" }, { href: "/activities", label: "Activities" }];
export function SiteHeader({ path = "/", avatarUrl }: { path?: string; avatarUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="shell header-inner">
    <Link href="/" className="brand"><BrandMark avatarUrl={avatarUrl} /><span className="brand-name-full">Ayamikani Rukundo Emmanuel</span><span className="brand-name-short">Ayamikani</span></Link>
    <button className="mobile-nav-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={19}/> : <Menu size={19}/>}</button>
    <nav className={`nav-links${open ? " open" : ""}`} aria-label="Main navigation">{links.map(item => <Link key={item.href} href={item.href} aria-current={path === item.href ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>
    <Link href="/contact" className="header-cta">Let’s talk <ArrowUpRight size={14}/></Link>
    <Link href="/admin/login" className="admin-cta"><LogIn size={15} aria-hidden="true"/><span>Admin</span></Link>
    <ThemeToggle />
  </div></header>;
}
export function SiteFooter({ socialLinks = [], avatarUrl }: { socialLinks?: SocialLink[]; avatarUrl?: string | null }) {
  return <footer className="site-footer"><div className="shell footer-inner">
    <Link href="/" className="brand"><BrandMark avatarUrl={avatarUrl} /><span>Ayamikani Rukundo Emmanuel</span></Link>
    <div className="footer-links">{socialLinks.map(link => <a key={link.id} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}<Link href="/contact">Contact</Link></div>
    <span className="footer-credit">Built with purpose · © {new Date().getFullYear()}</span>
  </div></footer>;
}
export function PublicFrame({ children, path, socialLinks, avatarUrl }: { children: React.ReactNode; path: string; socialLinks?: SocialLink[]; avatarUrl?: string | null }) {
  return <><SiteHeader path={path} avatarUrl={avatarUrl}/><main>{children}</main><SiteFooter socialLinks={socialLinks} avatarUrl={avatarUrl}/></>;
}
export function SetupNeeded() {
  return <main className="setup-screen"><div className="setup-theme"><ThemeToggle /></div><section className="setup-card"><div className="eyebrow">One small setup step</div><h1>The portfolio is almost ready.</h1><p>Add the Supabase project URL and public anon key to the two variables below in <code>.env.local</code> (or your Vercel environment settings). Run <code>supabase/schema.sql</code> in the Supabase SQL Editor before using the private editor.</p><pre className="setup-vars">NEXT_PUBLIC_SUPABASE_URL=<br/>NEXT_PUBLIC_SUPABASE_ANON_KEY=</pre><p>Public sign-ups should be disabled in Supabase. Create the admin account manually in Authentication → Users.</p><a className="button primary" href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">Open Supabase <ArrowUpRight size={15}/></a></section></main>;
}
