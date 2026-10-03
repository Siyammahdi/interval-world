import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ResortCountryResultsView } from "@/components/resorts/ResortCountryResultsView";
import { fetchDirectoryMeta } from "@/lib/cms";
import {
  fetchResorts,
  fetchResortCountries,
  getResortRegionOptions,
  getResortsByCountry,
  getResortsByCountryRegion,
} from "@/lib/resort-data";

type PageProps = {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ page?: string; region?: string }>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const { region: regionCode } = await searchParams;
  const name = decodeURIComponent(country);
  return {
    title: `${regionCode || name} Resorts`,
    description: `Browse Interval International resorts in ${regionCode || name}.`,
  };
}

export default async function ResortCountryPage({ params, searchParams }: PageProps) {
  const { country: raw } = await params;
  const { page: pageRaw, region: regionCode } = await searchParams;
  const country = decodeURIComponent(raw);
  const [resorts, countries, directory] = await Promise.all([
    fetchResorts(),
    fetchResortCountries(),
    fetchDirectoryMeta(),
  ]);
  if (!countries.includes(country)) notFound();

  const regionOptions = getResortRegionOptions(resorts, country);
  if (!regionCode && regionOptions.length > 0) {
    redirect(`/resort-directory/regions/${encodeURIComponent(country)}`);
  }

  const selectedRegion = regionCode
    ? regionOptions.find((region) => region.name.toLowerCase() === regionCode.toLowerCase())
    : undefined;
  if (regionCode && !selectedRegion) notFound();

  const list = selectedRegion
    ? getResortsByCountryRegion(resorts, country, selectedRegion.name)
    : getResortsByCountry(resorts, country);
  const page = Number(pageRaw) || 1;

  return (
    <ResortCountryResultsView
      country={country}
      regionName={selectedRegion?.name}
      resorts={list}
      countries={countries}
      page={page}
      pageSize={directory.pageSize}
    />
  );
}
