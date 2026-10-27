"use client";
import { useState } from "react";
import { createSocialLink, updateSocialLink, deleteSocialLink, createProject, updateProject, deleteProject, createActivity, updateActivity, deleteActivity } from "@/app/actions/portfolio";
import { uploadPortfolioFile } from "@/lib/supabase/client";
import { ACTIVITY_CATEGORIES, type Activity, type ActivityInput, type Project, type ProjectInput, type SocialLink, type SocialLinkInput } from "@/lib/supabase/types";
import PortfolioImage from "@/components/portfolio-image";

type Resource="social-links"|"projects"|"activities";
type Row=SocialLink|Project|Activity;
const blank=(resource:Resource):Record<string,any>=> resource==="social-links" ? {label:"",url:"",icon_name:"",sort_order:0} : resource==="projects" ? {title:"",slug:"",summary:"",description:"",tech_stack:"",cover_image_url:"",live_url:"",repo_url:"",featured:false,sort_order:0} : {title:"",organization:"",role:"",category:"Other",start_date:"",end_date:"",is_current:false,description:"",image_url:"",link_url:"",featured:false,sort_order:0};
const labels={"social-links":"Social links",projects:"Projects",activities:"Activities"};

export default function ContentManager({resource,initial,startOpen=false}:{resource:Resource;initial:Row[];startOpen?:boolean}) {
  const [items,setItems]=useState<Row[]>(initial); const [editing,setEditing]=useState<Row|null>(null); const [creating,setCreating]=useState(startOpen); const [pending,setPending]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState("");
  function startCreate(){setEditing(null);setCreating(true);setError("");setMessage("");}
  function startEdit(item:Row){setEditing(item);setCreating(false);setError("");setMessage("");}
  async function onDelete(item:Row){const name=("title" in item?item.title:item.label); if(!window.confirm(`Delete “${name}”? This cannot be undone.`))return;
    const result=resource==="projects"?await deleteProject(item.id):resource==="activities"?await deleteActivity(item.id):await deleteSocialLink(item.id);
    if(result.ok){setItems(items.filter(row=>row.id!==item.id));setMessage("Item deleted.");}else setError(result.error);
  }
  async function save(data:Record<string,any>){
    setPending(true);setError("");setMessage("");
    let result;
    if(resource==="social-links"){
      const input:SocialLinkInput={label:data.label,url:data.url,icon_name:data.icon_name,sort_order:Number(data.sort_order)||0};
      result=editing?await updateSocialLink(editing.id,input):await createSocialLink(input);
      if(result.ok&&editing){setItems(items.map(i=>i.id===editing.id?({...editing,...input} as Row):i));}
    } else if(resource==="projects"){
      const input:ProjectInput={title:data.title,slug:data.slug,summary:data.summary,description:data.description,tech_stack:String(data.tech_stack).split(",").map((s:string)=>s.trim()).filter(Boolean),cover_image_url:data.cover_image_url||null,live_url:data.live_url,repo_url:data.repo_url,featured:Boolean(data.featured),sort_order:Number(data.sort_order)||0};
      result=editing?await updateProject(editing.id,input):await createProject(input);
      if(result.ok&&editing){setItems(items.map(i=>i.id===editing.id?({...editing,...input} as Row):i));}
    } else {
      const input:ActivityInput={title:data.title,organization:data.organization,role:data.role,category:data.category,start_date:data.start_date||null,end_date:data.is_current?null:(data.end_date||null),is_current:Boolean(data.is_current),description:data.description,image_url:data.image_url||null,link_url:data.link_url||null,featured:Boolean(data.featured),sort_order:Number(data.sort_order)||0};
      result=editing?await updateActivity(editing.id,input):await createActivity(input);
      if(result.ok&&editing){setItems(items.map(i=>i.id===editing.id?({...editing,...input} as Row):i));}
    }
    setPending(false);
    if(result?.ok){setMessage(editing?"Changes saved.":"Item created.");setEditing(null);setCreating(false);if(!editing)window.setTimeout(()=>window.location.reload(),700);}else setError(result?.error||"Could not save this item.");
  }
  const showForm=creating||!!editing;
  return <div className="admin-content">
    <div className="eyebrow">Portfolio content / {labels[resource]}</div><h1>{labels[resource]}</h1><p className="admin-subtitle">Manage what appears in the public portfolio. Changes are saved to Supabase.</p>
    {error&&<div className="status-message error" role="alert">{error}</div>}{message&&<div className="status-message" role="status">{message}</div>}
    {!showForm&&<div style={{marginBottom:18}}><button className="button primary" onClick={startCreate}>Add {resource==="social-links"?"social link":resource==="projects"?"project":"activity"} +</button></div>}
    {showForm&&<Editor resource={resource} initial={editing?editorValue(editing,resource):blank(resource)} pending={pending} onCancel={()=>{setEditing(null);setCreating(false);}} onSave={save}/>}
    {items.length? <div className="admin-list">{items.map(item=><div className="admin-row" key={item.id}>
      {"cover_image_url" in item ? <PortfolioImage className="preview-image" src={item.cover_image_url} alt={`${item.title} cover`}/> : "image_url" in item ? <PortfolioImage className="preview-image" src={item.image_url} alt={`${item.title} image`}/> : null}
      <div className="admin-row-main"><strong>{"title" in item?item.title:item.label}</strong><small>{"slug" in item?`/${item.slug}`:"organization" in item?[item.role,item.organization,item.category].filter(Boolean).join(" · "):item.url}</small></div>
      {("featured" in item&&item.featured)&&<span className="category-tag">Featured</span>}
      <div className="admin-actions"><button className="mini-button" onClick={()=>startEdit(item)}>Edit</button><button className="mini-button danger" onClick={()=>void onDelete(item)}>Delete</button></div>
    </div>)}</div>:!showForm&&<div className="empty-note"><strong>No {labels[resource].toLowerCase()} yet.</strong>This list is intentionally empty. Add the first item when you’re ready to share it publicly.</div>}
  </div>;
}
function editorValue(item:Row,resource:Resource):Record<string,any>{
  if(resource==="social-links")return {...item};
  if(resource==="projects"){const p=item as Project;return {...p,tech_stack:p.tech_stack.join(", "),cover_image_url:p.cover_image_url||""};}
  const a=item as Activity;return {...a,start_date:a.start_date||"",end_date:a.end_date||"",image_url:a.image_url||"",link_url:a.link_url||""};
}
function Editor({resource,initial,pending,onCancel,onSave}:{resource:Resource;initial:Record<string,any>;pending:boolean;onCancel:()=>void;onSave:(data:Record<string,any>)=>void}){
  const [data,setData]=useState(initial);const [uploading,setUploading]=useState(false);const [uploadError,setUploadError]=useState("");
  function set(key:string,value:any){setData((old:any)=>({...old,[key]:value}));}
  async function upload(key:"cover_image_url"|"image_url",file?:File){if(!file)return;setUploading(true);setUploadError("");try{set(key,await uploadPortfolioFile(file,resource==="projects"?"projects":"activities"));}catch(e){setUploadError(e instanceof Error?e.message:"Upload failed.");}finally{setUploading(false);}}
  const project=resource==="projects",activity=resource==="activities",social=resource==="social-links";
  return <form className={`admin-card${pending||uploading?" saving":""}`} onSubmit={e=>{e.preventDefault();onSave(data);}}>
    <h2 style={{font:"600 25px var(--serif)",marginTop:0}}>{initial.title||initial.label?"Edit":"Add"} {labels[resource].replace(/s$/,"").replace("Social link","social link")}</h2>
    {uploadError&&<div className="status-message error">{uploadError}</div>}
    <div className="form-grid">
      {social&&<><Input label="Label" required value={data.label} onChange={v=>set("label",v)}/><Input label="URL" type="url" required value={data.url} onChange={v=>set("url",v)}/><Input label="Icon name" hint="Optional label such as github or linkedin" value={data.icon_name} onChange={v=>set("icon_name",v)}/><Input label="Display order" type="number" value={data.sort_order} onChange={v=>set("sort_order",v)}/></>}
      {project&&<><Input label="Project title" required value={data.title} onChange={v=>set("title",v)}/><Input label="URL slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" hint="lowercase-words-separated-by-hyphens" value={data.slug} onChange={v=>set("slug",v)}/><Area label="Short summary" required full value={data.summary} onChange={v=>set("summary",v)}/><Area label="Project description" full value={data.description} onChange={v=>set("description",v)}/><Input label="Tools / technologies" hint="Separate each with a comma" full value={data.tech_stack} onChange={v=>set("tech_stack",v)}/><Input label="Cover image URL" type="url" value={data.cover_image_url} onChange={v=>set("cover_image_url",v)}/><FileField label="Upload cover image" onChange={f=>void upload("cover_image_url",f)}/><Input label="Live project URL" type="url" value={data.live_url} onChange={v=>set("live_url",v)}/><Input label="Repository URL" type="url" value={data.repo_url} onChange={v=>set("repo_url",v)}/><Input label="Display order" type="number" value={data.sort_order} onChange={v=>set("sort_order",v)}/></>}
      {activity&&<><Input label="Activity title" required value={data.title} onChange={v=>set("title",v)}/><Input label="Organization" value={data.organization} onChange={v=>set("organization",v)}/><Input label="Role" value={data.role} onChange={v=>set("role",v)}/><Select label="Category" value={data.category} options={[...ACTIVITY_CATEGORIES]} onChange={v=>set("category",v)}/><Input label="Start date" type="date" value={data.start_date} onChange={v=>set("start_date",v)}/><Input label="End date" type="date" value={data.end_date} disabled={data.is_current} onChange={v=>set("end_date",v)}/><Area label="Description" full value={data.description} onChange={v=>set("description",v)}/><Input label="Image URL" type="url" value={data.image_url} onChange={v=>set("image_url",v)}/><FileField label="Upload image" onChange={f=>void upload("image_url",f)}/><Input label="Related link URL" type="url" value={data.link_url} onChange={v=>set("link_url",v)}/><Input label="Display order" type="number" value={data.sort_order} onChange={v=>set("sort_order",v)}/></>}
    </div>
    {!social&&<div className="check-row" style={{marginTop:18}}>{activity&&<label><input type="checkbox" checked={!!data.is_current} onChange={e=>set("is_current",e.target.checked)}/> Current activity</label>}<label><input type="checkbox" checked={!!data.featured} onChange={e=>set("featured",e.target.checked)}/> Feature this item</label></div>}
    {(project||activity)&&<div style={{marginTop:15}}><PortfolioImage className="preview-image" src={data.cover_image_url||data.image_url||null} alt="Current image preview"/></div>}
    <div className="form-actions"><button className="button primary" disabled={pending||uploading}>{uploading?"Uploading…":pending?"Saving…":"Save changes"}</button><button type="button" className="button" onClick={onCancel}>Cancel</button></div>
  </form>;
}
function Input({label,value,onChange,type="text",required=false,hint,full=false,disabled=false,pattern}:{label:string;value:any;onChange:(v:string)=>void;type?:string;required?:boolean;hint?:string;full?:boolean;disabled?:boolean;pattern?:string}){return <div className={`field${full?" full":""}`}><label>{label}<input type={type} required={required} disabled={disabled} pattern={pattern} value={value??""} onChange={e=>onChange(e.target.value)}/></label>{hint&&<span className="field-hint">{hint}</span>}</div>}
function Area({label,value,onChange,required=false,full=false}:{label:string;value:any;onChange:(v:string)=>void;required?:boolean;full?:boolean}){return <div className={`field${full?" full":""}`}><label>{label}<textarea required={required} value={value??""} onChange={e=>onChange(e.target.value)}/></label></div>}
function Select({label,value,options,onChange}:{label:string;value:string;options:string[];onChange:(v:string)=>void}){return <div className="field"><label>{label}<select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></label></div>}
function FileField({label,onChange}:{label:string;onChange:(f?:File)=>void}){return <div className="field"><label>{label}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e=>onChange(e.target.files?.[0])}/></label><span className="field-hint">JPG, PNG, WebP or GIF · up to 10 MB</span></div>}
