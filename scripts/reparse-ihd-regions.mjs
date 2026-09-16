/**
 * Robust Interval HD region parse — thumbnail blocks per carousel_header section.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const ORIGIN = "https://www.intervalworld.com";

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function absolutize(url) {
  if (!url) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return ORIGIN + url;
  return ORIGIN + "/" + url;
}

function localFromUrl(absUrl) {
  try {
    const u = new URL(absUrl);
    if (!u.hostname.includes("intervalworld") && !u.hostname.includes("brightcove")) {
      return absUrl;
    }
    if (u.hostname.includes("brightcove")) return absUrl;
    const clean = u.pathname.replace(/^\/+/, "").replace(/%20/g, "_").replace(/[^\w./-]+/g, "_");
    return `/images/live/${clean}`;
  } catch {
    return absUrl;
  }
}

async function download(absUrl, localRel) {
  if (!localRel.startsWith("/images/")) return absUrl;
  const disk = path.join(root, "public", localRel.replace(/^\//, ""));
  fs.mkdirSync(path.dirname(disk), { recursive: true });
  if (fs.existsSync(disk) && fs.statSync(disk).size > 0) return localRel;
  try {
    const res = await fetch(absUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return absUrl;
    fs.writeFileSync(disk, Buffer.from(await res.arrayBuffer()));
    return localRel;
  } catch {
    return absUrl;
  }
}

function parseThumb(block) {
  const href = block.match(/<a href="([^"]*)"/)?.[1];
  const img = block.match(/<img src="([^"]+)"/)?.[1];
  const duration = block.match(/<em>([^<]*)<\/em>/)?.[1] || "";
  const titleAttr = block.match(/class="vid_info"[^>]*title="([^"]*)"/)?.[1];
  const titleFromEm = block.match(/<em>[^<]*<\/em>\s*([^<]+)/)?.[1];
  const location = block.match(/<small>([\s\S]*?)<\/small>/)?.[1] || "";
  const badgeRaw = block.match(/class="ihd_destination_label"[^>]*>([^<]*)</i)?.[1];
  const title = decode(titleAttr || titleFromEm || "").replace(/<[^>]+>/g, "").trim();
  if (!href || !img || !title) return null;
  const badgeLabel = badgeRaw ? decode(badgeRaw).trim() : undefined;
  return {
    href: decode(href),
    title,
    location: decode(location).replace(/<[^>]+>/g, "").trim(),
    duration: decode(duration),
    image: absolutize(img),
    justAdded: Boolean(badgeLabel),
    ...(badgeLabel ? { badgeLabel: badgeLabel.toUpperCase() } : {}),
  };
}

const html = await fetch(ORIGIN + "/web/my/hd", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

const parts = html.split(/<div class="ihd_carousel_header"/i);
const regions = [];

for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  const nameMatch = part.match(/<h2[^>]*>([^<]+)<\/h2>/i);
  if (!nameMatch) continue;
  const name = decode(nameMatch[1]);

  const chunks = part.split(/<div class="ihd_thumbnail_wrap[^"]*"/i).slice(1);
  const items = [];
  for (const chunk of chunks) {
    const block = `<div class="ihd_thumbnail_wrap"${chunk}`;
    const video = parseThumb(block.slice(0, 2500));
    if (video) items.push(video);
  }

  const seen = new Set();
  const unique = items.filter((v) => {
    const key = v.title + "|" + v.duration + "|" + v.image;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const badges = unique.filter((v) => v.badgeLabel).length;
  console.log(name, unique.length, "badges", badges);
  if (unique.length) regions.push({ name, videos: unique });
}

for (const region of regions) {
  for (const v of region.videos) {
    v.image = await download(v.image, localFromUrl(v.image));
  }
}

const regionLinks = regions.map((r) => ({
  label: r.name.toUpperCase(),
  href:
    "#" +
    r.name
      .toLowerCase()
      .replace(/&/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
}));

const out = `/* Auto-generated Interval HD data */
export type HdVideo = {
  href: string;
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

export const intervalHd = {
  title: "Interval HD",
  tagline: "Explore destinations. Tour resorts. Take a peek.",
  learnMoreHref: "#vid=2183760959001&vname=Presenting Interval HD&vref=tutorial",
  heroImage: "/images/channel/ihd_header_laptop_beach.jpg",
  logoSmall: "/images/channel/ihd_logo_small.png",
  playOverlay: "/images/channel/ihd_carousel_thumbnails_play.png",
  tabs: [
    { label: "Destinations & Resorts", href: "/web/my/channel", active: true },
    { label: "Helpful Videos", href: "/web/my/hd/helpful-videos", active: false },
  ],
  regionLinks: ${JSON.stringify(regionLinks, null, 2)},
  regions: ${JSON.stringify(
    regions.map((r) => ({
      name: r.name,
      slug: r.name
        .toLowerCase()
        .replace(/&/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      videos: r.videos,
    })),
    null,
    2,
  )} as HdRegion[],
};
`;

fs.writeFileSync(path.join(root, "data", "interval-hd.ts"), out);
console.log("done", regions.map((r) => r.name + ":" + r.videos.length).join(", "));
