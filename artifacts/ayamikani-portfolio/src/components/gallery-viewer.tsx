"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CalendarDays, X } from "lucide-react";
import type { GalleryItem } from "@/lib/supabase/types";

function formatDate(value: string | null) {
  if (!value) return "Date not listed";
  return new Date(`${value}T12:00:00`).toLocaleDateString("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function GalleryDialog({
  item,
  onClose,
}: {
  item: GalleryItem;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      className="gallery-dialog"
      ref={dialogRef}
      aria-label="Gallery photo"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <article className="gallery-dialog-card">
        <div className="gallery-dialog-image">
          <img src={item.image_url} alt={item.caption || "Portfolio gallery photo"} />
        </div>
        <div className="gallery-dialog-caption">
          <header>
            <div className="gallery-date"><CalendarDays size={14} />{formatDate(item.taken_at)}</div>
            <button
              className="certificate-close"
              type="button"
              aria-label="Close photo"
              onClick={() => dialogRef.current?.close()}
            >
              <X size={20} />
            </button>
          </header>
          <p>{item.caption || "A moment worth remembering."}</p>
          <a href={item.image_url} target="_blank" rel="noreferrer">
            Open full image <ArrowUpRight size={14} />
          </a>
        </div>
      </article>
    </dialog>
  );
}

export default function GalleryViewer({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <>
      {items.length ? (
        <div className="gallery-grid">
          {items.map((item, index) => (
            <button
              className="gallery-post"
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              aria-label={`View photo: ${item.caption || "Gallery photo"}`}
              style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
            >
              <span className="gallery-post-image">
                <img
                  src={item.image_url}
                  alt={item.caption || "Portfolio gallery photo"}
                  loading="lazy"
                />
                <span className="gallery-post-overlay">View photo <ArrowUpRight size={15} /></span>
              </span>
              <span className="gallery-post-copy">
                <span className="gallery-date"><CalendarDays size={13} />{formatDate(item.taken_at)}</span>
                {item.caption && <span className="gallery-post-caption">{item.caption}</span>}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-note">
          <strong>A collection in the making.</strong>
          Photos and little moments will appear here as they are added.
        </div>
      )}
      {selected && (
        <GalleryDialog item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
