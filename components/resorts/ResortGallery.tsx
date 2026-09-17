"use client";

import { useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

export function ResortGallery({ images, alt }: Props) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-gray-100 text-gray-400 md:h-[450px]">
        No photos available
      </div>
    );
  }

  const current = images[index] ?? images[0];

  return (
    <div className="my-6">
      <div className="group relative">
        <div className="relative h-[300px] w-full overflow-hidden rounded-lg shadow-md transition-all duration-500 md:h-[450px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current} alt={alt} className="h-full w-full object-cover" />
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-opacity hover:bg-black/50 group-hover:opacity-100"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next photo"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-opacity hover:bg-black/50 group-hover:opacity-100"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, i) => (
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
      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all md:h-20 md:w-20 ${
                i === index ? "border-blue-500" : "border-gray-300 hover:border-blue-300"
              }`}
              onClick={() => setIndex(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${alt} photo ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
