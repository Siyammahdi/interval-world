/** Public base URL of the media bucket (Cloudflare R2). Empty = serve from /public. */
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_URL || "").replace(/\/$/, "");

const MEDIA_PREFIXES = ["/images/", "/videos/"];

export function isMediaPath(path: string) {
  return MEDIA_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/** Resolve a local media path (`/images/...`, `/videos/...`) to its public URL. */
export function mediaUrl(path: string): string {
  if (!MEDIA_BASE || !path || !isMediaPath(path)) return path;
  return `${MEDIA_BASE}${path}`;
}
