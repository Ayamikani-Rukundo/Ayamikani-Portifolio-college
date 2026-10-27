"use client";

import { useState } from "react";

const palettes = [
  "linear-gradient(140deg, #a59bd7, #e9abc1 52%, #efc950)",
  "linear-gradient(140deg, #b9dec9, #235bd4 55%, #a59bd7)",
  "linear-gradient(140deg, #efc950, #ed735d 52%, #e9abc1)",
  "linear-gradient(140deg, #235bd4, #a59bd7 55%, #b9dec9)",
];

export default function PortfolioImage({
  src,
  alt,
  className = "",
  tone = 0,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  tone?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`portfolio-image-fallback ${className}`}
        role="img"
        aria-label={alt || "Colorful portfolio artwork"}
        style={{ background: palettes[Math.abs(tone) % palettes.length] }}
      >
        <span className="portfolio-image-mark" aria-hidden="true">
          A.
        </span>
        <span className="portfolio-image-orbit" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
