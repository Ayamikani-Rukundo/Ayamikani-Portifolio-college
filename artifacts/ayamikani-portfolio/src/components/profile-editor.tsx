"use client";
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { saveProfile } from "@/app/actions/portfolio";
import { uploadPortfolioFile } from "@/lib/supabase/client";
import type { Profile, ProfileInput } from "@/lib/supabase/types";
import PortfolioImage from "@/components/portfolio-image";

const blank: ProfileInput = { full_name:"Ayamikani Rukundo Emmanuel", headline:"", short_bio:"", long_bio:"", location:"", email:"", avatar_url:"", resume_url:"" };
export default function ProfileEditor({ profile }: { profile: Profile | null }) {
  const [value,setValue]=useState<ProfileInput>(profile ? {...profile} : blank);
  const [dirty,setDirty]=useState(false);
  const [pending,setPending]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState("");
  useEffect(()=>{if(!dirty)setValue(profile ? {...profile} : blank);},[profile]);
  function change(key:keyof ProfileInput,val:string){setDirty(true);setValue(old=>({...old,[key]:val}));}
  async function upload(key:"avatar_url"|"resume_url",file?:File) {
    if(!file)return; setError("");setMessage("Uploading file…");
    try{const url=await uploadPortfolioFile(file,"profile");change(key,url);setMessage("Upload complete. Save your profile to publish it.");}
    catch(e){setError(e instanceof Error?e.message:"Upload failed.");setMessage("");}
  }
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setPending(true);setError("");setMessage("");
    const result=await saveProfile(value);setPending(false);
    if(result.ok){setDirty(false);setMessage("Profile saved. Your public portfolio will update shortly.");}else setError(result.error);
  }
  return <form className={pending?"saving":""} onSubmit={submit}>
    {error&&<div className="status-message error" role="alert">{error}</div>}{message&&<div className="status-message" role="status">{message}</div>}
    <div className="form-grid">
      <Field label="Full name"><input required maxLength={120} value={value.full_name} onChange={e=>change("full_name",e.target.value)}/></Field>
      <Field label="Headline"><input maxLength={180} placeholder="Student developer · community-minded builder" value={value.headline} onChange={e=>change("headline",e.target.value)}/></Field>
      <Field label="Email"><input type="email" value={value.email} onChange={e=>change("email",e.target.value)}/></Field>
      <Field label="Location"><input value={value.location} onChange={e=>change("location",e.target.value)}/></Field>
      <Field label="Short introduction" full><textarea maxLength={500} value={value.short_bio} onChange={e=>change("short_bio",e.target.value)}/><span className="field-hint">{value.short_bio.length}/500 characters</span></Field>
      <Field label="Long biography" full><textarea style={{minHeight:230}} value={value.long_bio} onChange={e=>change("long_bio",e.target.value)}/></Field>
      <Field label="Avatar image URL"><input type="url" value={value.avatar_url} onChange={e=>change("avatar_url",e.target.value)}/></Field>
      <Field label="Upload avatar"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e=>void upload("avatar_url",e.target.files?.[0])}/></Field>
      <div className="field full"><span className="field-hint">Avatar preview</span><PortfolioImage src={value.avatar_url} alt="Profile image preview" className="profile-image-preview"/></div>
      <Field label="Résumé URL"><input type="url" value={value.resume_url} onChange={e=>change("resume_url",e.target.value)}/></Field>
      <Field label="Upload résumé (PDF)"><input type="file" accept="application/pdf" onChange={e=>void upload("resume_url",e.target.files?.[0])}/></Field>
    </div>
    <div className="form-actions"><button className="button primary" disabled={pending}>{pending?"Saving…":"Save profile"}</button></div>
  </form>;
}
function Field({label,children,full=false}:{label:string;children:ReactNode;full?:boolean}){return <div className={`field${full?" full":""}`}><label>{label}{children}</label></div>}
