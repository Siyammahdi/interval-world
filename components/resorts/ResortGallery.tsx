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
    <div className="my-6">
      <div className="group relative">
        <ResortImage
          src={current}
          fallbacks={list.filter((_, i) => i !== index)}
          alt={alt}
          seed={seed || alt}
          className="h-[300px] w-full rounded-lg shadow-md md:h-[450px]"
        />
        {list.length > 1 && (
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
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to photo ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    i === index ? "scale-110 bg-white" : "bg-white/50 hover:bg-white/80"
                  }`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {list.length > 1 && (
        <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-2">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all md:h-20 md:w-20 ${
                i === index ? "border-blue-500" : "border-gray-300 hover:border-blue-300"
              }`}
              onClick={() => setIndex(i)}
            >
              <ResortImage
                src={src}
                alt={`${alt} photo ${i + 1}`}
                seed={`${seed || alt}-${i}`}
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
