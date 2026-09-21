export type HdVideo = {
  href: string;
  id: string;
  src: string;
  title: string;
  location: string;
  duration: string;
  image: string;
  justAdded?: boolean;
  badgeLabel?: string;
};

export type HdRegion = {
  name: string;
  slug: string;
  videos: HdVideo[];
};

export type IntervalHdData = {
  title: string;
  tagline: string;
  learnMoreHref: string;
  heroImage: string;
  logoSmall: string;
  playOverlay: string;
  tabs: { label: string; href: string; active: boolean }[];
  regionLinks: { label: string; href: string }[];
  regions: HdRegion[];
};

export { fetchIntervalHd as getIntervalHd } from "@/lib/cms";
