import { apiFetch } from "@/lib/api";
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

type PaginatedResorts = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Resort[];
};

/** Fetch all resorts from Django (paginates through the API). */
export async function fetchResorts(options?: { hasImage?: boolean }): Promise<Resort[]> {
  const all: Resort[] = [];
  let page = 1;
  const pageSize = 100;
  // Safety cap — dataset is ~1.7k
  for (let i = 0; i < 50; i++) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (options?.hasImage) params.set("hasImage", "true");
    const data = await apiFetch<PaginatedResorts>(`/api/resorts/?${params}`);
    all.push(...data.results);
    if (!data.next) break;
    page += 1;
  }
  return all;
}

export async function fetchResortById(id: string): Promise<Resort | null> {
  try {
    return await apiFetch<Resort>(`/api/resorts/${encodeURIComponent(id)}/`);
  } catch {
    return null;
  }
}

export async function fetchResortCountries(): Promise<string[]> {
  const data = await apiFetch<{ countries: string[] }>("/api/resorts/countries/");
  return data.countries;
}

export async function searchResorts(q: string, by: "name" | "code" = "name", limit = 50) {
  const params = new URLSearchParams({ q, by, limit: String(limit) });
  const data = await apiFetch<{ results: Resort[] }>(`/api/resorts/search/?${params}`);
  return data.results;
}
