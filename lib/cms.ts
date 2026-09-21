import { apiFetch } from "@/lib/api";

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

export async function fetchHomepage(): Promise<HomepageData> {
  return apiFetch<HomepageData>("/api/cms/homepage/");
}

export async function fetchNavigation(): Promise<NavigationData> {
  return apiFetch<NavigationData>("/api/cms/navigation/");
}

export async function fetchIntervalHd() {
  return apiFetch<Record<string, unknown>>("/api/cms/interval-hd/");
}

export async function fetchDirectoryMeta(): Promise<DirectoryMeta> {
  return apiFetch<DirectoryMeta>("/api/cms/directory/");
}

export async function fetchTracker() {
  return apiFetch<{ content: Record<string, unknown>; trips: unknown[] }>("/api/cms/tracker/");
}

export async function fetchLivePageByPath(path: string): Promise<LivePage | null> {
  try {
    const normalized = path.replace(/\/$/, "") || "/";
    return await apiFetch<LivePage>(
      `/api/cms/live-pages/by-path/?path=${encodeURIComponent(normalized)}`,
    );
  } catch {
    return null;
  }
}

export async function fetchLivePagePaths(): Promise<string[]> {
  const data = await apiFetch<{ pages: LivePage[] }>("/api/cms/live-pages/");
  return data.pages.map((p) => p.path);
}

export async function fetchHelpTopics() {
  return apiFetch<
    { id: number; label: string; topics: { label: string; value: string }[] }[]
  >("/api/support/topics/");
}

export async function fetchUnitRates(): Promise<UnitRate[]> {
  const data = await apiFetch<{ results: UnitRate[] }>("/api/cms/unit-rates/");
  return data.results;
}

export async function fetchMarketingPage(path: string) {
  try {
    const normalized = path.replace(/\/$/, "") || "/";
    return await apiFetch<{
      path: string;
      component: string;
      cards: Record<string, unknown>;
    }>(`/api/cms/marketing/?path=${encodeURIComponent(normalized)}`);
  } catch {
    return null;
  }
}
