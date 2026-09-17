import resortData from "@/data/resort-data.json";
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

/** Same dataset as https://interval-server.vercel.app/resort-data (Netlify app source). */
export function fetchResorts(): Resort[] {
  return resortData as Resort[];
}
