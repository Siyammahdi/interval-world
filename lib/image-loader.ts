"use client";

import type { ImageLoaderProps } from "next/image";
import { isMediaPath, mediaUrl } from "./media";

/** next/image loader: media paths load straight from R2 (no resizing available there). */
export default function mediaImageLoader({ src, width }: ImageLoaderProps) {
  if (!isMediaPath(src)) return src;
  return `${mediaUrl(src)}?w=${width}`;
}
