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
];

export function AboutVacationOwnershipPage() {
  return (
    <main id="main-content">
      <MarketingContentLayout
        title="About Vacation Ownership"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Vacation Ownership" },
        ]}
        heroImage="/images/figma/ownership/hero-about.jpg"
        heroAlt="Modern coastal resort at dusk"
        sideCards={SIDE_CARDS}
      >
        <h2 className="mb-8 text-[24px] font-medium text-iw-ink md:text-[29px]">
          Vacation Ownership: Year-Round Value With Exceptional Benefits!
        </h2>

        <div className="space-y-8">
          <section>
            <h3 className="mb-1 text-[20px] font-medium text-[#027fc2]">Value in Ownership</h3>
            <p className="text-[14px] leading-[1.7] text-iw-ink">
              Millions of families worldwide get more out of their vacation by paying only for the
              time they want. When they take their vacation time they can also enjoy spacious
              accommodations with fabulous resort amenities.
            </p>
          </section>

          <section>
            <h3 className="mb-1 text-[20px] font-medium text-[#027fc2]">
              It&apos;s Your Vacation Time, Use It!
            </h3>
            <p className="text-[14px] leading-[1.7] text-iw-ink">
              Vacation ownership comes with a wide variety of exchange options. With an Interval
              membership, the{" "}
              <Link href="/web/my/info/benefits/exchange" className="font-medium text-iw-link underline">
                many ways to exchange
              </Link>{" "}
              offer the flexibility to trade your week or points for a resort vacation or towards a
              cruise or a hotel stay. Whatever your budget, with vacation ownership you can afford
              spectacular, unforgettable vacations in style, every year.
            </p>
          </section>

          <section>
            <h3 className="mb-1 text-[20px] font-medium text-[#027fc2]">
              The World Is Your Playground
            </h3>
            <p className="mb-2 text-[14px] leading-[1.7] text-iw-ink">
              When you purchase time with an Interval International® – affiliated resort, you will
              have a world of vacations from which to choose. You&apos;ll have access to Interval&apos;s
              Exchange Network offering over 3,200 resorts located in the world&apos;s most desireable
              places. How&apos;s that for a wide selection?
            </p>
            <p className="text-[14px] leading-[1.7] text-iw-ink">
              To learn more, peruse the{" "}
              <Link href="/resort-directory" className="font-medium text-iw-link underline">
                Online Resort Directory
              </Link>
              . You&apos;ll explore a coveted collection of celebrated hospitality brands and
              independent properties.
            </p>
          </section>

          <section>
            <h3 className="mb-1 text-[20px] font-medium text-[#027fc2]">
              Thinking Of Selling Your Vacation Time
            </h3>
            <p className="text-[14px] leading-[1.7] text-iw-ink">
              Sometimes life circumstances change, and even long-time members need to sell their
              timeshare. If you&apos;re considering this option, please{" "}
              <Link
                href="/web/my/info/ownership/about-arda"
                className="font-medium text-iw-link underline"
              >
                click here
              </Link>
              .
            </p>
          </section>
        </div>
      </MarketingContentLayout>
      <AskExpert />
    </main>
  );
}
