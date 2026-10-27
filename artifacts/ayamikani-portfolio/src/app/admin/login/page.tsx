import AdminLoginForm from "@/components/admin-login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <main className="login-wrap"><section className="login-art"><div className="brand"><span className="brand-mark">AR</span><span>Ayamikani Rukundo</span></div><div><div className="eyebrow" style={{color:"var(--mint)"}}>Build with care. Edit with care.</div><h1>Every detail deserves a second look.</h1></div><span className="mono" style={{fontSize:10,color:"#aebdb4"}}>PORTFOLIO / CONTENT STUDIO</span></section><section className="login-form-side"><AdminLoginForm nextPath={next || "/admin"}/></section></main>;
}
