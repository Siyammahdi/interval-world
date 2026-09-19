export type TrackerTrip = {
  id: string;
  fullName: string;
  transactionType: string;
  relinquishedResortName: string;
  relinquishedResortLat: string;
  relinquishedResortLong: string;
  relinquishedCity: string;
  relinquishedCountry: string;
  relinquishedResortCode: string;
  destinationResortName: string;
  destinationResortLat: string;
  destinationResortLong: string;
  destiantionCity: string;
  destinationCountry: string;
  destinationResortCode: string;
};

/** Legend: light blue = exchange, dark blue = Getaway (SVG data URIs) */
const trackerPins = {
  exchange:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='32' viewBox='0 0 22 32'%3E%3Cpath fill='%234BA3D9' stroke='%23fff' stroke-width='1.5' d='M11 1C5.5 1 1 5.5 1 11c0 7.5 10 20 10 20s10-12.5 10-20C21 5.5 16.5 1 11 1z'/%3E%3C/svg%3E",
  getaway:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='32' viewBox='0 0 22 32'%3E%3Cpath fill='%2318294b' stroke='%23cfd6e0' stroke-width='1.5' d='M11 1C5.5 1 1 5.5 1 11c0 7.5 10 20 10 20s10-12.5 10-20C21 5.5 16.5 1 11 1z'/%3E%3C/svg%3E",
  home:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Ccircle cx='7' cy='7' r='5.5' fill='%234BA3D9' stroke='%23fff' stroke-width='1.5'/%3E%3C/svg%3E",
} as const;

export const trackerContent = {
  title: "Travel and exchange tracker",
  breadcrumb: "Vacation Planning made easy",
  paragraphs: [] as string[],
  legendTitle: "Point the Way",
  legend: [
    {
      icon: trackerPins.exchange,
      iconWidth: 22,
      iconHeight: 32,
      text: "Click the light blue pin on the map for recent exchange activity, resort details, and photos.",
    },
    {
      icon: trackerPins.home,
      iconWidth: 14,
      iconHeight: 14,
      text: "The light blue circle on the map indicates the member's home resort.",
      inline: true,
    },
    {
      icon: trackerPins.getaway,
      iconWidth: 22,
      iconHeight: 32,
      text: "Click the dark blue pin on the map for recent Getaway activity, resort details, and photos.",
    },
  ],
  pins: trackerPins,
  mapCenter: { lat: 40, lng: -60 },
  mapZoom: 3,
} as const;
