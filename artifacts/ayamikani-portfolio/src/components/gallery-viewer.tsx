"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import type { GalleryItem } from "@/lib/supabase/types";

function getImages(item: GalleryItem) {
  return item.image_urls?.length ? item.image_urls : [item.image_url];
}

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
  const [imageIndex, setImageIndex] = useState(0);
  const images = getImages(item);
  const currentImage = images[imageIndex] ?? item.image_url;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  function showPrevious() {
    setImageIndex((index) => (index - 1 + images.length) % images.length);
  }

  function showNext() {
    setImageIndex((index) => (index + 1) % images.length);
  }

  return (
    <dialog
      className="gallery-dialog"
      ref={dialogRef}
      aria-label="Gallery post"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      onKeyDown={(event) => {
        if (images.length < 2) return;
        if (event.key === "ArrowLeft") showPrevious();
        if (event.key === "ArrowRight") showNext();
      }}
    >
      <article className="gallery-dialog-card">
        <div className="gallery-dialog-image">
          <img
            src={currentImage}
            alt={`${item.caption || "Gallery post"} — photo ${imageIndex + 1} of ${images.length}`}
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="gallery-photo-nav gallery-photo-prev"
                aria-label="Previous photo"
                onClick={showPrevious}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="gallery-photo-nav gallery-photo-next"
                aria-label="Next photo"
                onClick={showNext}
              >
                <ChevronRight size={22} />
              </button>
              <span className="gallery-photo-counter" aria-live="polite">
                {imageIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>
        <div className="gallery-dialog-caption">
          <header>
            <div className="gallery-date"><CalendarDays size={14} />{formatDate(item.taken_at)}</div>
            <button
              className="certificate-close"
              type="button"
              aria-label="Close gallery post"
              onClick={() => dialogRef.current?.close()}
            >
              <X size={20} />
            </button>
          </header>
          <p>{item.caption || "A moment worth remembering."}</p>
          {images.length > 1 && (
            <div className="gallery-dialog-thumbnails" aria-label="Choose a photo">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  className={index === imageIndex ? "active" : ""}
                  aria-label={`Show photo ${index + 1}`}
                  aria-pressed={index === imageIndex}
                  onClick={() => setImageIndex(index)}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
          <a href={currentImage} target="_blank" rel="noreferrer">
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
          {items.map((item, index) => {
            const images = getImages(item);
            return (
              <button
                className="gallery-post"
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                aria-label={`View gallery post: ${item.caption || "Photo"}${images.length > 1 ? `, ${images.length} photos` : ""}`}
                style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
              >
                <span className="gallery-post-image">
                  <img
                    src={images[0]}
                    alt={item.caption || "Portfolio gallery photo"}
                    loading="lazy"
                  />
                  {images.length > 1 && (
                    <span className="gallery-post-count">{images.length} photos</span>
                  )}
                  <span className="gallery-post-overlay">
                    {images.length > 1 ? "View photo set" : "View photo"}
                    <ArrowUpRight size={15} />
                  </span>
                </span>
                <span className="gallery-post-copy">
                  <span className="gallery-date"><CalendarDays size={13} />{formatDate(item.taken_at)}</span>
                  {item.caption && <span className="gallery-post-caption">{item.caption}</span>}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="empty-note">
          <strong>A collection in the making.</strong>
          Photos and little moments will appear here as they are added.
        </div>
      )}
      {selected && (
        <GalleryDialog
          key={selected.id}
          item={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
