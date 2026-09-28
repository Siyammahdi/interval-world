import directoryJson from "@/data/content/directory.json";
import helpTopicsJson from "@/data/content/help-topics.json";
import homepageJson from "@/data/content/homepage.json";
import intervalHdJson from "@/data/content/interval-hd.json";
import livePagesJson from "@/data/content/live-pages.json";
import marketingPagesJson from "@/data/content/marketing-pages.json";
import navigationJson from "@/data/content/navigation.json";
import trackerJson from "@/data/content/tracker.json";
import unitRatesJson from "@/data/content/unit-rates.json";

export type HeroSlide = {
  id: string;
  href: string;
  alt: string;
  image: string;
};

export type BenefitCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type Destination = { label: string; href: string };

export type MemberAlert = {
  title: string;
  bodyBefore: string;
  linkLabel: string;
  linkHref: string;
  bodyAfter: string;
};

export type HomepageData = {
  heroSlides: HeroSlide[];
  memberAlert: MemberAlert;
  benefitCards: BenefitCard[];
  destinations: Destination[];
};

export type NavChild = { label: string; href: string };
export type NavItem = {
  id: string;
  label: string;
  href: string;
  image: string;
  children: NavChild[];
};

export type NavigationData = {
  languages: { label: string; href: string; code: string }[];
  mainNav: NavItem[];
  footerLinks: { label: string; href: string }[];
  socialLinks: { label: string; href: string; icon: string }[];
};

export type LivePage = {
  path: string;
  source: string;
  status: number;
  layout: string;
  title: string;
  documentTitle?: string;
  bodyHtml: string;
};

export type DirectoryMeta = {
  pageSize: number;
  mapSearchRegions: { heading: string; links: { label: string; href: string }[] }[];
  amenities: string[];
};

export type UnitRate = {
  unit_type: string;
  cash_per_night: number;
  points_per_night: number;
  exchange_label: string;
  getaway_label: string;
  sort_order: number;
};

export type HelpTopicCategory = {
  id: number;
  label: string;
  topics: { label: string; value: string }[];
};

export type MarketingPage = {
  path: string;
  component: string;
  cards: Record<string, unknown>;
};

const livePages = livePagesJson as LivePage[];
const marketingPages = marketingPagesJson as MarketingPage[];

function normalizePath(path: string) {
  return path.replace(/\/$/, "") || "/";
}

export const navigationData = navigationJson as NavigationData;
export const helpTopics = helpTopicsJson as HelpTopicCategory[];

export async function fetchHomepage(): Promise<HomepageData> {
  return homepageJson as HomepageData;
}

export async function fetchNavigation(): Promise<NavigationData> {
  return navigationData;
}

export async function fetchIntervalHd() {
  return intervalHdJson as Record<string, unknown>;
}

export async function fetchDirectoryMeta(): Promise<DirectoryMeta> {
  return directoryJson as DirectoryMeta;
}

export async function fetchTracker() {
  return trackerJson as { content: Record<string, unknown>; trips: unknown[] };
}

export async function fetchLivePageByPath(path: string): Promise<LivePage | null> {
  const normalized = normalizePath(path);
  return livePages.find((p) => p.path === normalized) ?? null;
}

export async function fetchLivePagePaths(): Promise<string[]> {
  return livePages.map((p) => p.path);
}

export async function fetchHelpTopics(): Promise<HelpTopicCategory[]> {
  return helpTopics;
}

export async function fetchUnitRates(): Promise<UnitRate[]> {
  return unitRatesJson as UnitRate[];
}

export async function fetchMarketingPage(path: string): Promise<MarketingPage | null> {
  const normalized = normalizePath(path);
  return marketingPages.find((p) => p.path === normalized) ?? null;
}
