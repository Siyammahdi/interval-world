import resortsJson from "@/data/resort-data.json";
import type { Resort } from "@/lib/resort-types";

export type { Resort } from "@/lib/resort-types";
export {
  getCountries,
  getResortById,
  parseAmenityList,
  resortDescription,
  resortDisplayName,
  resortImages,
  EXCHANGE_RATES,
  GETAWAY_RATES,
} from "@/lib/resort-types";

/** Full catalog (~1.7k), sorted by name like the original API. */
const allResorts = resortsJson as Resort[];

export type ResortRegionOption = {
  name: string;
  count: number;
};

export type ResortSearchFilters = {
  query?: string;
  searchBy?: "name" | "code";
  country?: string;
  inclusive?: boolean;
  amenities?: string[];
  matchMode?: "all" | "any";
};

function normalized(value: string) {
  return value.trim().toLowerCase();
}

export function getResortsByCountry(resorts: Resort[], country: string) {
  const targetCountry = normalized(country);
  return resorts.filter((resort) => normalized(resort.country || "") === targetCountry);
}

export async function fetchResorts(options?: { hasImage?: boolean }): Promise<Resort[]> {
  if (!options?.hasImage) return allResorts;
  return allResorts.filter((r) => r.img || r.img2 || r.img3);
}

export async function fetchResortById(id: string): Promise<Resort | null> {
  return allResorts.find((r) => r._id === id) ?? null;
}

export async function fetchResortCountries(): Promise<string[]> {
  const set = new Set<string>();
  for (const r of allResorts) {
    const country = r.country?.trim();
    if (country) set.add(country);
  }
  return [...set].sort();
}

export function getResortRegionOptions(
  resorts: Resort[],
  country: string,
): ResortRegionOption[] {
  const options = new Map<string, ResortRegionOption>();
  const targetCountry = normalized(country);

  for (const resort of resorts) {
    if (normalized(resort.country || "") !== targetCountry) continue;
    const name = (resort.region || "").trim();
    if (!name) continue;

    const key = normalized(name);
    const existing = options.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      options.set(key, { name, count: 1 });
    }
  }

  return [...options.values()];
}

export function getResortsByCountryRegion(
  resorts: Resort[],
  country: string,
  region: string,
) {
  const targetCountry = normalized(country);
  const targetRegion = normalized(region);
  return resorts.filter(
    (resort) =>
      normalized(resort.country || "") === targetCountry &&
      normalized(resort.region || "") === targetRegion,
  );
}

function searchableResortText(resort: Resort) {
  return [
    resort.resortName,
    resort.place_name,
    resort.location,
    resort.description,
    resort.resort_details,
    resort.onSite,
    resort.nearby,
    resort.room_details,
  ]
    .filter(Boolean)
    .map((value) => (typeof value === "string" ? value : JSON.stringify(value)))
    .join(" ")
    .toLowerCase();
}

export function filterResorts(resorts: Resort[], filters: ResortSearchFilters) {
  const query = normalized(filters.query || "");
  const country = normalized(filters.country || "");
  const amenities = (filters.amenities || []).map(normalized).filter(Boolean);
  const matchMode = filters.matchMode === "any" ? "any" : "all";

  return resorts.filter((resort) => {
    if (country && normalized(resort.country || "") !== country) return false;

    if (query) {
      const searchable =
        filters.searchBy === "code"
          ? `${resort.symbol || ""} ${resort.resort_ID || ""}`.toLowerCase()
          : `${resort.resortName || ""} ${resort.place_name || ""} ${resort.location || ""}`.toLowerCase();
      if (!searchable.includes(query)) return false;
    }

    const text = searchableResortText(resort);
    if (filters.inclusive && !text.includes("all inclusive")) return false;

    if (amenities.length > 0) {
      const matches = amenities.map((amenity) => text.includes(amenity));
      if (matchMode === "all" && matches.some((match) => !match)) return false;
      if (matchMode === "any" && !matches.some(Boolean)) return false;
    }

    return true;
  });
}

export async function searchResorts(q: string, by: "name" | "code" = "name", limit = 50) {
  const max = Math.min(limit, 100);
  return filterResorts(allResorts, { query: q, searchBy: by }).slice(0, max);
}
