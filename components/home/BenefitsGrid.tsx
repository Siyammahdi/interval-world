import { BenefitCard } from "@/components/home/BenefitCard";
import type { BenefitCard as BenefitCardData } from "@/data/homepage";

type BenefitsGridProps = {
  cards: BenefitCardData[];
};

/** 2×2 benefit layout used under the member alert on the homepage */
export function BenefitsGrid({ cards }: BenefitsGridProps) {
  return (
    <section className="mb-8 grid gap-x-6 gap-y-6 sm:grid-cols-2" aria-label="Member benefits overview">
      {cards.map((card) => (
        <BenefitCard key={card.id} card={card} />
      ))}
    </section>
  );
}
