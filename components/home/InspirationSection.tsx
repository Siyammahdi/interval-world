import Image from "next/image";
import Link from "next/link";

export function InspirationSection() {
  return (
    <section className="w-full bg-white px-6 py-[60px] md:px-[120px] md:py-[80px]">
      <div className="mx-auto flex w-full max-w-[1192px] flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-[74px]">
        <div className="flex w-full max-w-[424px] shrink-0 flex-col gap-[27px] text-iw-ink">
          <div className="flex flex-col gap-4">
            <h2 className="text-[29px] font-medium leading-normal">The perfect vacation!</h2>
            <div className="space-y-4 text-[14px] leading-[1.7]">
              <p>Welcome to a world of vacation inspiration.</p>
              <p>
                Your member website will include engaging articles and member travel information,
                building on the legacy of Interval World® magazine first published in 1982.
              </p>
              <p>
                Explore exciting destinations, travel tips, membership updates, and new resort
                listings. You&apos;ll also find great vacation bargains and exclusive members-only
                offers.
              </p>
              <p>
                Dream big, find your fun, and let Interval World help you discover your next great
                vacation.
              </p>
            </div>
          </div>
          <Link
            href="https://interval-sub.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[50px] w-full max-w-[284px] items-center justify-center rounded-lg bg-[#216db2] px-[42px] py-3 text-[17px] font-medium text-white transition-colors hover:bg-iw-navy"
          >
            Get inspired Today
          </Link>
        </div>

        <div className="relative h-[220px] w-full max-w-[694px] overflow-hidden rounded-2xl bg-white lg:h-[259px]">
          <Image
            src="/images/figma/magazine/hero.jpg"
            alt="50 years of looking forward celebration banner"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 694px, 100vw"
          />
          <Image
            src="/images/figma/ownership/play.svg"
            alt=""
            width={80}
            height={80}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
