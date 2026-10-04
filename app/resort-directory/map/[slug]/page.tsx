import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DirectoryMapGroupView } from "@/components/resorts/DirectoryMapGroupView";
import { getDirectoryMapGroup, getMapGroupCountries } from "@/data/directory-map";
import { fetchResortCountries } from "@/lib/resort-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = getDirectoryMapGroup(slug);
  return {
    title: group ? `${group.label} Resort Directory` : "Resort Directory",
    description: group
      ? `Browse resort countries in ${group.label}.`
      : "Browse resort directory map areas.",
  };
}

export default async function DirectoryMapGroupPage({ params }: PageProps) {
  const { slug } = await params;
  const group = getDirectoryMapGroup(slug);
  if (!group) notFound();
  if (slug === "australia" || slug === "new-zealand") {
    redirect(`/resort-directory/regions/${encodeURIComponent(group.label)}`);
  }

  const availableCountries = await fetchResortCountries();
  const countries =
    slug === "australia"
      ? availableCountries.filter((country) => country.toLowerCase() === "australia")
      : slug === "new-zealand"
        ? availableCountries.filter((country) => country.toLowerCase() === "new zealand")
        : getMapGroupCountries(slug, availableCountries);
  return <DirectoryMapGroupView groupLabel={group.label} countries={countries} />;
}
