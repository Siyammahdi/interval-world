import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";

const SIDE_CARDS = [
  {
    title: "Vacation Ownership",
    href: "/web/my/info/ownership/overview",
    image: "/images/figma/join/card-ownership.jpg",
  },
  {
    title: "Interval Gold Membership",
    href: "/web/my/info/benefits/gold",
    image: "/images/figma/join/card-gold.jpg",
  },
  {
    title: "Interval Platinum Membership",
    href: "/web/my/info/benefits/platinum",
    image: "/images/figma/join/card-platinum.jpg",
  },
] as const;

export function JoinTodayPage() {
  return (
    <main id="main-content">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-12 pt-8 md:px-[120px] md:pb-[50px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-medium leading-[1.3] text-iw-navy md:text-[35px]">
            Join Today
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
            <span className="text-iw-ink">Join Today</span>
          </nav>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <div className="relative h-[220px] w-full overflow-hidden rounded-2xl md:h-[295px]">
              <Image
                src="/images/figma/join/hero.jpg"
                alt="Join Interval International"
                fill
                priority
                className="object-cover"
                sizes="792px"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/figma/ownership/play.svg"
                  alt=""
                  width={80}
                  height={80}
                />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-[24px] font-medium text-iw-ink md:text-[29px]">Join Today</h2>
              <p className="text-[14px] leading-[1.7] text-iw-ink">
                Take advantage of Interval&apos;s vast exchange network of over 3,200 resorts in
                more than 90 countries and territories. With our super affordable, high-quality
                resorts and amazing benefits, members receive endless value and enhanced leisure to
                their lifestyles both at home and on vacation. Once you join, your family can start
                planning one of many fantastic vacations!
              </p>
              <p className="text-[14px] leading-[1.7] text-iw-ink">
                <Link
                  href="/web/my/account/createProfileOrJoin"
                  className="font-medium text-iw-link underline"
                >
                  Click here
                </Link>{" "}
                to become a member of Interval International® today!
              </p>
            </div>
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[384px]">
            {SIDE_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="flex flex-col gap-4 rounded-2xl border border-iw-border bg-white p-4 shadow-[9px_16px_15px_rgba(161,161,161,0.2)] transition-shadow hover:shadow-lg"
              >
                <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
                  <Image src={card.image} alt="" fill className="object-cover" sizes="352px" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-[17px] font-medium text-iw-ink">{card.title}</p>
                  <Image
                    src="/images/figma/ownership/external.svg"
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 shrink-0"
                  />
                </div>
              </Link>
            ))}
          </aside>
        </div>
      </div>
      <AskExpert />
    </main>
  );
}
