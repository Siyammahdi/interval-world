"use client";

import { useRouter } from "next/navigation";

type Props = {
  country: string;
  countries: string[];
};

export function CountryJumpSelect({ country, countries }: Props) {
  const router = useRouter();

  return (
    <select
      id="country-jump"
      aria-label="Search by Region"
      defaultValue={country}
      className="rounded-lg bg-iw-link px-6 py-2.5 text-[17px] font-medium text-white"
      onChange={(e) => {
        if (e.target.value) {
          router.push(`/resort-page/${encodeURIComponent(e.target.value)}`);
        }
      }}
    >
      {countries.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
