import type { Metadata } from "next";
import { AdvancedSearchForm } from "@/components/resorts/AdvancedSearchForm";
import { fetchResorts, getCountries } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Advanced Search",
  description: "Search Interval International resorts by region, name, code, or amenities.",
};

export default function AdvancedSearchPage() {
  const countries = getCountries(fetchResorts());
  return <AdvancedSearchForm countries={countries} />;
}
