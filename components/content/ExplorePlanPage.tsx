import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";

const CARDS = [
  {
    title: "Explore & Plan",
    href: "/resort-directory",
    image: "/images/figma/explore/card-plan.jpg",
    body: "Interval makes planning your next vacation a breeze. Whether you're still in fact-finding mode and researching potential destinations, or you've found your slice of heaven and are ready to book, intervalworld.com is your starting point!",
  },
  {
    title: "Interval HD",
    href: "/web/my/channel",
    image: "/images/figma/explore/card-hd.jpg",
    body: "Explore destinations and tour resorts before you confirm an exchange or buy a Getaway. View videos highlighting vacation experiences around the globe. Plus, watch member videos about Interval membership, testimonials, and more.",
  },
  {
    title: "The New Interval App!",
    href: "/web/cs/mobile-app",
    image: "/images/figma/explore/card-app.jpg",
    body: "The newly enhanced version of the Interval International® app now features the ability to exchange from the palm of your hand, using any of your available weeks or points.",
  },
  {
    title: "Member Publications",
    href: "/web/my/info/planning/magazine",
    image: "/images/figma/explore/card-pubs.jpg",
    body: "Explore exciting destinations, travel tips, membership updates, and new resort listings. You'll also find great vacation bargains and exclusive members-only offers.",
  },
  {
    title: "Community",
    href: "/web/my/info/planning/community",
    image: "/images/figma/explore/card-community.jpg",
    body: "Connect. Share. Learn. That's the motto of our members-only forum. Explore Community to get exchange tips, travel ideas, and resort details from other members.",
  },
  {
    title: "Interval Travel",
    href: "/web/my/info/planning/travel",
    image: "/images/figma/explore/card-travel.jpg",
    body: "Need air reservations for your next exchange vacation? Want the best deal on a car rental? Dreaming of the perfect cruise? We can get you great rates on airfares, car rentals, cruises, and more.",
  },
] as const;

export function ExplorePlanPage() {
  return (
    <main id="main-content">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-12 pt-8 md:px-[120px] md:pb-[50px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-medium leading-[1.3] text-iw-navy md:text-[35px]">
            Vacation Planning made easy
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[12px] font-medium tracking-[0.12px]"
          >
            <Link href="/" className="text-iw-muted hover:text-iw-link">
              Home
            </Link>
            <Image
              src="/images/figma/ownership/chevron.svg"
              alt=""
              width={5}
              height={8}
              className="mx-0.5 h-2 w-auto"
              aria-hidden
            />
            <span className="text-iw-ink">Vacation Planning made easy</span>
          </nav>
        </div>

        <div className="relative h-[220px] w-full overflow-hidden rounded-3xl md:h-[378px]">
          <Image
            src="/images/figma/explore/hero.jpg"
            alt="Traveler reviewing a map on the road"
            fill
            priority
            className="object-cover"
            sizes="1200px"
          />
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {CARDS.map((card) => (
            <article key={card.href + card.title} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="relative h-[220px] w-full overflow-hidden rounded-lg">
                  <Image src={card.image} alt="" fill className="object-cover" sizes="384px" />
                </div>
                <div>
                  <h2 className="mb-1 text-[24px] font-medium text-iw-ink">{card.title}</h2>
                  <p className="text-[14px] leading-[1.7] text-iw-ink">{card.body}</p>
                </div>
              </div>
              <Link
                href={card.href}
                className="text-[17px] font-bold text-iw-link underline hover:text-iw-blue"
              >
                View Details
              </Link>
            </article>
          ))}
        </div>
      </div>
      <AskExpert />
    </main>
  );
}
