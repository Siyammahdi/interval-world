import {
  AVAILABLE_UNIT_TYPES,
  nightsBetween,
  unitCashQuote,
  unitPointsQuote,
  type AvailableUnitType,
} from "@/lib/available-units";

export const CHECKOUT_TAX_RATE = 0.2;

export type CheckoutVacationType = "Exchange" | "Getaways";
export type CheckInAs = "member" | "guest";

export type CheckoutBooking = {
  resortId: string;
  unit: AvailableUnitType;
  earliestDate: string;
  latestDate: string;
  adults: number;
  children: number;
  vacationType: CheckoutVacationType;
  checkInAs: CheckInAs;
};

export function isAvailableUnitType(value: string): value is AvailableUnitType {
  return (AVAILABLE_UNIT_TYPES as readonly string[]).includes(value);
}

export function formatCheckoutDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function checkoutPricing(unit: AvailableUnitType, nights: number, vacationType: CheckoutVacationType) {
  if (vacationType === "Exchange") {
    const points = unitPointsQuote(unit, nights);
    return {
      mode: "points" as const,
      nights,
      ...points,
      tax: 0,
      totalCash: 0,
    };
  }
  const cash = unitCashQuote(unit, nights);
  const tax = Math.round(cash.totalPrice * CHECKOUT_TAX_RATE * 100) / 100;
  const totalCash = Math.round((cash.totalPrice + tax) * 100) / 100;
  return {
    mode: "cash" as const,
    nights,
    ...cash,
    tax,
    totalCash,
  };
}

export function money(amount: number): string {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function buildCheckoutQuery(
  booking: Omit<CheckoutBooking, "checkInAs"> & { checkInAs?: CheckInAs },
): string {
  const params = new URLSearchParams({
    resortId: booking.resortId,
    unit: booking.unit,
    earliestDate: booking.earliestDate,
    latestDate: booking.latestDate,
    adults: String(booking.adults),
    children: String(booking.children),
    vacationType: booking.vacationType,
    checkInAs: booking.checkInAs || "member",
  });
  return params.toString();
}

export function parseCheckoutSearchParams(
  sp: Record<string, string | string[] | undefined>,
): CheckoutBooking | null {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] || "" : value || "";

  const resortId = first(sp.resortId);
  const unitRaw = first(sp.unit);
  const earliestDate = first(sp.earliestDate);
  const latestDate = first(sp.latestDate);
  if (!resortId || !earliestDate || !latestDate || !isAvailableUnitType(unitRaw)) return null;

  const vacationTypeRaw = first(sp.vacationType);
  const checkInRaw = first(sp.checkInAs);

  return {
    resortId,
    unit: unitRaw,
    earliestDate,
    latestDate,
    adults: Math.max(1, Number(first(sp.adults) || 1) || 1),
    children: Math.max(0, Number(first(sp.children) || 0) || 0),
    vacationType: vacationTypeRaw === "Exchange" ? "Exchange" : "Getaways",
    checkInAs: checkInRaw === "guest" ? "guest" : "member",
  };
}

export { nightsBetween };
