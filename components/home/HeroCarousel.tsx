"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/data/homepage";

type Props = {
  slides: HeroSlide[];
};

export function HeroCarousel({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const current = slides[index] ?? slides[0];

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!current) return null;

  return (
    <section className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-2xl">
      <Link href={current.href} className="relative block min-h-[420px] w-full md:min-h-[520px]">
        <Image
          src={current.image}
          alt={current.alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 flex h-full min-h-[420px] max-w-[593px] flex-col justify-between px-8 py-16 md:min-h-[520px] md:px-16 md:py-24">
          <div className="text-white">
            <h1 className="text-[36px] font-medium leading-[1.2] md:text-[50px]">
              <span className="block">Total price.</span>
              <span className="block">Total transparency.</span>
            </h1>
            <p className="mt-3 text-[16px] font-normal md:text-[20px]">
              Vacation planning is easier than even with up-front pricing.
            </p>
          </div>
          <span className="inline-flex w-fit items-center justify-center rounded-lg bg-iw-blue px-[42px] py-3 text-[17px] font-medium text-white">
            Learn More
          </span>
        </div>
      </Link>

      {slides.length > 1 ? (
        <div className="absolute bottom-6 right-6 z-20 flex gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-3 w-3 rounded-full transition-colors ${
                i === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
