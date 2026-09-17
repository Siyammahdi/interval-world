import {
  AVAILABLE_UNIT_TYPES,
  cashRatePerNight,
  pointsRatePerNight,
  type AvailableUnitType,
} from "@/lib/resort-types";

export type SearchParamsInput = {
  earliestDate: string;
  latestDate: string;
  adults: number;
  children: number;
  vacationType: "Exchange" | "Getaways";
};

export function nightsBetween(earliestDate: string, latestDate: string): number {
  const start = new Date(earliestDate);
  const end = new Date(latestDate);
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function formatReservationDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  // Matches Netlify: "18 Sept 2026"
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function unitCashQuote(unit: AvailableUnitType, nights: number) {
  const pricePerNight = cashRatePerNight(unit);
  return { pricePerNight, totalPrice: pricePerNight * nights };
}

export function unitPointsQuote(unit: AvailableUnitType, nights: number) {
  const pointsPerNight = pointsRatePerNight(unit);
  return { pointsPerNight, totalPoints: pointsPerNight * nights };
}

export { AVAILABLE_UNIT_TYPES };
export type { AvailableUnitType };
