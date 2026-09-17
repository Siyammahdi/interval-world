import Link from "next/link";
import { ChevronRight } from "@/components/resorts/ChevronRight";

type Props = {
  countries: string[];
};

export function CountryGrid({ countries }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {countries.map((country) => (
        <Link
          key={country}
          href={`/resort-page/${encodeURIComponent(country)}`}
          className="group flex cursor-pointer items-center justify-between rounded-xl border bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md"
        >
          <span className="text-lg font-medium text-gray-700 group-hover:text-blue-600">
            {country}
          </span>
          <ChevronRight className="text-xl text-orange-500 transition-transform group-hover:translate-x-1" />
        </Link>
      ))}
    </div>
  );
}
