import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResortCountryResultsView } from "@/components/resorts/ResortCountryResultsView";
import { fetchDirectoryMeta } from "@/lib/cms";
import {
  fetchResortCountries,
  fetchResorts,
  getResortsByCountry,
} from "@/lib/resort-data";

type PageProps = {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const name = decodeURIComponent(country);
  return {
    title: `${name} Resorts`,
    description: `Browse Interval International resorts in ${name}.`,
  };
}

export default async function ResortCountryPage({ params, searchParams }: PageProps) {
  const { country: raw } = await params;
  const { page: pageRaw } = await searchParams;
  const country = decodeURIComponent(raw);
  const [resorts, countries, directory] = await Promise.all([
    fetchResorts(),
    fetchResortCountries(),
    fetchDirectoryMeta(),
  ]);
  const list = getResortsByCountry(resorts, country);
  const page = Number(pageRaw) || 1;

  if (list.length === 0 && !countries.includes(country)) {
    notFound();
  }

  return (
    <ResortCountryResultsView
      country={country}
      resorts={list}
      countries={countries}
      page={page}
      pageSize={directory.pageSize}
    />
  );
}
