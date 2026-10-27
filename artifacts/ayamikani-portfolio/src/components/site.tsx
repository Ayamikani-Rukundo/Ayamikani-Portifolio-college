"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { SocialLink } from "@/lib/supabase/types";

const links = [{ href: "/", label: "Home" }, { href: "/about", label: "About" }, { href: "/projects", label: "Projects" }, { href: "/activities", label: "Activities" }];
export function SiteHeader({ path = "/" }: { path?: string }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="shell header-inner">
    <Link href="/" className="brand"><span className="brand-mark">AR</span><span>Ayamikani Rukundo</span></Link>
    <button className="mobile-nav-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={19}/> : <Menu size={19}/>}</button>
    <nav className={`nav-links${open ? " open" : ""}`} aria-label="Main navigation">{links.map(item => <Link key={item.href} href={item.href} aria-current={path === item.href ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>
    <Link href="/contact" className="header-cta">Let’s talk <ArrowUpRight size={14}/></Link>
  </div></header>;
}
export function SiteFooter({ socialLinks = [] }: { socialLinks?: SocialLink[] }) {
  return <footer className="site-footer"><div className="shell footer-inner">
    <Link href="/" className="brand"><span className="brand-mark">AR</span><span>Ayamikani Rukundo</span></Link>
    <div className="footer-links">{socialLinks.map(link => <a key={link.id} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}<Link href="/contact">Contact</Link></div>
    <span className="footer-credit">Built with purpose · © {new Date().getFullYear()}</span>
  </div></footer>;
}
export function Intro() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("are-intro-seen") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
         setShow(true); sessionStorage.setItem("are-intro-seen", "1");
         const timer = window.setTimeout(() => setShow(false), 2300); return () => window.clearTimeout(timer);
      }
    } catch { /* content remains available if storage is blocked */ }
    return undefined;
  }, []);
  return <AnimatePresence>{show && <motion.div className="intro-overlay" aria-hidden="true" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.45}}><motion.span className="intro-word" initial={{opacity:0,y:18,scale:.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.65,ease:[.2,.8,.2,1]}}>Make it matter.</motion.span></motion.div>}</AnimatePresence>;
}
export function PublicFrame({ children, path, socialLinks }: { children: React.ReactNode; path: string; socialLinks?: SocialLink[] }) {
  return <><Intro/><SiteHeader path={path}/><main>{children}</main><SiteFooter socialLinks={socialLinks}/></>;
}
export function SetupNeeded() {
  return <main className="setup-screen"><section className="setup-card"><div className="eyebrow">One small setup step</div><h1>The portfolio is almost ready.</h1><p>Add the Supabase project URL and public anon key to the two variables below in <code>.env.local</code> (or your Vercel environment settings). Run <code>supabase/schema.sql</code> in the Supabase SQL Editor before using the private editor.</p><pre className="setup-vars">NEXT_PUBLIC_SUPABASE_URL=<br/>NEXT_PUBLIC_SUPABASE_ANON_KEY=</pre><p>Public sign-ups should be disabled in Supabase. Create the admin account manually in Authentication → Users.</p><a className="button primary" href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">Open Supabase <ArrowUpRight size={15}/></a></section></main>;
}
