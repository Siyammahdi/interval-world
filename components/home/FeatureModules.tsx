import Image from "next/image";
import Link from "next/link";
import type { BenefitCard } from "@/data/homepage";

type Props = {
  cards: BenefitCard[];
};

export function FeatureModules({ cards }: Props) {
  return (
    <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={card.href}
          className="flex flex-col gap-5 rounded-2xl bg-white p-4 shadow-[5px_7px_9.5px_rgba(128,128,128,0.1),22px_26px_17px_rgba(128,128,128,0.09)] transition-shadow hover:shadow-lg"
        >
          <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
            <Image
              src={card.image}
              alt={card.imageAlt}
              fill
              className="object-cover"
              sizes="288px"
            />
          </div>
          <p className="text-[20px] font-medium leading-normal text-iw-ink">{card.title}</p>
        </Link>
      ))}
    </div>
  );
}
