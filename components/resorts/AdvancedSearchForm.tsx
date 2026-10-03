"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AskExpert } from "@/components/home/AskExpert";

type Props = {
  countries: string[];
  amenities?: string[];
};

export function AdvancedSearchForm({ countries, amenities: amenityOptions = [] }: Props) {
  const router = useRouter();
  const [region, setRegion] = useState("");
  const [allInclusive, setAllInclusive] = useState(false);
  const [searchBy, setSearchBy] = useState<"name" | "code">("name");
  const [query, setQuery] = useState("");
  const [matchMode, setMatchMode] = useState<"all" | "any">("all");
  const [amenities, setAmenities] = useState<string[]>([]);
  const amenityList = amenityOptions;

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => a.localeCompare(b)),
    [countries],
  );

  function toggleAmenity(label: string) {
    setAmenities((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label],
    );
  }

  function clearFilters() {
    setRegion("");
    setAllInclusive(false);
    setSearchBy("name");
    setQuery("");
    setMatchMode("all");
    setAmenities([]);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (region) params.set("country", region);
    if (query.trim()) {
      params.set("q", query.trim());
      params.set("by", searchBy);
    }
    if (allInclusive) params.set("inclusive", "1");
    if (amenities.length > 0) params.set("amenities", amenities.join("|"));
    if (amenities.length > 0) params.set("match", matchMode);
    router.push(`/resort-directory/search?${params.toString()}`);
  }

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
            <span className="text-iw-ink">Advanced Search</span>
          </nav>
        </div>

        <div className="relative h-[220px] w-full overflow-hidden rounded-2xl md:h-[378px]">
          <Image
            src="/images/figma/directory/area-hero.jpg"
            alt="Ocean cave kayaking"
            fill
            priority
            className="object-cover"
            sizes="1200px"
          />
        </div>

        <div>
          <h2 className="text-[32px] font-medium leading-[1.3] tracking-[-0.42px] text-[#027fc2] md:text-[42px]">
            Advanced Search
          </h2>
          <p className="mt-2 max-w-[753px] text-[14px] leading-[1.7] text-iw-muted">
            Interval International&apos;s Resort Directory contains information to help you plan
            your next vacation, including resort descriptions, photos and listings of amenities and
            activities on-site and nearby.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-12">
          <section className="flex flex-col gap-4">
            <h3 className="text-[24px] font-medium text-iw-ink md:text-[29px]">Select a Country</h3>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              <label className="sr-only" htmlFor="region">
                Country
              </label>
              <select
                id="country"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="h-[48px] w-full max-w-[904px] rounded-lg border border-iw-ink bg-white px-8 text-[17px] font-medium text-iw-ink"
              >
                <option value="">Please Select Country</option>
                {sortedCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-[14px] text-iw-ink">
                <input
                  type="checkbox"
                  checked={allInclusive}
                  onChange={(e) => setAllInclusive(e.target.checked)}
                  className="size-5 accent-iw-link"
                />
                Filter by All Inclusive Resorts
              </label>
            </div>
          </section>

          <hr className="border-iw-border" />

          <section className="flex flex-col gap-6">
            <div>
              <h3 className="text-[24px] font-medium text-iw-ink md:text-[29px]">
                Resort Name or Code
              </h3>
              <p className="mt-1 max-w-[753px] text-[14px] leading-[1.7] text-iw-muted">
                Know the name or code of the resort you would like to visit? Simply type it in to
                continue, or if you are unsure, leave the fields empty.
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              <label className="flex items-center gap-2 text-[14px]">
                <input
                  type="radio"
                  name="searchBy"
                  checked={searchBy === "name"}
                  onChange={() => setSearchBy("name")}
                  className="size-5 accent-iw-link"
                />
                Resort Name
              </label>
              <label className="flex items-center gap-2 text-[14px]">
                <input
                  type="radio"
                  name="searchBy"
                  checked={searchBy === "code"}
                  onChange={() => setSearchBy("code")}
                  className="size-5 accent-iw-link"
                />
                Resort Code
              </label>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchBy === "name" ? "Enter resort name" : "Enter resort code"}
              className="h-14 w-full max-w-[384px] rounded-lg border border-iw-muted bg-white px-4 text-[14px] outline-none focus:border-iw-link"
            />
          </section>

          <hr className="border-iw-border" />

          <section className="flex flex-col gap-6">
            <div>
              <h3 className="text-[24px] font-medium text-iw-ink md:text-[29px]">
                Search By Amenities
              </h3>
              <p className="mt-1 max-w-[753px] text-[14px] leading-[1.7] text-iw-muted">
                Select one or more amenities to refine your search.
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              <label className="flex items-center gap-2 text-[14px]">
                <input
                  type="radio"
                  name="matchMode"
                  checked={matchMode === "all"}
                  onChange={() => setMatchMode("all")}
                  className="size-5 accent-iw-link"
                />
                Match All
              </label>
              <label className="flex items-center gap-2 text-[14px]">
                <input
                  type="radio"
                  name="matchMode"
                  checked={matchMode === "any"}
                  onChange={() => setMatchMode("any")}
                  className="size-5 accent-iw-link"
                />
                Match Any
              </label>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {amenityList.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2 rounded-lg border border-iw-border bg-white px-3 py-2 text-[14px]"
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="size-4 accent-iw-link"
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex w-full max-w-[284px] items-center justify-center rounded-lg bg-iw-blue px-[42px] py-3 text-[17px] font-medium text-white hover:bg-iw-blue-dark"
            >
              Search Resorts
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-lg border border-iw-ink bg-white px-6 py-3 text-[17px] font-medium text-iw-ink hover:bg-iw-surface"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>
      <AskExpert />
    </main>
  );
}
