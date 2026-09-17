"use client";

import { useEffect, useRef, useState } from "react";
import {
  FALLBACK_RESORT_IMAGES,
  normalizeImageUrl,
  pickFallbackResortImage,
} from "@/lib/resort-types";

type Props = {
  src?: string | null;
  alt: string;
  seed?: string;
  className?: string;
  /** Extra candidate URLs to try if the primary fails */
  fallbacks?: Array<string | null | undefined>;
};

function toLocalOnly(url: string): string {
  const u = normalizeImageUrl(url);
  // Never load remote hotlinks in the UI — only local /images/ paths
  if (u.startsWith("/images/")) return u;
  return "";
}

function buildCandidates(
  src: string | null | undefined,
  fallbacks: Array<string | null | undefined>,
  seed: string,
) {
  const raw = [toLocalOnly(src || ""), ...fallbacks.map((f) => toLocalOnly(f || ""))].filter(
    Boolean,
  );
  return [...new Set([...raw, pickFallbackResortImage(seed)])];
}

/**
 * Resort photo with local-only assets + onError fallbacks.
 */
export function ResortImage({ src, alt, seed = "", className = "", fallbacks = [] }: Props) {
  const unique = buildCandidates(src, fallbacks, seed || alt);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const current = unique[Math.min(index, unique.length - 1)] || FALLBACK_RESORT_IMAGES[0];

  useEffect(() => {
    setIndex(0);
  }, [src, seed, alt]);

  useEffect(() => {
    setLoaded(false);
    const img = imgRef.current;
    // Cached images often finish before React attaches onLoad — reveal them immediately
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [current]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ display: "block" }}>
      {!loaded ? <div className="absolute inset-0 z-10 animate-pulse bg-gray-200" /> : null}
      {/* Local assets only — plain img matches Netlify behavior */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={current}
        ref={imgRef}
        src={current}
        alt={alt}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (index < unique.length - 1) {
            setLoaded(false);
            setIndex((i) => i + 1);
          } else {
            setLoaded(true);
          }
        }}
      />
    </div>
  );
}
