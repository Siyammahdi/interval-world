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

export function resortDisplayName(resort: Resort): string {
  return (resort.resortName || resort.place_name || "Resort").trim();
}

export function resortDescription(resort: Resort): string {
  return (resort.description || resort.resort_details || "").trim();
}

export function resortImages(resort: Resort): string[] {
  return [resort.img, resort.img2, resort.img3, resort.img4, resort.img5].filter(
    (src): src is string => Boolean(src && src.trim()),
  );
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
