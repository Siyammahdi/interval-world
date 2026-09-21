import { fetchLivePageByPath, fetchLivePagePaths, type LivePage } from "@/lib/cms";

export type { LivePage };

export async function getLivePageByPath(path: string): Promise<LivePage | undefined> {
  const page = await fetchLivePageByPath(path);
  return page ?? undefined;
}

export async function getAllLivePagePaths(): Promise<string[]> {
  return fetchLivePagePaths();
}
