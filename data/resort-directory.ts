import { fetchDirectoryMeta, type DirectoryMeta } from "@/lib/cms";

export type { DirectoryMeta };

export async function getDirectoryMeta() {
  return fetchDirectoryMeta();
}

/** Fallback used only if API is unreachable during build. */
export const DIRECTORY_PAGE_SIZE = 12;
