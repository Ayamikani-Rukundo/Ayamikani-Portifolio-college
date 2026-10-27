import Link from "next/link";
import AdminLoginForm from "@/components/admin-login-form";
import ThemeToggle from "@/components/theme-toggle";
import BrandMark from "@/components/brand-mark";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <main className="login-wrap"><section className="login-art"><Link href="/" className="brand"><BrandMark /><span>Ayamikani Rukundo Emmanuel</span></Link><div><div className="eyebrow" style={{color:"var(--mint)"}}>Build with care. Edit with care.</div><h1>Every detail deserves a second look.</h1></div><span className="mono" style={{fontSize:10,color:"#b7c5bd"}}>PORTFOLIO / CONTENT STUDIO</span></section><section className="login-form-side"><div className="login-theme"><ThemeToggle /></div><AdminLoginForm nextPath={next || "/admin"}/></section></main>;
}
