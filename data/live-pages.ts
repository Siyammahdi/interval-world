import live from "./live-pages.json";

export type LivePage = {
  path: string;
  source: string;
  status: number;
  layout: string;
  title: string;
  documentTitle?: string;
  bodyHtml: string;
};

type LivePagesFile = {
  generatedAt: string;
  pages: LivePage[];
};

const data = live as LivePagesFile;

const pageMap = new Map(data.pages.map((page) => [page.path.replace(/\/$/, "") || "/", page]));

export function getLivePageByPath(path: string): LivePage | undefined {
  const normalized = path.replace(/\/$/, "") || "/";
  return pageMap.get(normalized);
}

export function getAllLivePagePaths(): string[] {
  return data.pages.map((page) => page.path);
}

export function getLivePages(): LivePage[] {
  return data.pages;
}
