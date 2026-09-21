import type { Metadata } from "next";
import { AdvancedSearchForm } from "@/components/resorts/AdvancedSearchForm";
import { fetchDirectoryMeta } from "@/lib/cms";
import { fetchResortCountries } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Advanced Search",
  description: "Search Interval International resorts by region, name, code, or amenities.",
};

export default async function AdvancedSearchPage() {
  const [countries, directory] = await Promise.all([
    fetchResortCountries(),
    fetchDirectoryMeta(),
  ]);
  return <AdvancedSearchForm countries={countries} amenities={directory.amenities} />;
}
