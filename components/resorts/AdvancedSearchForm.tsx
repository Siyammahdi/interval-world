"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AskExpert } from "@/components/home/AskExpert";
import { advancedSearchAmenities } from "@/data/resort-directory";

type Props = {
  countries: string[];
};

export function AdvancedSearchForm({ countries }: Props) {
  const router = useRouter();
  const [region, setRegion] = useState("");
  const [allInclusive, setAllInclusive] = useState(false);
  const [searchBy, setSearchBy] = useState<"name" | "code">("name");
  const [query, setQuery] = useState("");
  const [matchMode, setMatchMode] = useState<"all" | "any">("all");
  const [amenities, setAmenities] = useState<string[]>([]);

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => a.localeCompare(b)),
    [countries],
  );

  function toggleAmenity(label: string) {
    setAmenities((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label],
    );
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (region) {
      const params = new URLSearchParams();
      if (allInclusive) params.set("inclusive", "1");
      const qs = params.toString();
      router.push(
        `/resort-page/${encodeURIComponent(region)}${qs ? `?${qs}` : ""}`,
      );
      return;
    }
    if (query.trim()) {
      const params = new URLSearchParams({ q: query.trim(), by: searchBy });
      router.push(`/resort-directory/search?${params.toString()}`);
      return;
    }
    router.push("/resort-directory");
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
            <h3 className="text-[24px] font-medium text-iw-ink md:text-[29px]">Select a Region</h3>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              <label className="sr-only" htmlFor="region">
                Region
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="h-[48px] w-full max-w-[904px] rounded-lg border border-iw-ink bg-white px-8 text-[17px] font-medium text-iw-ink"
              >
                <option value="">Please Select Region</option>
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
                Select amenities to refine your search. Matching is for browsing only in this demo.
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
                Onsite/Nearby
              </label>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {advancedSearchAmenities.map((amenity) => (
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

          <button
            type="submit"
            className="inline-flex w-full max-w-[284px] items-center justify-center rounded-lg bg-iw-blue px-[42px] py-3 text-[17px] font-medium text-white hover:bg-iw-blue-dark"
          >
            Search Resorts
          </button>
        </form>
      </div>
      <AskExpert />
    </main>
  );
}
