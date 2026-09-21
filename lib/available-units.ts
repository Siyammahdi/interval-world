import {
  AVAILABLE_UNIT_TYPES,
  type AvailableUnitType,
} from "@/lib/resort-types";
import { fetchUnitRates, type UnitRate } from "@/lib/cms";

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
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function cashRatePerNight(unit: string, rates?: UnitRate[]): number {
  const hit = rates?.find((r) => r.unit_type === unit);
  if (hit) return hit.cash_per_night;
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

export function pointsRatePerNight(unit: string, rates?: UnitRate[]): number {
  const hit = rates?.find((r) => r.unit_type === unit);
  if (hit) return hit.points_per_night;
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

export function unitCashQuote(unit: AvailableUnitType, nights: number, rates?: UnitRate[]) {
  const pricePerNight = cashRatePerNight(unit, rates);
  return { pricePerNight, totalPrice: pricePerNight * nights };
}

export function unitPointsQuote(unit: AvailableUnitType, nights: number, rates?: UnitRate[]) {
  const pointsPerNight = pointsRatePerNight(unit, rates);
  return { pointsPerNight, totalPoints: pointsPerNight * nights };
}

export async function loadUnitRates() {
  try {
    return await fetchUnitRates();
  } catch {
    return [] as UnitRate[];
  }
}

export { AVAILABLE_UNIT_TYPES };
export type { AvailableUnitType };
