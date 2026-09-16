import Image from "next/image";
import Link from "next/link";
import type { BenefitCard as BenefitCardData } from "@/data/homepage";

type BenefitCardProps = {
  card: BenefitCardData;
};

/**
 * Single homepage benefit block.
 * Hover grow on the thumbnail matches the live site's shrink_grow effect.
 */
export function BenefitCard({ card }: BenefitCardProps) {
  return (
    <article className="benefit flex flex-col gap-3 sm:flex-row sm:items-start">
      <Link
        href={card.href}
        className="group relative block h-[133px] w-[211px] max-w-full shrink-0 overflow-hidden"
        aria-label={card.imageAlt}
      >
        <Image
          src={card.image}
          alt={card.imageAlt}
          width={211}
          height={133}
          className="h-[133px] w-[211px] max-w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
        />
      </Link>

      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="mb-1 text-[16px] font-normal leading-snug text-iw-blue">
          <Link href={card.href} className="hover:underline">
            {card.title}
          </Link>
        </h3>
        <p className="text-[12px] leading-[1.5] text-iw-navy">{card.description}</p>
      </div>
    </article>
  );
}
