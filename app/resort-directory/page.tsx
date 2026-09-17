import type { Metadata } from "next";
import { CountryGrid } from "@/components/resorts/CountryGrid";
import { fetchResorts, getCountries } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Resort Directory",
  description:
    "Browse Interval International resorts by country — descriptions, photos, and destination details.",
};

export default function ResortDirectoryPage() {
  const resorts = fetchResorts();
  const countries = getCountries(resorts);

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl p-4 md:p-8">
      <h1 className="mb-8 border-b pb-4 text-2xl font-bold text-iw-blue md:text-3xl">
        Resort Directory
      </h1>
      <CountryGrid countries={countries} />
    </main>
  );
}
