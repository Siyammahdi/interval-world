import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";
import { MarketingContentLayout } from "@/components/content/MarketingContentLayout";

const SIDE_CARDS = [
  {
    title: "Join Today",
    href: "/web/my/info/membership",
    image: "/images/figma/ownership/card-join.jpg",
  },
  {
    title: "Learn About The Many Ways to Exchange",
    href: "/web/my/info/benefits/exchange",
    image: "/images/figma/ownership/card-exchange.jpg",
  },
  {
    title: "Interval International Membership",
    href: "/web/my/info/benefits/membership",
    image: "/images/figma/ownership/card-membership.jpg",
  },
];

export function WhyVacationOwnershipPage() {
  return (
    <main id="main-content">
      <MarketingContentLayout
        title="Why vacation ownership"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why vacation ownership" },
        ]}
        heroImage="/images/figma/ownership/hero-why.jpg"
        heroAlt="Coastal vacation scenery"
        sideCards={SIDE_CARDS}
      >
        <h2 className="mb-2 text-[24px] font-medium text-iw-ink md:text-[29px]">
          Great Vacations. Great Values.
        </h2>
        <div className="space-y-4 text-[14px] leading-[1.7]">
          <p>
            More than 7 million people enjoy{" "}
            <Link href="/web/my/info/ownership/overview" className="font-medium text-iw-link underline">
              vacation ownership
            </Link>{" "}
            annually. As one of the most highly regulated products on the market, vacation ownership
            fits the lifestyle of families worldwide because it offers a variety of convenient,
            high-quality opportunities.
          </p>
          <p>
            When you join{" "}
            <Link href="/web/my/info/ownership/about" className="font-medium text-iw-link underline">
              Interval International
            </Link>
            ®, you receive even more from your vacations. Not only will you enjoy a great resort to
            retreat to every year, you can also decide to vacation in a different place, or at a
            different time of year, with thousands of vacation exchange options. It&apos;s great for
            a change of pace, and offers so much flexibility.
          </p>
          <p>
            Vacation ownership makes it possible to enjoy life the way it&apos;s meant to be lived –
            seeing the world&apos;s wonders and spending quality time with your family and friends.
          </p>
        </div>
      </MarketingContentLayout>
      <AskExpert />
    </main>
  );
}
