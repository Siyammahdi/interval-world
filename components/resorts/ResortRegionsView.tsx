import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";

type Props = {
  countries: string[];
};

export function ResortRegionsView({ countries }: Props) {
  return (
    <main id="main-content">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-12 pt-8 md:px-[120px] md:pb-[50px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-medium leading-[1.3] text-iw-navy md:text-[35px]">
            Resort Directory
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
            <Link href="/resort-directory" className="text-iw-muted hover:text-iw-link">
              Resort Directory
            </Link>
            <Image
              src="/images/figma/ownership/chevron.svg"
              alt=""
              width={5}
              height={8}
              className="mx-0.5 h-2 w-auto"
              aria-hidden
            />
            <span className="text-iw-ink">Regions</span>
          </nav>
        </div>

        <div className="relative h-[220px] w-full overflow-hidden rounded-2xl md:h-[378px]">
          <Image
            src="/images/figma/directory/area-hero.jpg"
            alt="Coastal kayaking adventure"
            fill
            priority
            className="object-cover"
            sizes="1200px"
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-[32px] font-medium leading-[1.3] tracking-[-0.42px] text-[#027fc2] md:text-[42px]">
            Resort Directory
          </h2>
          <Link
            href="/resort-directory/advanced-search"
            className="inline-flex items-center gap-3 rounded-lg bg-iw-ink px-6 py-2.5 text-[14px] text-white hover:bg-black"
          >
            Advanced Search
            <Image
              src="/images/figma/directory/filter.svg"
              alt=""
              width={24}
              height={24}
              className="size-5"
              aria-hidden
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {countries.map((country) => (
            <Link
              key={country}
              href={`/resort-page/${encodeURIComponent(country)}`}
              className="flex items-center justify-center rounded-[7px] border border-iw-border bg-white px-6 py-2.5 text-center text-[14px] leading-[1.7] text-iw-ink transition-colors hover:border-iw-link hover:text-iw-link"
            >
              {country}
            </Link>
          ))}
        </div>
      </div>
      <AskExpert />
    </main>
  );
}
