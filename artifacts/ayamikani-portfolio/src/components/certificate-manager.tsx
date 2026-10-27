"use client";

import { useEffect, useState } from "react";
import {
  createCertificate,
  deleteCertificate,
  updateCertificate,
} from "@/app/actions/portfolio";
import { uploadPortfolioFile } from "@/lib/supabase/client";
import type { Certificate, CertificateInput } from "@/lib/supabase/types";
import PortfolioImage from "@/components/portfolio-image";

const blank: CertificateInput = {
  title: "",
  issuer: "",
  issued_on: null,
  description: "",
  file_url: "",
  credential_url: "",
  featured: false,
  sort_order: 0,
};

function isPdf(url: string) {
  try {
    return new URL(url).pathname.toLowerCase().endsWith(".pdf");
  } catch {
    return false;
  }
}

export default function CertificateManager({
  initial,
}: {
  initial: Certificate[];
}) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setItems(initial), [initial]);

  function startCreate() {
    setEditing(null);
    setCreating(true);
    setError("");
    setMessage("");
  }

  async function remove(item: Certificate) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setDeleting(item.id);
    const result = await deleteCertificate(item.id);
    if (result.ok) {
      setItems((current) => current.filter((row) => row.id !== item.id));
      setMessage("Certificate deleted.");
    } else {
      setError(result.error);
    }
    setDeleting(null);
  }

  async function save(input: CertificateInput) {
    setPending(true);
    setError("");
    setMessage("");
    const result = editing
      ? await updateCertificate(editing.id, input)
      : await createCertificate(input);
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMessage(editing ? "Certificate updated." : "Certificate added.");
    setEditing(null);
    setCreating(false);
  }

  return (
    <div className="admin-content">
      <div className="eyebrow">Portfolio content / Credentials</div>
      <h1>Certificates</h1>
      <p className="admin-subtitle">
        Upload certificates and credentials to share your learning milestones.
      </p>
      {error && <div className="status-message error" role="alert">{error}</div>}
      {message && <div className="status-message" role="status">{message}</div>}
      {!creating && !editing && (
        <div style={{ marginBottom: 18 }}>
          <button className="button primary" type="button" onClick={startCreate}>
            Add certificate +
          </button>
        </div>
      )}
      {(creating || editing) && (
        <CertificateForm
          key={editing?.id ?? "new"}
          initial={editing ? {
            title: editing.title,
            issuer: editing.issuer,
            issued_on: editing.issued_on,
            description: editing.description,
            file_url: editing.file_url,
            credential_url: editing.credential_url,
            featured: editing.featured,
            sort_order: editing.sort_order,
          } : blank}
          pending={pending}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={save}
        />
      )}
      {items.length ? (
        <div className="admin-list">
          {items.map((item) => (
            <div className="admin-row" key={item.id}>
              {isPdf(item.file_url) ? (
                <div className="certificate-admin-pdf" aria-hidden="true"><span>PDF</span></div>
              ) : (
                <PortfolioImage className="preview-image" src={item.file_url} alt={`${item.title} preview`} />
              )}
              <div className="admin-row-main">
                <strong>{item.title}</strong>
                <small>{[item.issuer, item.issued_on].filter(Boolean).join(" · ") || "Certificate"}</small>
              </div>
              {item.featured && <span className="category-tag">Featured</span>}
              <div className="admin-actions">
                <button className="mini-button" type="button" onClick={() => { setEditing(item); setCreating(false); }}>
                  Edit
                </button>
                <button className="mini-button danger" type="button" disabled={!!deleting} onClick={() => void remove(item)}>
                  {deleting === item.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : !creating ? (
        <div className="empty-note">
          <strong>No certificates yet.</strong>
          Add your first certificate when you’re ready to share it.
        </div>
      ) : null}
    </div>
  );
}

function CertificateForm({
  initial,
  pending,
  onCancel,
  onSave,
}: {
  initial: CertificateInput;
  pending: boolean;
  onCancel: () => void;
  onSave: (input: CertificateInput) => void;
}) {
  const [value, setValue] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function change<K extends keyof CertificateInput>(
    key: K,
    next: CertificateInput[K],
  ) {
    setValue((current) => ({ ...current, [key]: next }));
  }

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      change("file_url", await uploadPortfolioFile(file, "certificates"));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      className={`admin-card certificate-form${pending || uploading ? " saving" : ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        onSave(value);
      }}
    >
      <h2>{initial.title ? "Edit certificate" : "Add certificate"}</h2>
      {error && <div className="status-message error" role="alert">{error}</div>}
      <div className="form-grid">
        <label className="field">
          <span>Certificate title</span>
          <input required maxLength={160} value={value.title} onChange={(event) => change("title", event.target.value)} />
        </label>
        <label className="field">
          <span>Issuing organization</span>
          <input maxLength={160} value={value.issuer} onChange={(event) => change("issuer", event.target.value)} />
        </label>
        <label className="field">
          <span>Date earned</span>
          <input type="date" value={value.issued_on || ""} onChange={(event) => change("issued_on", event.target.value || null)} />
        </label>
        <label className="field">
          <span>Display order</span>
          <input type="number" min="0" max="100000" value={value.sort_order} onChange={(event) => change("sort_order", Number(event.target.value) || 0)} />
        </label>
        <label className="field full">
          <span>Description</span>
          <textarea maxLength={5000} value={value.description} onChange={(event) => change("description", event.target.value)} placeholder="What did you learn or accomplish?" />
        </label>
        <label className="field full">
          <span>Certificate file URL</span>
          <input type="url" required value={value.file_url} onChange={(event) => change("file_url", event.target.value)} placeholder="Upload a PDF or image below" />
        </label>
        <label className="field full certificate-upload-field">
          <span>Upload certificate (PDF or image)</span>
          <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void upload(event.target.files?.[0])} />
          <small>PDF, JPG, PNG, WebP or GIF · up to 8 MB for PDF, 10 MB for images</small>
        </label>
        <label className="field full">
          <span>Credential verification URL (optional)</span>
          <input type="url" value={value.credential_url} onChange={(event) => change("credential_url", event.target.value)} />
        </label>
      </div>
      <label className="check-row certificate-featured-check">
        <input type="checkbox" checked={value.featured} onChange={(event) => change("featured", event.target.checked)} />
        Feature this certificate
      </label>
      <div className="form-actions">
        <button className="button primary" disabled={pending || uploading}>
          {uploading ? "Uploading…" : pending ? "Saving…" : "Save certificate"}
        </button>
        <button className="button" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
