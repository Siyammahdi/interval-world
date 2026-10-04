import type { Metadata } from "next";
import { AdvancedSearchForm } from "@/components/resorts/AdvancedSearchForm";
import { fetchDirectoryMeta } from "@/lib/cms";
import {
  fetchResortCountries,
  fetchResorts,
  getResortRegionOptions,
  type ResortRegionOption,
} from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Advanced Search",
  description: "Search Interval International resorts by region, name, code, or amenities.",
};

export default async function AdvancedSearchPage() {
  const [countries, directory, resorts] = await Promise.all([
    fetchResortCountries(),
    fetchDirectoryMeta(),
    fetchResorts(),
  ]);
  const regionsByCountry: Record<string, ResortRegionOption[]> = {};
  for (const country of countries) {
    regionsByCountry[country] = getResortRegionOptions(resorts, country);
  }

  return (
    <AdvancedSearchForm
      countries={countries}
      regionsByCountry={regionsByCountry}
      amenities={directory.amenities}
    />
  );
}
