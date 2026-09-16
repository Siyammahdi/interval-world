"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { BenefitCard } from "@/data/homepage";
import { cn } from "@/lib/cn";

type FeatureModulesProps = {
  cards: BenefitCard[];
};

const FULL_W = 220;
const SMALL_W = 158;
const GAP = 10;
const HEIGHT = 125;
const EXPANDED_W = 330;
const EXPANDED_H = 240;

/**
 * Live-site shrink/grow homepage modules (#homeModules).
 * Default: four equal image tiles. Hover expands one with description.
 */
export function FeatureModules({ cards }: FeatureModulesProps) {
  const [active, setActive] = useState<number | null>(null);
  const count = cards.length;

  const clear = useCallback(() => setActive(null), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") clear();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clear]);

  function leftFor(i: number, current: number | null) {
    if (current === null) return i * (FULL_W + GAP);
    let x = 0;
    for (let j = 0; j < count; j++) {
      if (j === i) return x;
      x += (j === current ? EXPANDED_W : SMALL_W) + GAP;
    }
    return x;
  }

  const stripHeight = active === null ? HEIGHT : EXPANDED_H;

  return (
    <section
      className="relative mx-auto mb-6 mt-5 w-full max-w-[880px]"
      style={{ height: stripHeight }}
      aria-label="Featured topics"
      onMouseLeave={clear}
    >
      {cards.map((card, i) => {
        const isOpen = active === i;
        const width = active === null ? FULL_W : isOpen ? EXPANDED_W : SMALL_W;
        const height = isOpen ? EXPANDED_H : HEIGHT;
        const left = leftFor(i, active);

        return (
          <article
            key={card.id}
            className={cn(
              "absolute bottom-0 overflow-hidden bg-iw-navy transition-all duration-500 ease-in-out",
              isOpen && "z-20 shadow-lg",
            )}
            style={{ left, width, height }}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            {!isOpen ? (
              <button
                type="button"
                className="relative block h-full w-full cursor-pointer"
                aria-label={card.imageAlt}
                aria-expanded={false}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  width={221}
                  height={125}
                  className="h-full w-full object-cover object-left-top"
                />
              </button>
            ) : (
              <div className="h-full bg-white p-3">
                <div className="flex gap-3">
                  <Link href={card.href} className="relative h-[100px] w-[140px] shrink-0 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      width={140}
                      height={100}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-[16px] font-normal text-iw-blue">
                      <Link href={card.href} className="hover:underline">
                        {card.title}
                      </Link>
                    </h3>
                    <p className="text-[11px] leading-[1.45] text-iw-navy line-clamp-5">
                      {card.description}
                    </p>
                    <Link
                      href={card.href}
                      className="mt-2 inline-block text-[11px] text-iw-blue hover:underline"
                    >
                      Learn more »
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
