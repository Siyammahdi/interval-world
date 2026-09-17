import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResortCard } from "@/components/resorts/ResortCard";
import { fetchResorts, getCountries, getResortsByCountry } from "@/lib/resort-data";

type PageProps = {
  params: Promise<{ country: string }>;
};

export function generateStaticParams() {
  return getCountries(fetchResorts()).map((country) => ({ country }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const name = decodeURIComponent(country);
  return {
    title: `${name} Resorts`,
    description: `Browse Interval International resorts in ${name}.`,
  };
}

export default async function ResortCountryPage({ params }: PageProps) {
  const { country: raw } = await params;
  const country = decodeURIComponent(raw);
  const resorts = fetchResorts();
  const list = getResortsByCountry(resorts, country);

  if (list.length === 0 && !getCountries(resorts).includes(country)) {
    notFound();
  }

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl p-4 md:p-8">
      <h1 className="my-8 text-center text-2xl font-bold text-iw-navy md:text-3xl">
        {country} Resorts
      </h1>

      {list.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((resort) => (
            <ResortCard key={resort._id} resort={resort} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-20 text-gray-500">
          <p className="text-lg font-medium">No resorts found in this location.</p>
          <Link
            href="/resort-directory"
            className="mt-4 font-bold text-blue-600 hover:underline"
          >
            Return to Directory
          </Link>
        </div>
      )}
    </main>
  );
}
