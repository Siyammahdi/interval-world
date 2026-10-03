import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CountryRegionsView } from "@/components/resorts/CountryRegionsView";
import {
  fetchResortCountries,
  fetchResorts,
  getResortRegionOptions,
} from "@/lib/resort-data";

type PageProps = {
  params: Promise<{ country: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country: raw } = await params;
  const country = decodeURIComponent(raw);
  return {
    title: `${country} Regions`,
    description: `Choose a region to browse resorts in ${country}.`,
  };
}

export default async function CountryRegionsPage({ params }: PageProps) {
  const { country: raw } = await params;
  const country = decodeURIComponent(raw);
  const [countries, resorts] = await Promise.all([
    fetchResortCountries(),
    fetchResorts(),
  ]);

  if (!countries.includes(country)) notFound();

  const regions = getResortRegionOptions(resorts, country);
  if (regions.length === 0) {
    redirect(`/resort-page/${encodeURIComponent(country)}`);
  }

  return (
    <CountryRegionsView
      country={country}
      regions={regions}
    />
  );
}
