import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";
import { DirectoryDestinationCard } from "@/components/resorts/DirectoryDestinationCard";
import { DirectoryPagination } from "@/components/resorts/DirectoryPagination";
import { MapSearchSection } from "@/components/resorts/MapSearchSection";
import type { DirectoryMeta } from "@/lib/cms";
import type { Resort } from "@/lib/resort-types";

type Props = {
  resorts: Resort[];
  page: number;
  directory: DirectoryMeta;
};

export function ResortDirectoryView({ resorts, page, directory }: Props) {
  const pageSize = directory.pageSize || 12;
  const mapSearchRegions = directory.mapSearchRegions || [];
  const totalPages = Math.max(1, Math.ceil(resorts.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = resorts.slice(start, start + pageSize);

  return (
    <main id="main-content">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-12 pt-8 md:gap-8 md:px-[120px] md:pb-[50px]">
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
            <span className="text-iw-ink">Resort Directory</span>
          </nav>
        </div>

        <div className="relative h-[220px] w-full overflow-hidden rounded-2xl md:h-[378px]">
          <Image
            src="/images/figma/directory/hero.jpg"
            alt="Tropical resort pool and palm trees"
            fill
            priority
            className="object-cover"
            sizes="1200px"
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-black/40 to-transparent" />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-[28px] font-medium leading-[1.3] text-iw-navy md:text-[35px]">
            Popular Destination
          </h2>
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <span className="text-[17px] font-medium text-iw-ink">Search by Region</span>
            <Link
              href="/resort-directory/regions"
              className="inline-flex items-center gap-3 rounded-lg bg-iw-link px-6 py-2.5 text-[17px] font-medium text-white hover:bg-iw-blue"
            >
              View Regions
              <span aria-hidden>&gt;</span>
            </Link>
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
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((resort) => (
            <DirectoryDestinationCard key={resort._id} resort={resort} />
          ))}
        </div>

        <DirectoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/resort-directory"
        />

        <MapSearchSection regions={mapSearchRegions} className="pt-4" />
      </div>
      <AskExpert />
    </main>
  );
}
