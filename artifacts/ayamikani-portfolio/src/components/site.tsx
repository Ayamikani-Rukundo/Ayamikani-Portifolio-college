"use client";

import Link from "next/link";
import { useState, type FocusEvent } from "react";
import { ArrowDownToLine, ArrowUpRight, Check, ChevronDown, ExternalLink, FileText, Link2, LogIn, Menu, X } from "lucide-react";
import type { SocialLink } from "@/lib/supabase/types";
import ThemeToggle from "@/components/theme-toggle";
import BrandMark from "@/components/brand-mark";

const links = [{ href: "/", label: "Home" }, { href: "/about", label: "About" }, { href: "/projects", label: "Projects" }, { href: "/activities", label: "Activities" }, { href: "/certificates", label: "Certificates" }, { href: "/gallery", label: "Gallery" }];
export function SiteHeader({ path = "/", avatarUrl }: { path?: string; avatarUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  const [resumeMenuOpen, setResumeMenuOpen] = useState(false);
  const [resumeHovered, setResumeHovered] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const resumeMenuVisible = resumeMenuOpen || resumeHovered;

  function closeResumeMenu() {
    setResumeMenuOpen(false);
    setResumeHovered(false);
    setCopyError("");
  }

  function handleResumeBlur(event: FocusEvent<HTMLDivElement>) {
    if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
      closeResumeMenu();
    }
  }

  async function copyResumeLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/resume.pdf`);
      setLinkCopied(true);
      setCopyError("");
      window.setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      setCopyError("Couldn’t copy the link. Open the résumé and copy its address instead.");
    }
  }

  return <header className="site-header"><div className="shell header-inner">
    <Link href="/" className="brand"><BrandMark avatarUrl={avatarUrl} /><span className="brand-name-full">Ayamikani Rukundo Emmanuel</span><span className="brand-name-short">Ayamikani</span></Link>
    <button className="mobile-nav-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={19}/> : <Menu size={19}/>}</button>
    <nav className={`nav-links${open ? " open" : ""}`} aria-label="Main navigation">{links.map(item => <Link key={item.href} href={item.href} aria-current={path === item.href ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>
    <div className="header-actions">
      <Link href="/contact" className="header-cta">Let’s talk <ArrowUpRight size={13}/></Link>
      <Link href="/admin/login" className="admin-cta"><LogIn size={14} aria-hidden="true"/><span>Admin</span></Link>
      <ThemeToggle />
      <div
        className={`resume-menu-wrap${resumeMenuVisible ? " open" : ""}`}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setResumeHovered(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          setResumeHovered(false);
          if (!event.currentTarget.contains(document.activeElement)) closeResumeMenu();
        }}
        onFocus={() => setResumeMenuOpen(true)}
        onBlur={handleResumeBlur}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closeResumeMenu();
            if (event.target instanceof HTMLElement) event.target.blur();
          }
        }}
      >
        <button className="resume-nav-button" type="button" aria-expanded={resumeMenuVisible} aria-controls="resume-menu" onClick={() => setResumeMenuOpen(!resumeMenuOpen)}>
          <FileText size={15} aria-hidden="true"/><span>Résumé</span><ChevronDown className="resume-nav-chevron" size={13} aria-hidden="true"/>
        </button>
        <div className={`resume-menu${resumeMenuVisible ? " open" : ""}`} id="resume-menu" role="group" aria-label="Résumé options">
          <span className="resume-menu-eyebrow">A closer look</span>
          <a href="/resume.pdf" target="_blank" rel="noreferrer" className="resume-menu-link" onClick={closeResumeMenu}>
            <ExternalLink size={16} aria-hidden="true"/><span><strong>View résumé</strong><small>Open the full PDF</small></span><ArrowUpRight size={14} aria-hidden="true"/>
          </a>
          <a href="/resume.pdf" download="Ayamikani-Rukundo-Emmanuel-Resume.pdf" className="resume-menu-link" onClick={closeResumeMenu}>
            <ArrowDownToLine size={16} aria-hidden="true"/><span><strong>Download PDF</strong><small>Save a copy to your device</small></span>
          </a>
          <button type="button" className="resume-menu-copy" onClick={copyResumeLink}>
            {linkCopied ? <Check size={15} aria-hidden="true"/> : <Link2 size={15} aria-hidden="true"/>}
            {linkCopied ? "Link copied" : "Copy résumé link"}
          </button>
          <span className="sr-only" aria-live="polite">{copyError}</span>
          {copyError && <p className="resume-copy-error">{copyError}</p>}
        </div>
      </div>
    </div>
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
