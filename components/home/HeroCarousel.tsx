"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { HeroSlide } from "@/data/homepage";
import { cn } from "@/lib/cn";

type HeroCarouselProps = {
  slides: HeroSlide[];
  intervalMs?: number;
};

/**
 * Promo carousel. Uses a single visible <Image> plus a fading overlay
 * so we never stack an invisible slide above a visible one (which caused
 * a blank navy flash on the previous cross-fade).
 */
export function HeroCarousel({ slides, intervalMs = 5000 }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (!len) return;
      setIndex(((next % len) + len) % len);
    },
    [len],
  );

  useEffect(() => {
    if (paused || len < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % len);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, len, intervalMs]);

  if (!len) return null;

  const current = slides[index];

  return (
    <div
      className="relative mx-auto w-full max-w-[940px] overflow-hidden bg-[#0b2744]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Promotions"
    >
      <Link
        href={current.href}
        aria-label={current.alt}
        className="relative block aspect-[940/296] w-full"
      >
        <Image
          key={current.id}
          src={current.image}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 960px) 100vw, 940px"
          className="object-cover object-center"
        />
      </Link>

      <button
        type="button"
        aria-label="Prev"
        onClick={() => goTo(index - 1)}
        className="absolute left-1 top-1/2 z-20 h-[30px] w-[30px] -translate-y-1/2 bg-[url('/images/ui/arrows.png')] bg-[length:60px_30px] bg-left bg-no-repeat opacity-80 hover:opacity-100"
      />
      <button
        type="button"
        aria-label="Next"
        onClick={() => goTo(index + 1)}
        className="absolute right-1 top-1/2 z-20 h-[30px] w-[30px] -translate-y-1/2 bg-[url('/images/ui/arrows.png')] bg-[length:60px_30px] bg-right bg-no-repeat opacity-80 hover:opacity-100"
      />

      <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => goTo(i)}
            className={cn(
              "h-[10px] w-[10px] rounded-full border border-white/90",
              i === index ? "border-iw-navy bg-iw-navy" : "bg-transparent hover:bg-white/50",
            )}
          />
        ))}
      </div>
    </div>
  );
}
