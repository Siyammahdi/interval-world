import type { Resort } from "@/lib/resort-types";

export type DirectoryRegion = {
  code: string;
  name: string;
  countries: string[];
  keywords?: string[];
};

/**
 * Region names and codes follow the public Interval Resort Directory taxonomy.
 * The country lists are used for the country -> region step; keywords handle
 * subnational regions where a country has more than one directory region.
 */
export const DIRECTORY_REGIONS: DirectoryRegion[] = [
  { code: "24", name: "Asia", countries: ["Cambodia", "China", "Hong Kong", "India", "Indonesia", "Japan", "Maldives", "Malaysia", "Philippines", "Singapore", "South Korea", "Sri Lanka", "Taiwan", "Thailand", "Vietnam"] },
  { code: "26", name: "Australia & New Zealand", countries: ["Australia", "New Zealand"] },
  { code: "1", name: "Canada - Eastern", countries: ["Canada"], keywords: ["ontario", "quebec", "new brunswick", "nova scotia", "newfoundland", "prince edward", "manitoba", "on", "qc", "nb", "ns", "nl", "pe", "mb"] },
  { code: "2", name: "Canada - Western", countries: ["Canada"], keywords: ["alberta", "british columbia", "saskatchewan", "yukon", "northwest territories", "nunavut", "ab", "bc", "sk", "yt", "nt", "nu"] },
  { code: "14", name: "Caribbean & Atlantic Islands", countries: ["Antigua", "Antigua and Barbuda", "Aruba", "Bahamas", "Barbados", "Bermuda", "Bonaire", "British Virgin Islands", "Cayman Islands", "Cuba", "Curaçao", "Cura��ao", "Dominican Republic", "Grenada", "Guadeloupe", "Jamaica", "Puerto Rico", "Saint Lucia", "St. Kitts", "St. Lucia", "St. Maarten", "St. Martin", "Saint Martin", "Sint Maarten", "St. Vincent and the Grenadines", "Trinidad and Tobago", "Turks and Caicos", "Turks and Caicos Islands", "US Virgin Islands", "Virgin Islands"] },
  { code: "16", name: "Central America", countries: ["Belize", "Costa Rica", "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Panama"] },
  { code: "19", name: "Europe - Central & The Low Countries", countries: ["Austria", "Belgium", "Czech Republic", "Germany", "Luxembourg", "Netherlands", "Poland", "Switzerland"] },
  { code: "29", name: "Europe - East Mediterranean & Adriatic", countries: ["Albania", "Bosnia", "Bulgaria", "Croatia", "Cyprus", "Greece", "Montenegro", "Romania", "Serbia", "Slovenia", "Turkey"] },
  { code: "18", name: "Europe - France, Italy & Malta", countries: ["France", "Italy", "Malta"] },
  { code: "20", name: "Europe - Portugal, Spain & Andorra", countries: ["Andorra", "Portugal", "Spain"] },
  { code: "30", name: "Europe - UK & Ireland", countries: ["England", "Ireland", "Scotland", "United Kingdom", "Wales"] },
  { code: "28", name: "Europe - Canary Islands & Cape Verde Islands", countries: ["Cape Verde", "Canary Islands"] },
  { code: "31", name: "Europe - Scandinavia", countries: ["Denmark", "Finland", "Iceland", "Norway", "Sweden"] },
  { code: "15", name: "Mexico", countries: ["Mexico"] },
  { code: "21", name: "Middle East", countries: ["Bahrain", "Israel", "Jordan", "Kuwait", "Lebanon", "Oman", "Qatar", "Saudi Arabia", "United Arab Emirates"] },
  { code: "22", name: "Northern Africa", countries: ["Algeria", "Egypt", "Libya", "Morocco", "Tunisia"] },
  { code: "17", name: "South America", countries: ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Paraguay", "Peru", "Uruguay", "Venezuela"] },
  { code: "25", name: "South Pacific Islands", countries: ["Cook Islands", "Fiji", "French Polynesia", "Guam", "New Caledonia", "Samoa", "Tahiti", "Tonga", "Vanuatu"] },
  { code: "23", name: "Southern Africa", countries: ["Botswana", "Eswatini", "Kenya", "Lesotho", "Mauritius", "Namibia", "South Africa", "Zambia", "Zimbabwe"] },
  { code: "10", name: "USA - California", countries: ["USA"], keywords: ["california"] },
  { code: "7", name: "USA - Central South", countries: ["USA"], keywords: ["arkansas", "louisiana", "mississippi", "oklahoma", "texas"] },
  { code: "5", name: "USA - Florida", countries: ["USA"], keywords: ["florida"] },
  { code: "13", name: "USA - Hawaiian Islands", countries: ["USA"], keywords: ["hawaii"] },
  { code: "27", name: "USA - Lake Tahoe & Las Vegas", countries: ["USA"], keywords: ["lake tahoe", "las vegas"] },
  { code: "6", name: "USA - Middle Atlantic", countries: ["USA"], keywords: ["delaware", "maryland", "new jersey", "new york", "pennsylvania", "virginia", "washington dc", "west virginia"] },
  { code: "8", name: "USA - Midwest", countries: ["USA"], keywords: ["illinois", "indiana", "iowa", "kansas", "michigan", "minnesota", "missouri", "nebraska", "north dakota", "ohio", "south dakota", "wisconsin"] },
  { code: "3", name: "USA - New England", countries: ["USA"], keywords: ["connecticut", "maine", "massachusetts", "new hampshire", "rhode island", "vermont"] },
  { code: "11", name: "USA - Northwest & Alaska", countries: ["USA"], keywords: ["alaska", "idaho", "montana", "oregon", "washington", "wyoming"] },
  { code: "9", name: "USA - Rocky Mountains", countries: ["USA"], keywords: ["colorado", "new mexico", "utah"] },
  { code: "4", name: "USA - Southeast", countries: ["USA"], keywords: ["georgia", "north carolina", "south carolina", "tennessee"] },
  { code: "12", name: "USA - Southwest", countries: ["USA"], keywords: ["arizona", "nevada"] },
];

function normalized(value: string) {
  return value.trim().toLowerCase();
}

function containsKeyword(value: string, keyword: string) {
  if (keyword.length <= 3) {
    return new RegExp(`(?:^|[\\s,])${keyword}(?:$|[\\s,.])`, "i").test(value);
  }
  return value.includes(keyword);
}

function matchesCanadaRegion(searchable: string, code: string) {
  const postalPrefix = searchable.match(/\b([a-z])\d[a-z]\s?\d[a-z]\d\b/i)?.[1];
  if (code === "1" && postalPrefix && /[abeghjklmnpr]/i.test(postalPrefix)) {
    return true;
  }
  if (code === "2" && postalPrefix && /[stuvwyxz]/i.test(postalPrefix)) {
    return true;
  }
  return false;
}

export function getDirectoryRegionsForCountry(country: string) {
  const value = normalized(decodeURIComponent(country));
  return DIRECTORY_REGIONS.filter((region) =>
    region.countries.some((candidate) => normalized(candidate) === value),
  );
}

export function getDirectoryRegion(code: string) {
  return DIRECTORY_REGIONS.find((region) => region.code === code);
}

export function getResortsByDirectoryRegion(resorts: Resort[], regionCode: string) {
  const region = getDirectoryRegion(regionCode);
  if (!region) return [];

  return resorts.filter((resort) => {
    const country = normalized(resort.country || "");
    if (!region.countries.some((candidate) => normalized(candidate) === country)) {
      return false;
    }

    if (!region.keywords?.length) return true;

    const searchable = [
      resort.region,
      resort.location,
      resort.place_name,
      resort.resortName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (country === "canada" && matchesCanadaRegion(searchable, region.code)) {
      return true;
    }

    return region.keywords.some((keyword) => containsKeyword(searchable, keyword));
  });
}
