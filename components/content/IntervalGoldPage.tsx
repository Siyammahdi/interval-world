import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";
import { MarketingContentLayout } from "@/components/content/MarketingContentLayout";

const SIDE_CARDS = [
  {
    title: "Guest Certificates for Friends",
    href: "/web/my/info/membership",
    image: "/images/figma/gold/card-guest.jpg",
  },
  {
    title: "Watch videos on Interval HD",
    href: "/web/my/channel",
    image: "/images/figma/gold/card-hd.jpg",
  },
];

export function IntervalGoldPage() {
  return (
    <main id="main-content">
      <MarketingContentLayout
        title="Interval Gold"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Interval Gold" }]}
        heroImage="/images/figma/gold/hero.jpg"
        heroAlt="Family building a snowman in winter"
        sideCards={SIDE_CARDS}
      >
        <h2 className="mb-8 text-[24px] font-medium text-iw-ink md:text-[29px]">Interval Gold</h2>
        <div className="space-y-4 text-[14px] leading-[1.7] text-iw-ink">
          <p>
            As a vacation owner, you and your family can enjoy great, affordable vacations year after
            year.
          </p>
          <p>
            Interval Gold membership upgrades your choices to help you make the most of your vacation
            time and gives you much more exchange power.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              With ShortStay Exchange®, you can trade your week for two vacations of 1 to 6 nights
              each. If you&apos;re a points-based member, you can take as many ShortStay Exchanges as
              your available points allow.
            </li>
            <li>
              Try something completely different on your next vacation with Interval Options® and
              trade your week or points toward the purchase of a cruise, tour, golf, or spa vacation!
            </li>
            <li>
              You&apos;ll have the same great{" "}
              <Link href="/web/my/info/benefits/getaways" className="text-iw-link underline">
                access to Getaways
              </Link>{" "}
              — affordable resort vacations for seven nights or less — but Interval Gold members get
              great discounts on each one you take (minimum night stay required).
            </li>
            <li>
              Hotel Exchange: Trade your week or points for a hotel stay.
            </li>
            <li>
              Interval Experiences lets you exchange your week or points towards exciting and unique
              adventures.
            </li>
            <li>
              Enjoy VIP treatment, including special amenities, when you reserve in advance with
              Dining Connection.
            </li>
            <li>
              Golf Connection: Explore golf options in your destination of choice with your
              concierge.
            </li>
            <li>
              Discover hot restaurants, shopping opportunities, nightlife options, sightseeing musts,
              and more with City Guides.
            </li>
            <li>
              Check in to even more savings on hotels - powered by Priceline Partner Solutions™.
            </li>
            <li>
              Hertz Gold+: Enroll and earn 25% more points toward free rental days.*
            </li>
            <li>
              Access more than 90,000 Premium Discounts for use at restaurants and shops, whether
              you&apos;re at home or traveling.
            </li>
            <li>
              Get personal assistance, 24/7, with VIP Concierge℠.
            </li>
            <li>Get cash back on select cruises booked through Interval Travel®.</li>
            <li>And more!</li>
          </ul>
          <p className="text-[12px] text-iw-muted">
            *Free rental day excludes taxes and fees. Terms apply.
          </p>
        </div>
      </MarketingContentLayout>
      <AskExpert />
    </main>
  );
}
