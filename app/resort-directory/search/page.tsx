import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";
import { DirectoryDestinationCard } from "@/components/resorts/DirectoryDestinationCard";
import { searchResorts } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Resort Search Results",
};

type PageProps = {
  searchParams: Promise<{ q?: string; by?: string }>;
};

export default async function ResortSearchPage({ searchParams }: PageProps) {
  const { q = "", by = "name" } = await searchParams;
  const query = q.trim();
  const searchBy = by === "code" ? "code" : "name";
  const results = query ? await searchResorts(query, searchBy, 36) : [];

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
          Result of &ldquo;{q}&rdquo; <span className="text-iw-link">({results.length})</span>
        </h2>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((resort) => (
              <DirectoryDestinationCard key={resort._id} resort={resort} />
            ))}
          </div>
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
