import Image from "next/image";
import Link from "next/link";

export function AppPromo() {
  return (
    <section className="relative w-full overflow-hidden bg-iw-navy">
      <div className="relative mx-auto flex min-h-[420px] w-full max-w-[1440px] flex-col justify-center px-6 py-16 md:min-h-[482px] md:px-[120px]">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] md:block" aria-hidden>
          <Image
            src="/images/figma/home/app-promo.jpg"
            alt=""
            fill
            className="object-cover object-left"
            sizes="786px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-iw-navy via-iw-navy/80 to-transparent" />
        </div>

        <div className="relative z-10 flex max-w-[282px] flex-col gap-16">
          <h2 className="text-[42px] font-bold leading-[1.2] text-white md:text-[50px]">
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
    </section>
  );
}
