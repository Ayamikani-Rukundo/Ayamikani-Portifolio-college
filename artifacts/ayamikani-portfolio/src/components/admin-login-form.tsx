"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import { signInAdmin } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [pending,setPending]=useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    if (!email.trim() || !password) { setError("Enter your email and password to continue."); return; }
    setPending(true);
    try { const result=await signInAdmin(email.trim(),password,nextPath); if(result?.error) setError(result.error); }
    catch { setError("We couldn’t sign you in just now. Please try again."); }
    finally { setPending(false); }
  }
  if (!isSupabaseConfigured) return <div className="status-message error">Supabase is not configured. Add the project URL and public anon key before signing in.</div>;
  return <form className={`login-form${pending?" saving":""}`} onSubmit={submit}>
    <div className="eyebrow">Private workspace</div><h2>Welcome back.</h2><p>Sign in to shape what the world sees.</p>
    {error && <div className="status-message error" role="alert">{error}</div>}
    <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} /></div>
    <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /></div>
    <button className="button primary" type="submit" disabled={pending}>{pending?"Signing in…":"Sign in"}</button>
  </form>;
}
