import Image from "next/image";
import Link from "next/link";

export function AppPromo() {
  return (
    <section className="relative w-full overflow-hidden bg-iw-navy lg:h-[482px]">
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pt-14 md:px-[120px] lg:pt-[73px]">
        <div className="flex w-full max-w-[282px] flex-col gap-10 lg:gap-[104px]">
          <h2 className="whitespace-nowrap text-[42px] font-bold leading-[1.2] text-white md:text-[50px]">
            <span className="block">Take your</span>
            <span className="block">Benefits</span>
            <span className="block">With you.</span>
          </h2>
          <Link
            href="/web/cs/mobile-app"
            className="inline-flex w-full items-center justify-center rounded-lg border border-iw-navy bg-white px-[42px] py-3 text-[17px] font-medium text-iw-ink transition-colors hover:bg-iw-surface"
          >
            Discover out app
          </Link>
        </div>
      </div>

      <div className="relative mt-10 h-[360px] w-full sm:h-[440px] lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:h-[636px] lg:w-[786px]">
        <Image
          src="/images/figma/home/app-promo.jpg"
          alt="Interval app on a phone showing a family on vacation"
          fill
          className="object-cover object-right"
          sizes="(min-width: 1024px) 786px, 100vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-iw-navy to-transparent to-25% lg:bg-linear-to-l lg:from-transparent lg:from-88% lg:to-iw-navy lg:to-100%"
          aria-hidden
        />
      </div>
    </section>
  );
}
