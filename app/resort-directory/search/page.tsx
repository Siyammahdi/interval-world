import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";
import { DirectoryDestinationCard } from "@/components/resorts/DirectoryDestinationCard";
import { DirectoryPagination } from "@/components/resorts/DirectoryPagination";
import { fetchResorts, filterResorts } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Resort Search Results",
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    by?: string;
    country?: string;
    region?: string;
    inclusive?: string;
    amenities?: string;
    match?: string;
    page?: string;
  }>;
};

export default async function ResortSearchPage({ searchParams }: PageProps) {
  const {
    q = "",
    by = "name",
    country = "",
    region = "",
    inclusive,
    amenities = "",
    match = "all",
    page: pageRaw,
  } = await searchParams;
  const searchBy = by === "code" ? "code" : "name";
  const selectedAmenities = amenities.split("|").filter(Boolean);
  const allResorts = await fetchResorts();
  const results = filterResorts(allResorts, {
    query: q,
    searchBy,
    country,
    region,
    inclusive: inclusive === "1",
    amenities: selectedAmenities,
    matchMode: match === "any" ? "any" : "all",
  });
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const page = Math.min(Math.max(1, Number(pageRaw) || 1), totalPages);
  const pageItems = results.slice((page - 1) * pageSize, page * pageSize);
  const activeFilters = {
    ...(q ? { q } : {}),
    ...(q ? { by: searchBy } : {}),
    ...(country ? { country } : {}),
    ...(region ? { region } : {}),
    ...(inclusive === "1" ? { inclusive: "1" } : {}),
    ...(amenities ? { amenities } : {}),
    ...(selectedAmenities.length ? { match } : {}),
  };

  return (
    <main id="main-content">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-12 pt-8 md:px-[120px] md:pb-[50px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-medium leading-[1.3] text-iw-navy md:text-[35px]">
            Search Results
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
          </nav>
        </div>

        <h2 className="text-[24px] font-medium text-iw-navy md:text-[35px]">
          Search Results <span className="text-iw-link">({results.length})</span>
        </h2>

        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((resort) => (
                <DirectoryDestinationCard key={resort._id} resort={resort} />
              ))}
            </div>
            <DirectoryPagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/resort-directory/search"
              searchParams={activeFilters}
            />
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-iw-border bg-iw-surface py-16 text-center">
            <p className="text-[17px] text-iw-muted">No resorts matched your search.</p>
            <Link
              href="/resort-directory/advanced-search"
              className="mt-4 inline-block font-medium text-iw-link hover:underline"
            >
              Try Advanced Search
            </Link>
          </div>
        )}
      </div>
      <AskExpert />
    </main>
  );
}
