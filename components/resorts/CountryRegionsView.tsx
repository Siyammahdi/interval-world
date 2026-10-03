import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";
import type { ResortRegionOption } from "@/lib/resort-data";

type Props = {
  country: string;
  regions: ResortRegionOption[];
};

export function CountryRegionsView({ country, regions }: Props) {
  return (
    <main id="main-content">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-8 px-4 pb-12 pt-8 md:px-30 md:pb-12.5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-medium leading-[1.3] text-iw-navy md:text-[35px]">
            Resort Directory
          </h1>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] font-medium">
            <Link href="/" className="text-iw-muted hover:text-iw-link">Home</Link>
            <Image src="/images/figma/ownership/chevron.svg" alt="" width={5} height={8} className="mx-0.5 h-2 w-auto" aria-hidden />
            <Link href="/resort-directory/regions" className="text-iw-muted hover:text-iw-link">Countries</Link>
            <Image src="/images/figma/ownership/chevron.svg" alt="" width={5} height={8} className="mx-0.5 h-2 w-auto" aria-hidden />
            <span className="text-iw-ink">{country}</span>
          </nav>
        </div>

        <div className="relative h-55 w-full overflow-hidden rounded-2xl md:h-94.5">
          <Image
            src="/images/figma/directory/area-hero.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="1200px"
          />
        </div>

        <div>
          <h2 className="text-[32px] font-medium leading-[1.3] tracking-[-0.42px] text-[#027fc2] md:text-[42px]">
            Regions in {country}
          </h2>
          <p className="mt-2 max-w-188.25 text-[14px] leading-[1.7] text-iw-muted">
            Select a region to browse resorts in that area.
          </p>
        </div>

        {regions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {regions.map((region) => (
              <Link
                key={region.name}
                href={`/resort-page/${encodeURIComponent(country)}?region=${encodeURIComponent(region.name)}`}
                className="flex min-h-16 items-center justify-center rounded-[7px] border border-iw-border bg-white px-6 py-3 text-center text-[14px] leading-normal text-iw-ink transition-colors hover:border-iw-link hover:text-iw-link"
              >
                <span>
                  <span className="block">{region.name}</span>
                  <span className="mt-1 block text-[12px] font-normal text-iw-muted">
                    {region.count} {region.count === 1 ? "resort" : "resorts"}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-iw-border bg-iw-surface py-16 text-center">
            <p className="text-[17px] font-medium text-iw-muted">
              Regional information is not available for this country yet.
            </p>
          </div>
        )}
      </div>
      <AskExpert />
    </main>
  );
}
