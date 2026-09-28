import resortsJson from "@/data/content/resorts.json";
import type { Resort } from "@/lib/resort-types";

export type { Resort } from "@/lib/resort-types";
export {
  getCountries,
  getResortById,
  getResortsByCountry,
  parseAmenityList,
  resortDescription,
  resortDisplayName,
  resortImages,
  EXCHANGE_RATES,
  GETAWAY_RATES,
} from "@/lib/resort-types";

/** Full catalog (~1.7k), sorted by name like the original API. */
const allResorts = resortsJson as Resort[];

function includes(value: string | undefined, q: string) {
  return (value || "").toLowerCase().includes(q);
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
    if (r.country) set.add(r.country);
  }
  return [...set].sort();
}

export async function searchResorts(q: string, by: "name" | "code" = "name", limit = 50) {
  const query = q.trim().toLowerCase();
  const max = Math.min(limit, 100);
  if (!query) return allResorts.slice(0, max);
  const matches = allResorts.filter((r) =>
    by === "code"
      ? includes(r.symbol, query) || includes(r.resort_ID, query)
      : includes(r.resortName, query) || includes(r.place_name, query) || includes(r.location, query),
  );
  return matches.slice(0, max);
}
