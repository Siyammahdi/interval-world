import { AskExpert } from "@/components/home/AskExpert";
import { MarketingContentLayout } from "@/components/content/MarketingContentLayout";

const SIDE_CARDS = [
  {
    title: "Interval International App",
    href: "/web/cs/mobile-app",
    image: "/images/figma/offers/card-app.jpg",
  },
  {
    title: "Online Resort Directory",
    href: "/resort-directory",
    image: "/images/figma/offers/card-directory.jpg",
  },
  {
    title: "Interval World Magazine",
    href: "/web/my/info/planning/magazine",
    image: "/images/figma/offers/card-magazine.jpg",
  },
];

export function SpecialOffersPage() {
  return (
    <main id="main-content">
      <MarketingContentLayout
        title="Special Offers"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Special Offers" }]}
        heroImage="/images/figma/offers/hero.jpg"
        heroAlt="Children playing on the beach at sunset"
        showPlay={false}
        sideCards={SIDE_CARDS}
      >
        <h2 className="mb-8 text-[24px] font-medium text-iw-ink md:text-[29px]">
          Special Offers. Big Deals.
        </h2>
        <div className="space-y-8">
          <section>
            <h3 className="mb-1 text-[20px] font-medium text-[#027fc2]">Getaway Sales</h3>
            <p className="text-[14px] leading-[1.7] text-iw-ink">
              Take advantage of great deals on your next Getaway vacation. These fabulous Getaways
              are for a limited-time only — don&apos;t miss out!
            </p>
          </section>
          <section>
            <h3 className="mb-1 text-[20px] font-medium text-[#027fc2]">Extra Vacations</h3>
            <p className="text-[14px] leading-[1.7] text-iw-ink">
              Exchange or Getaway into one of our featured destinations and get a bonus vacation.
            </p>
          </section>
          <section>
            <h3 className="mb-1 text-[20px] font-medium text-[#027fc2]">Cruise Offers</h3>
            <p className="text-[14px] leading-[1.7] text-iw-ink">
              Receive onboard credits and discounts on select cruise sailings.
            </p>
          </section>
          <section>
            <h3 className="mb-1 text-[20px] font-medium text-[#027fc2]">Last Minute Deals</h3>
            <p className="text-[14px] leading-[1.7] text-iw-ink">
              Looking to travel in the next few days? Get your bags ready. Choose from a selection of
              great destinations for your last-minute escape.
            </p>
          </section>
        </div>
      </MarketingContentLayout>
      <AskExpert />
    </main>
  );
}
