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
    title: "Membership Benefits",
    href: "/web/my/info/benefits",
    image: "/images/figma/ownership/card-benefits.jpg",
  },
  {
    title: "Learn About The Many Ways to Exchange",
    href: "/web/my/info/benefits/exchange",
    image: "/images/figma/ownership/card-exchange.jpg",
  },
];

export function WhyIntervalPage() {
  return (
    <main id="main-content">
      <MarketingContentLayout
        title="Why Interval International?"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why Interval International?" },
        ]}
        heroImage="/images/figma/ownership/hero-about.jpg"
        heroAlt="Interval vacation lifestyle"
        sideCards={SIDE_CARDS}
      >
        <h2 className="mb-6 text-[24px] font-medium text-iw-ink md:text-[29px]">
          The perfect vacation!
        </h2>
        <div className="space-y-4 text-[14px] leading-[1.7] text-iw-ink">
          <p>
            For some it means lying on a tropical beach. For others, it&apos;s family time at a
            thrilling theme park destination. For a couple looking for a romantic escape, a peaceful
            respite in the mountains might be in store. No matter where you go, it&apos;s all about
            quality vacation time with family, friends, and loved ones. And there&apos;s no better way
            to experience the perfect vacation year after year than through vacation ownership and
            membership with Interval International®.
          </p>
          <p>
            Since 1976, Interval International has been making it easy for members to spend vacation
            time at a vast network of quality resorts. And with over 3,200 resorts in 90 countries and
            territories from which to choose, members truly have the world at their disposal.
          </p>
          <p>
            Interval membership offers so much more than vacation exchange. You&apos;ll also have
            access to a suite of benefits such as{" "}
            <Link href="/web/my/info/benefits/getaways" className="font-medium text-iw-link underline">
              Getaways
            </Link>{" "}
            — weeklong stays in the world&apos;s most desireable destinations at an exclusive price. And{" "}
            <Link href="/web/my/info/benefits/gold" className="font-medium text-iw-link underline">
              Interval Gold®
            </Link>{" "}
            and{" "}
            <Link href="/web/my/info/benefits/platinum" className="font-medium text-iw-link underline">
              Interval Platinum®
            </Link>{" "}
            — Interval&apos;s popular upgraded membership programs — offer even more amazing benefits.
          </p>
          <p>
            At IntervalWorld.com, you can book travel as well as peruse vacation ideas, travel
            inspiration, book a cruise, search for Getaways, and more. Year after year, Interval is
            recognized as the industry leader in quality vacation exchange. With the flexibility to
            choose how you vacation, and a wide variety of valuable benefits you can use at home or
            away, Interval membership is the best thing that&apos;s ever happened to vacation ownership.
          </p>
        </div>
      </MarketingContentLayout>
      <AskExpert />
    </main>
  );
}
