"use client";

import { useState } from "react";
import { ResortImage } from "@/components/resorts/ResortImage";
import { pickFallbackResortImage } from "@/lib/resort-types";

type Props = {
  images: string[];
  alt: string;
  seed?: string;
};

export function ResortGallery({ images, alt, seed = "" }: Props) {
  const list =
    images.length > 0 ? images : [pickFallbackResortImage(seed || alt)];
  const [index, setIndex] = useState(0);
  const current = list[index] ?? list[0];

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="group relative w-full max-w-[1200px]">
        <ResortImage
          src={current}
          fallbacks={list.filter((_, i) => i !== index)}
          alt={alt}
          seed={seed || alt}
          className="h-[240px] w-full rounded-2xl object-cover shadow-sm md:h-[378px]"
        />
        {list.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-opacity hover:bg-black/50 group-hover:opacity-100"
              onClick={() => setIndex((i) => (i - 1 + list.length) % list.length)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next photo"
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-opacity hover:bg-black/50 group-hover:opacity-100"
              onClick={() => setIndex((i) => (i + 1) % list.length)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        ) : null}
      </div>
      {list.length > 1 ? (
        <div className="flex justify-center gap-4 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              className={`h-[72px] w-[140px] flex-shrink-0 overflow-hidden rounded md:h-[100px] md:w-[200px] ${
                i === index ? "ring-2 ring-iw-link ring-offset-2" : "opacity-90 hover:opacity-100"
              }`}
              onClick={() => setIndex(i)}
            >
              <ResortImage
                src={src}
                alt={`${alt} photo ${i + 1}`}
                seed={`${seed || alt}-${i}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
