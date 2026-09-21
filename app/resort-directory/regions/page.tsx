import type { Metadata } from "next";
import { ResortRegionsView } from "@/components/resorts/ResortRegionsView";
import { fetchResortCountries } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Resort Directory Regions",
  description: "Browse Interval International resorts by region and country.",
};

export default async function ResortRegionsPage() {
  const countries = await fetchResortCountries();
  return <ResortRegionsView countries={countries} />;
}
