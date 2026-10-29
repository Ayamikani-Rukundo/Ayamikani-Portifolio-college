"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
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
  image_urls: [],
  caption: "",
  taken_at: null,
  sort_order: 0,
};

function inputFor(item: GalleryItem): GalleryItemInput {
  const imageUrls = item.image_urls?.length ? item.image_urls : [item.image_url];
  return {
    image_url: imageUrls[0] ?? item.image_url,
    image_urls: imageUrls,
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
        Create event-style posts with multiple photos, a date, and a shared caption.
      </p>
      {error && <div className="status-message error" role="alert">{error}</div>}
      {message && <div className="status-message" role="status">{message}</div>}
      {!creating && !editing && (
        <div style={{ marginBottom: 18 }}>
          <button className="button primary" type="button" onClick={startCreate}>
            Add post +
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
                src={item.image_urls?.[0] || item.image_url}
                alt={item.caption || "Gallery photo"}
              />
              <div className="gallery-admin-copy">
                <small>{item.taken_at || "Date not listed"}</small>
                <small>{(item.image_urls?.length || 1)} {(item.image_urls?.length || 1) === 1 ? "photo" : "photos"}</small>
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

  const imageUrls = value.image_urls?.length
    ? value.image_urls
    : value.image_url
      ? [value.image_url]
      : [];

  function change<K extends keyof GalleryItemInput>(
    key: K,
    next: GalleryItemInput[K],
  ) {
    setValue((current) => ({ ...current, [key]: next }));
  }

  async function uploadFiles(files: File[]) {
    if (!files.length) return;
    setUploading(true);
    setError("");
    let remainingSlots = 30 - imageUrls.length;
    try {
      for (const file of files) {
        if (remainingSlots <= 0) {
          setError("A post can contain up to 30 photos. The remaining files were not uploaded.");
          break;
        }
        try {
          const url = await uploadPortfolioFile(file, "gallery");
          setValue((current) => {
            const currentUrls = current.image_urls?.length
              ? current.image_urls
              : current.image_url
                ? [current.image_url]
                : [];
            const nextUrls = [...currentUrls, url];
            return { ...current, image_url: nextUrls[0], image_urls: nextUrls };
          });
          remainingSlots -= 1;
        } catch (uploadError) {
          setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
          break;
        }
      }
    } finally {
      setUploading(false);
    }
  }

  function movePhoto(index: number, offset: -1 | 1) {
    const target = index + offset;
    if (target < 0 || target >= imageUrls.length) return;
    const nextUrls = [...imageUrls];
    [nextUrls[index], nextUrls[target]] = [nextUrls[target], nextUrls[index]];
    setValue((current) => ({ ...current, image_url: nextUrls[0], image_urls: nextUrls }));
  }

  function removePhoto(index: number) {
    const nextUrls = imageUrls.filter((_, currentIndex) => currentIndex !== index);
    setValue((current) => ({
      ...current,
      image_url: nextUrls[0] ?? "",
      image_urls: nextUrls,
    }));
  }

  return (
    <form
      className={`admin-card gallery-form${pending || uploading ? " saving" : ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        onSave(value);
      }}
    >
      <h2>{initial.image_urls.length ? "Edit gallery post" : "Create a gallery post"}</h2>
      {error && <div className="status-message error" role="alert">{error}</div>}
      <div className="form-grid">
        <label className="field full">
          <span>Add photos to this post</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";
              void uploadFiles(files);
            }}
          />
          <small>Choose several images at once. JPG, PNG, WebP or GIF · up to 10 MB per image · up to 30 photos per post.</small>
        </label>
        {imageUrls.length > 0 && (
          <div className="field full gallery-upload-preview">
            <span>Post photos · {imageUrls.length}</span>
            <div className="gallery-form-photos">
              {imageUrls.map((url, index) => (
                <div className="gallery-form-photo" key={`${url}-${index}`}>
                  <PortfolioImage
                    className="gallery-form-image"
                    src={url}
                    alt={`Gallery photo ${index + 1}`}
                  />
                  <span className="gallery-form-photo-index">{String(index + 1).padStart(2, "0")}</span>
                  <div className="gallery-form-photo-actions">
                    <button
                      type="button"
                      className="mini-button"
                      aria-label={`Move photo ${index + 1} earlier`}
                      disabled={index === 0}
                      onClick={() => movePhoto(index, -1)}
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      className="mini-button"
                      aria-label={`Move photo ${index + 1} later`}
                      disabled={index === imageUrls.length - 1}
                      onClick={() => movePhoto(index, 1)}
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      className="mini-button danger"
                      aria-label={`Remove photo ${index + 1}`}
                      onClick={() => removePhoto(index)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <label className="gallery-add-photo">
                <ImagePlus size={20} />
                <span>Add photos</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    event.target.value = "";
                    void uploadFiles(files);
                  }}
                />
              </label>
            </div>
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
        <button className="button primary" disabled={pending || uploading || !imageUrls.length}>
          {uploading ? "Uploading…" : pending ? "Saving…" : "Save post"}
        </button>
        <button className="button" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
