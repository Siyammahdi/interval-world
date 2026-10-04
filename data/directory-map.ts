import { DIRECTORY_REGIONS } from "@/data/resort-regions";

type MapGroup = {
  slug: string;
  label: string;
  regionCodes: string[];
};

export const DIRECTORY_MAP_GROUPS: MapGroup[] = [
  { slug: "asia", label: "Asia", regionCodes: ["24"] },
  { slug: "australia", label: "Australia", regionCodes: ["26"] },
  { slug: "canada", label: "Canada", regionCodes: ["1", "2"] },
  { slug: "caribbean", label: "Caribbean", regionCodes: ["14"] },
  { slug: "central-america", label: "Central America", regionCodes: ["16"] },
  { slug: "europe", label: "Europe", regionCodes: ["19", "29", "18", "20", "30", "28", "31"] },
  { slug: "mexico", label: "Mexico", regionCodes: ["15"] },
  { slug: "middle-east", label: "Middle East", regionCodes: ["21"] },
  { slug: "africa", label: "Africa", regionCodes: ["22", "23"] },
  { slug: "south-america", label: "South America", regionCodes: ["17"] },
  { slug: "south-pacific", label: "South Pacific", regionCodes: ["25"] },
];

export function getDirectoryMapGroup(slug: string) {
  return DIRECTORY_MAP_GROUPS.find((group) => group.slug === slug);
}

export function getMapGroupCountries(slug: string, availableCountries: string[]) {
  const group = getDirectoryMapGroup(slug);
  if (!group) return [];

  const available = new Set(availableCountries.map((country) => country.toLowerCase()));
  const countries = new Set<string>();

  for (const region of DIRECTORY_REGIONS) {
    if (!group.regionCodes.includes(region.code)) continue;
    for (const country of region.countries) {
      if (available.has(country.toLowerCase())) countries.add(country);
    }
  }

  const groupedCaribbean = availableCountries.find(
    (country) => country.toLowerCase() === "caribbean & atlantic islands",
  );
  if (slug === "caribbean" && groupedCaribbean) {
    countries.add(groupedCaribbean);
  }

  return [...countries].sort();
}
