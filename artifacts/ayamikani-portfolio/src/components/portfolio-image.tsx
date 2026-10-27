"use client";

import { useState } from "react";

const palettes = [
  "linear-gradient(140deg, #aa8be5, #ef9eb9 52%, #f2c56b)",
  "linear-gradient(140deg, #a5dbc6, #7045b8 55%, #e87532)",
  "linear-gradient(140deg, #f2c56b, #e87532 52%, #ef9eb9)",
  "linear-gradient(140deg, #7045b8, #aa8be5 55%, #a5dbc6)",
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
