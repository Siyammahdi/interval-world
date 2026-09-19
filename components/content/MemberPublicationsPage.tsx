import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";
import { MarketingContentLayout } from "@/components/content/MarketingContentLayout";

const SIDE_CARDS = [
  {
    title: "Membership Benefits",
    href: "/web/my/info/benefits",
    image: "/images/figma/magazine/card-benefits.jpg",
  },
  {
    title: "Interval Travel",
    href: "/web/my/info/planning/travel",
    image: "/images/figma/magazine/card-travel.jpg",
  },
];

export function MemberPublicationsPage() {
  return (
    <main id="main-content">
      <MarketingContentLayout
        title="Member Publications"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Member Publications" }]}
        heroImage="/images/figma/magazine/hero.jpg"
        heroAlt="50 years of looking forward celebration banner"
        showPlay={false}
        sideCards={SIDE_CARDS}
      >
        <h2 className="mb-8 text-[24px] font-medium text-iw-ink md:text-[29px]">
          The perfect vacation!
        </h2>
        <div className="space-y-4 text-[14px] leading-[1.7] text-iw-ink">
          <p>Welcome to a world of vacation inspiration.</p>
          <p>
            Your member website will include engaging articles and member travel information,
            building on the legacy of Interval World® magazine first published in 1982.
          </p>
          <p>
            Explore exciting destinations, travel tips, membership updates, and new resort listings.
            You&apos;ll also find great vacation bargains and exclusive members-only offers.
          </p>
          <p>
            Dream big, find your fun, and let Interval World help you discover your next great
            vacation.
          </p>
        </div>
        <Link
          href="https://pub.intervalworld.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-iw-blue px-[42px] py-3 text-[17px] font-medium text-white transition-colors hover:bg-iw-navy"
        >
          Get inspired Today
        </Link>
      </MarketingContentLayout>
      <AskExpert />
    </main>
  );
}
