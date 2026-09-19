import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";
import { MarketingContentLayout } from "@/components/content/MarketingContentLayout";

const SIDE_CARDS = [
  {
    title: "Join Today",
    href: "/web/my/info/membership",
    image: "/images/figma/platinum/card-join.jpg",
  },
  {
    title: "Online Resort Directory",
    href: "/resort-directory",
    image: "/images/figma/platinum/card-directory.jpg",
  },
];

export function IntervalPlatinumPage() {
  return (
    <main id="main-content">
      <MarketingContentLayout
        title="Interval Platinum"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Interval Platinum" }]}
        heroImage="/images/figma/platinum/hero.jpg"
        heroAlt="Luxury resort pool overlooking the ocean"
        sideCards={SIDE_CARDS}
      >
        <h2 className="mb-8 text-[24px] font-medium text-iw-ink md:text-[29px]">
          Interval Platinum
        </h2>
        <div className="space-y-4 text-[14px] leading-[1.7] text-iw-ink">
          <p>
            As a vacation owner, you and your family can enjoy great, affordable vacations year after
            year. And with Interval Platinum®, you get all the great benefits of the Interval Gold®
            membership (including ShortStay Exchange®, VIP Concierge℠, and Interval Options®), plus
            these great Interval Platinum benefits:*
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <span className="font-medium">Hotel Exchange:</span> Trade your week or points for a
              hotel stay.
            </li>
            <li>
              <Link href="/web/cs" className="text-iw-link underline">
                Interval Experiences
              </Link>{" "}
              lets you exchange your week or points towards exciting and unique adventures.
            </li>
            <li>
              Enjoy VIP treatment, including special amenities, when you reserve in advance with{" "}
              <Link href="/web/cs" className="text-iw-link underline">
                Dining Connection
              </Link>
              .
            </li>
            <li>
              <span className="font-medium">Golf Connection:</span> Explore golf options in your
              destination of choice with your concierge.
            </li>
            <li>
              Discover hot restaurants, shopping opportunities, nightlife options, sightseeing musts,
              and more with{" "}
              <Link href="/web/cs" className="text-iw-link underline">
                City Guides
              </Link>
              .
            </li>
            <li>
              Check in to our best rates on hotels - powered by Priceline Partner Solutions™.
            </li>
            <li>
              With a{" "}
              <Link href="/web/my/travel/packages" className="text-iw-link underline">
                Package
              </Link>
              , you&apos;ll find a convenient combination of flights, stays, and transportation in
              minutes, with up to 30% savings.
            </li>
            <li>
              Share your love of travel! Get up to 3 free Guest Certificates per membership year.
            </li>
            <li>
              Travel more often, without exchanging your week or points, with{" "}
              <Link href="/web/my/info/benefits/getaways" className="text-iw-link underline">
                Getaways
              </Link>{" "}
              — and enjoy even greater discounts as an Interval Platinum member.
            </li>
            <li>
              Through a complimentary Priority Pass airport lounge membership, you&apos;ll have
              access to more than 1,800 airport experiences in more than 600 cities in over 140
              countries.**
            </li>
            <li>
              Get ready for the ultimate in last-minute travel with Platinum Escapes — deeply
              discounted vacation weeks available from time to time by special email invitation only.
            </li>
            <li>
              Priority Getaway viewing gives you access to select Getaway availability before other
              members.
            </li>
          </ul>
          <p className="text-[12px] text-iw-muted">
            *Benefits vary by member&apos;s country of residence.
            <br />
            **Per-person fee required with each lounge visit.
          </p>
        </div>
      </MarketingContentLayout>
      <AskExpert />
    </main>
  );
}
