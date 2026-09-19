import type { Metadata } from "next";
import { ResortRegionsView } from "@/components/resorts/ResortRegionsView";
import { fetchResorts, getCountries } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Resort Directory Regions",
  description: "Browse Interval International resorts by region and country.",
};

export default function ResortRegionsPage() {
  const countries = getCountries(fetchResorts());
  return <ResortRegionsView countries={countries} />;
}
