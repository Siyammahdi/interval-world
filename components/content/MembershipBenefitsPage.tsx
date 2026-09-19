import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";

const SIDE_CARDS = [
  {
    title: "Special Offers",
    href: "/web/my/info/benefits/offers",
    image: "/images/figma/benefits/card-offers.jpg",
  },
  {
    title: "Online Resort Directory",
    href: "/resort-directory",
    image: "/images/figma/benefits/card-directory.jpg",
  },
] as const;

export function MembershipBenefitsPage() {
  return (
    <main id="main-content">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-12 pt-8 md:px-[120px] md:pb-[50px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-medium leading-[1.3] text-iw-navy md:text-[35px]">
            Membership Benefits!
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
            <span className="text-iw-ink">Membership Benefits</span>
          </nav>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <div className="relative h-[220px] w-full overflow-hidden rounded-2xl md:h-[295px]">
              <Image
                src="/images/figma/benefits/hero.jpg"
                alt="Membership benefits resort view"
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
              <h2 className="text-[24px] font-medium text-iw-ink md:text-[29px]">
                Membership Has Its Benefits!
              </h2>
              <p className="text-[14px] leading-[1.7] text-iw-ink">
                As a member of Interval International®, you can exchange to hundreds of quality
                resorts in some of the world&apos;s most sought-after vacation destinations. And
                exchange is just the beginning!
              </p>
              <p className="text-[14px] leading-[1.7] text-iw-ink">
                From Getaways to Guest Certificates to our VIP Concierge℠ service, members get to
                choose their value and discounts because Interval offers three levels:{" "}
                <Link
                  href="/web/my/info/benefits/membership"
                  className="text-iw-link underline"
                >
                  Interval International membership
                </Link>
                ,{" "}
                <Link href="/web/my/info/benefits/gold" className="text-iw-link underline">
                  Interval Gold®
                </Link>
                , and{" "}
                <Link href="/web/my/info/benefits/platinum" className="text-iw-link underline">
                  Interval Platinum®
                </Link>
                .
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
