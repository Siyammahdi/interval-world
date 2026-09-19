import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";
import { MarketingContentLayout } from "@/components/content/MarketingContentLayout";

const SIDE_CARDS = [
  {
    title: "Getaway Discount",
    href: "/web/my/info/benefits/getaways",
    image: "/images/figma/membership-level/card-getaway.jpg",
  },
  {
    title: "E-Plus",
    href: "/web/my/info/benefits/exchange",
    image: "/images/figma/membership-level/card-eplus.jpg",
  },
  {
    title: "Trip Protection",
    href: "/web/cs",
    image: "/images/figma/membership-level/card-trip.jpg",
  },
  {
    title: "VIP Concierge Services",
    href: "/web/my/info/benefits/gold",
    image: "/images/figma/membership-level/card-vip.jpg",
  },
];

export function IntervalMembershipPage() {
  return (
    <main id="main-content">
      <MarketingContentLayout
        title="Interval Membership"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Interval Membership" }]}
        heroImage="/images/figma/membership-level/hero.jpg"
        heroAlt="Beach towel and flip-flops on the sand"
        sideCards={SIDE_CARDS}
      >
        <h2 className="mb-8 text-[24px] font-medium text-iw-ink md:text-[29px]">
          Interval International Membership
        </h2>
        <div className="space-y-4 text-[14px] leading-[1.7] text-iw-ink">
          <p>
            As a vacation owner, you and your family can enjoy great, affordable vacations year after
            year. And with an Interval membership, you&apos;ll have access to a variety of benefits
            that will help you make the most out of your vacation time.*
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Gain access to{" "}
              <Link href="/resort-directory" className="text-iw-link underline">
                thousands of resorts in more than 90 countries and territories
              </Link>{" "}
              when you exchange your vacation time for spacious, quality accommodations at some of
              the world&apos;s most desirable resort destinations!
            </li>
            <li>
              Nearly 1.6-million vacation owner families trade through Interval&apos;s worldwide
              exchange network, giving you more exchange opportunities to enjoy.
            </li>
            <li>
              Travel more often, without relinquishing your time, with{" "}
              <Link href="/web/my/info/benefits/getaways" className="text-iw-link underline">
                Getaways
              </Link>
              .
            </li>
            <li>
              <Link href="/web/my/info/planning/magazine" className="text-iw-link underline">
                Interval&apos;s online member publication
              </Link>{" "}
              features exciting vacation ideas, travel inspiration, and tips for maximizing your
              membership.
            </li>
            <li>
              Give the gift of travel by assigning the use of your resort time or Getaway to friends
              and family by purchasing affordable Guest Certificates.
            </li>
          </ul>
          <h3 className="pt-2 text-[20px] font-medium text-iw-ink">Travel with Ease</h3>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Interact with other members on{" "}
              <Link href="/web/my/info/planning/community" className="text-iw-link underline">
                Community
              </Link>{" "}
              to give and receive travel advice and tips.
            </li>
            <li>
              Book flights, cruises, sightseeing tours, or even rent a car, through{" "}
              <Link href="/web/my/info/planning/travel" className="text-iw-link underline">
                Interval Travel®
              </Link>
              .
            </li>
            <li>Check in to great rates on hotels - powered by Priceline Partner Solutions™.</li>
            <li>
              With a{" "}
              <Link href="/web/my/travel/packages" className="text-iw-link underline">
                Package
              </Link>
              , you&apos;ll find a convenient combination of flights, stays, and transportation in
              minutes, with up to 30% savings.
            </li>
            <li>
              Visit intervalworld.com to do it all in one easy-to-use members-only website. Search
              the Resort Directory, discover great travel deals, find valuable discounts, purchase
              theme park tickets in advance, and more!
            </li>
          </ul>
        </div>
      </MarketingContentLayout>
      <AskExpert />
    </main>
  );
}
