export type Resort = {
  _id: string;
  img?: string;
  img2?: string;
  img3?: string;
  img4?: string;
  img5?: string;
  resortName?: string;
  place_name?: string;
  location?: string;
  symbol?: string;
  resort_ID?: string;
  country?: string;
  continent?: string;
  region?: string;
  description?: string;
  resort_details?: string;
  contactInfo?: string;
  nearestAirport?: string;
  checkInDays?: string[];
  check_in_time?: string;
  check_out_time?: string;
  rating?: string | number;
  stateRating?: string | number;
  available_amount?: string | number;
  reviews_amount?: string | number;
  room_details?: string;
  price_usd?: string;
  nearby?: string;
  onSite?: string;
  ownerExclusive?: boolean;
  createdAt?: string;
};

/** Rate cards shown on the Netlify single-resort page (UI constants there). */
export const EXCHANGE_RATES = [
  { t: "Studio", p: "2,000" },
  { t: "1/1 Bed", p: "3000-4000" },
  { t: "2/2 Bed", p: "4000-5000" },
  { t: "3/3 Bed", p: "5000-7000" },
  { t: "4/4 Bed", p: "8000-12000" },
] as const;

export const GETAWAY_RATES = [
  { t: "Studio", p: "$50" },
  { t: "1 Bedroom", p: "$60" },
  { t: "2/2 Bed", p: "$72" },
  { t: "3/3 Bed", p: "$80" },
  { t: "4/4 Bed", p: "$100" },
] as const;

/** Unit types + nightly rates from Netlify `/available-unit` page. */
export const AVAILABLE_UNIT_TYPES = [
  "Studio",
  "1/1 Bed",
  "2/2 Bed",
  "3/3 Bed",
  "4/4 Bed",
] as const;

export type AvailableUnitType = (typeof AVAILABLE_UNIT_TYPES)[number];

export function cashRatePerNight(unit: string): number {
  switch (unit) {
    case "Studio":
      return 50;
    case "1/1 Bed":
      return 60;
    case "2/2 Bed":
      return 72;
    case "3/3 Bed":
      return 80;
    case "4/4 Bed":
      return 100;
    default:
      return 50;
  }
}

export function pointsRatePerNight(unit: string): number {
  switch (unit) {
    case "Studio":
      return 2000;
    case "1/1 Bed":
      return 3500;
    case "2/2 Bed":
      return 4500;
    case "3/3 Bed":
      return 6000;
    case "4/4 Bed":
      return 10000;
    default:
      return 2000;
  }
}

/**
 * Local copies of the same Unsplash hotel pool the Netlify app uses when a
 * resort photo is missing. Kept under public/images/resorts/_fallbacks/.
 */
export const FALLBACK_RESORT_IMAGES = [
  "/images/resorts/_fallbacks/0.jpg",
  "/images/resorts/_fallbacks/1.jpg",
  "/images/resorts/_fallbacks/2.jpg",
  "/images/resorts/_fallbacks/3.jpg",
  "/images/resorts/_fallbacks/4.jpg",
  "/images/resorts/_fallbacks/5.jpg",
  "/images/resorts/_fallbacks/6.jpg",
  "/images/resorts/_fallbacks/7.jpg",
  "/images/resorts/_fallbacks/8.jpg",
  "/images/resorts/_fallbacks/9.jpg",
  "/images/resorts/_fallbacks/10.jpg",
  "/images/resorts/_fallbacks/11.jpg",
  "/images/resorts/_fallbacks/12.jpg",
  "/images/resorts/_fallbacks/13.jpg",
  "/images/resorts/_fallbacks/14.jpg",
] as const;

export function normalizeImageUrl(raw?: string | null): string {
  if (raw == null) return "";
  let u = String(raw).trim();
  if (!u) return "";

  // Local app assets — keep as-is
  if (u.startsWith("/images/")) return u;

  // Concatenated duplicates: https://a.jpghttps://a.jpg
  const parts = u.split(/(?=https?:\/\/)/i).filter(Boolean);
  if (parts.length > 1) {
    u =
      parts.find((p) => /^https?:\/\//i.test(p) && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(p)) ||
      parts[0];
  }

  if (u.startsWith("//")) u = `https:${u}`;

  if (!/^https?:\/\//i.test(u) && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(u)) {
    if (
      u.startsWith("www.") ||
      u.startsWith("intervalworld.com") ||
      u.startsWith("rci.com")
    ) {
      u = `https://${u}`;
    } else if (u.startsWith("/") && !u.startsWith("/images/")) {
      u = `https://www.intervalworld.com${u}`;
    }
  }

  if (!/^https?:\/\//i.test(u)) return "";

  try {
    const parsed = new URL(u);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return parsed.href;
  } catch {
    return "";
  }
}

export function pickFallbackResortImage(seed = ""): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return FALLBACK_RESORT_IMAGES[hash % FALLBACK_RESORT_IMAGES.length];
}

export function resortDisplayName(resort: Resort): string {
  return (resort.resortName || resort.place_name || "Resort").trim();
}

export function resortDescription(resort: Resort): string {
  return (resort.description || resort.resort_details || "").trim();
}

export function resortImages(resort: Resort): string[] {
  return [resort.img, resort.img2, resort.img3, resort.img4, resort.img5]
    .map((src) => normalizeImageUrl(src))
    .filter((src) => src.startsWith("/images/"));
}

/** Netlify stores amenities as "· Item· Item2" — split into clean labels. */
export function parseAmenityList(raw?: string): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function getCountries(resorts: Resort[]): string[] {
  const set = new Set<string>();
  for (const resort of resorts) {
    const country = (resort.country || "").trim();
    if (country) set.add(country);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function getResortsByCountry(resorts: Resort[], country: string): Resort[] {
  const decoded = decodeURIComponent(country);
  return resorts.filter((r) => (r.country || "").trim() === decoded);
}

export function getResortById(resorts: Resort[], id: string): Resort | undefined {
  return resorts.find((r) => r._id === id);
}
