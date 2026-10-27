"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
} from "@/app/actions/portfolio";
import { uploadPortfolioFile } from "@/lib/supabase/client";
import type { GalleryItem, GalleryItemInput } from "@/lib/supabase/types";
import PortfolioImage from "@/components/portfolio-image";

const blank: GalleryItemInput = {
  image_url: "",
  caption: "",
  taken_at: null,
  sort_order: 0,
};

function inputFor(item: GalleryItem): GalleryItemInput {
  return {
    image_url: item.image_url,
    caption: item.caption,
    taken_at: item.taken_at,
    sort_order: item.sort_order,
  };
}

export default function GalleryManager({ initial }: { initial: GalleryItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
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

  async function remove(item: GalleryItem) {
    if (!window.confirm("Delete this gallery photo? This cannot be undone.")) return;
    setDeleting(item.id);
    setError("");
    const result = await deleteGalleryItem(item.id);
    if (result.ok) {
      setItems((current) => current.filter((row) => row.id !== item.id));
      setMessage("Photo deleted.");
      router.refresh();
    } else {
      setError(result.error);
    }
    setDeleting(null);
  }

  async function save(input: GalleryItemInput) {
    setPending(true);
    setError("");
    setMessage("");
    const result = editing
      ? await updateGalleryItem(editing.id, input)
      : await createGalleryItem(input);
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMessage(editing ? "Photo updated." : "Photo added.");
    setEditing(null);
    setCreating(false);
    router.refresh();
  }

  return (
    <div className="admin-content">
      <div className="eyebrow">Portfolio content / Moments</div>
      <h1>Gallery</h1>
      <p className="admin-subtitle">
        Share photos with the date and a short caption, like a small visual journal.
      </p>
      {error && <div className="status-message error" role="alert">{error}</div>}
      {message && <div className="status-message" role="status">{message}</div>}
      {!creating && !editing && (
        <div style={{ marginBottom: 18 }}>
          <button className="button primary" type="button" onClick={startCreate}>
            Add photo +
          </button>
        </div>
      )}
      {(creating || editing) && (
        <GalleryForm
          key={editing?.id ?? "new"}
          initial={editing ? inputFor(editing) : blank}
          pending={pending}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={save}
        />
      )}
      {items.length ? (
        <div className="gallery-admin-grid">
          {items.map((item) => (
            <article className="gallery-admin-card" key={item.id}>
              <PortfolioImage
                className="gallery-admin-image"
                src={item.image_url}
                alt={item.caption || "Gallery photo"}
              />
              <div className="gallery-admin-copy">
                <small>{item.taken_at || "Date not listed"}</small>
                <p>{item.caption || "No caption"}</p>
                <div className="admin-actions">
                  <button
                    className="mini-button"
                    type="button"
                    onClick={() => { setEditing(item); setCreating(false); setError(""); setMessage(""); }}
                  >
                    Edit
                  </button>
                  <button
                    className="mini-button danger"
                    type="button"
                    disabled={!!deleting}
                    onClick={() => void remove(item)}
                  >
                    {deleting === item.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : !creating ? (
        <div className="empty-note">
          <strong>No photos yet.</strong>
          Add a photo with its date and caption when you’re ready.
        </div>
      ) : null}
    </div>
  );
}

function GalleryForm({
  initial,
  pending,
  onCancel,
  onSave,
}: {
  initial: GalleryItemInput;
  pending: boolean;
  onCancel: () => void;
  onSave: (input: GalleryItemInput) => void;
}) {
  const [value, setValue] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function change<K extends keyof GalleryItemInput>(
    key: K,
    next: GalleryItemInput[K],
  ) {
    setValue((current) => ({ ...current, [key]: next }));
  }

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      change("image_url", await uploadPortfolioFile(file, "gallery"));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      className={`admin-card gallery-form${pending || uploading ? " saving" : ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        onSave(value);
      }}
    >
      <h2>{initial.image_url ? "Edit photo" : "Add a photo"}</h2>
      {error && <div className="status-message error" role="alert">{error}</div>}
      <div className="form-grid">
        <label className="field full">
          <span>Upload photo</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required={!value.image_url}
            onChange={(event) => void upload(event.target.files?.[0])}
          />
          <small>JPG, PNG, WebP or GIF · up to 10 MB. Images display without cropping.</small>
        </label>
        {value.image_url && (
          <div className="field full gallery-upload-preview">
            <span>Photo preview</span>
            <PortfolioImage
              className="gallery-form-image"
              src={value.image_url}
              alt="Uploaded gallery photo preview"
            />
          </div>
        )}
        <label className="field">
          <span>Date taken (optional)</span>
          <input
            type="date"
            value={value.taken_at || ""}
            onChange={(event) => change("taken_at", event.target.value || null)}
          />
        </label>
        <label className="field">
          <span>Display order</span>
          <input
            type="number"
            min="0"
            max="100000"
            value={value.sort_order}
            onChange={(event) => change("sort_order", Number(event.target.value) || 0)}
          />
        </label>
        <label className="field full">
          <span>Caption</span>
          <textarea
            maxLength={2200}
            value={value.caption}
            onChange={(event) => change("caption", event.target.value)}
            placeholder="Add a little context to this moment…"
          />
        </label>
      </div>
      <div className="form-actions">
        <button className="button primary" disabled={pending || uploading || !value.image_url}>
          {uploading ? "Uploading…" : pending ? "Saving…" : "Save photo"}
        </button>
        <button className="button" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
