"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AskExpert } from "@/components/home/AskExpert";
import type { ResortRegionOption } from "@/lib/resort-data";

type Props = {
  countries: string[];
  regionsByCountry?: Record<string, ResortRegionOption[]>;
  amenities?: string[];
};

export function AdvancedSearchForm({
  countries,
  regionsByCountry = {},
  amenities: amenityOptions = [],
}: Props) {
  const router = useRouter();
  const [country, setCountry] = useState("");
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
  const availableRegions = regionsByCountry[country] || [];

  function toggleAmenity(label: string) {
    setAmenities((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label],
    );
  }

  function clearFilters() {
    setCountry("");
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
    if (country) params.set("country", country);
    if (region) params.set("region", region);
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

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-iw-border bg-white p-5 shadow-sm md:p-7"
          aria-label="Advanced resort search"
        >
          <div className="mb-6">
            <h3 className="text-[24px] font-medium text-iw-ink md:text-[29px]">
              Find a resort
            </h3>
            <p className="mt-1 text-[14px] leading-[1.7] text-iw-muted">
              Start with a country, then narrow your search if you need to.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-iw-ink" htmlFor="country">
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setRegion("");
                }}
                className="h-12 w-full rounded-lg border border-iw-border bg-white px-4 text-[15px] text-iw-ink outline-none focus:border-iw-link focus:ring-2 focus:ring-iw-link/20"
              >
                <option value="">All countries</option>
                {sortedCountries.map((countryOption) => (
                  <option key={countryOption} value={countryOption}>
                    {countryOption}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-[14px] font-medium text-iw-ink" htmlFor="region">
                Region or area <span className="font-normal text-iw-muted">(optional)</span>
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={!country || availableRegions.length === 0}
                className="h-12 w-full rounded-lg border border-iw-border bg-white px-4 text-[15px] text-iw-ink outline-none focus:border-iw-link focus:ring-2 focus:ring-iw-link/20 disabled:cursor-not-allowed disabled:bg-iw-surface disabled:text-iw-muted"
              >
                <option value="">
                  {!country
                    ? "Select a country first"
                    : availableRegions.length > 0
                      ? "All regions in country"
                      : "No region data available"}
                </option>
                {availableRegions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name} ({option.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-iw-ink" htmlFor="resort-query">
                Search by name, destination, or code
              </label>
              <input
                id="resort-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchBy === "name" ? "e.g. Marriott or Orlando" : "e.g. 12345 or ABC"}
                className="h-12 w-full rounded-lg border border-iw-border bg-white px-4 text-[15px] outline-none placeholder:text-iw-muted focus:border-iw-link focus:ring-2 focus:ring-iw-link/20"
              />
            </div>
            <div className="flex h-12 items-center gap-4 rounded-lg border border-iw-border px-4">
              <span className="text-[13px] text-iw-muted">Match</span>
              <label className="flex items-center gap-1.5 text-[14px] text-iw-ink">
                <input
                  type="radio"
                  name="searchBy"
                  checked={searchBy === "name"}
                  onChange={() => setSearchBy("name")}
                  className="size-4 accent-iw-link"
                />
                Name
              </label>
              <label className="flex items-center gap-1.5 text-[14px] text-iw-ink">
                <input
                  type="radio"
                  name="searchBy"
                  checked={searchBy === "code"}
                  onChange={() => setSearchBy("code")}
                  className="size-4 accent-iw-link"
                />
                Code
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-[14px] text-iw-ink">
              <input
                type="checkbox"
                checked={allInclusive}
                onChange={(e) => setAllInclusive(e.target.checked)}
                className="size-5 accent-iw-link"
              />
              All-inclusive resorts only
            </label>
            <button
              type="button"
              onClick={clearFilters}
              className="text-[14px] font-medium text-iw-link hover:underline"
            >
              Clear all filters
            </button>
          </div>

          <details className="mt-6 border-t border-iw-border pt-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium text-iw-ink">
              <span>More filters</span>
              <span className="text-[13px] font-normal text-iw-muted">
                {amenities.length > 0 ? `${amenities.length} selected` : "Add amenities +"}
              </span>
            </summary>
            <div className="pt-5">
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <span className="text-[14px] text-iw-muted">Amenities should:</span>
                <label className="flex items-center gap-1.5 text-[14px] text-iw-ink">
                  <input
                    type="radio"
                    name="matchMode"
                    checked={matchMode === "all"}
                    onChange={() => setMatchMode("all")}
                    className="size-4 accent-iw-link"
                  />
                  Match all
                </label>
                <label className="flex items-center gap-1.5 text-[14px] text-iw-ink">
                  <input
                    type="radio"
                    name="matchMode"
                    checked={matchMode === "any"}
                    onChange={() => setMatchMode("any")}
                    className="size-4 accent-iw-link"
                  />
                  Match any
                </label>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {amenityList.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 rounded-lg border border-iw-border px-3 py-2 text-[14px] text-iw-ink hover:border-iw-link"
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
            </div>
          </details>

          <div className="mt-6 flex flex-col gap-3 border-t border-iw-border pt-6 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-iw-blue px-8 text-[16px] font-medium text-white hover:bg-iw-blue-dark sm:w-auto"
            >
              Search resorts
            </button>
            <span className="text-center text-[13px] text-iw-muted sm:text-left">
              Leave all fields blank to view every resort.
            </span>
          </div>
        </form>
      </div>
      <AskExpert />
    </main>
  );
}
