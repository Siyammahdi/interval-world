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

export type TrackerContent = {
  title: string;
  breadcrumb: string;
  paragraphs: string[];
  legendTitle: string;
  legend: {
    icon: string;
    iconWidth: number;
    iconHeight: number;
    text: string;
    inline?: boolean;
  }[];
  pins: {
    exchange: string;
    getaway: string;
    home: string;
  };
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
};

export { fetchTracker as getTracker } from "@/lib/cms";
