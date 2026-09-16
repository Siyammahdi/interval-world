/**
 * Extract Interval HD page data (hero, tabs, regional videos) from live site.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const ORIGIN = "https://www.intervalworld.com";
const outData = path.join(root, "data", "interval-hd.ts");
const assetDir = path.join(root, "public", "images", "channel");

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">")
    .trim();
}

function absolutize(url) {
  if (!url) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return ORIGIN + url;
  return ORIGIN + "/" + url;
}

async function download(absUrl, localRel) {
  const disk = path.join(root, "public", localRel.replace(/^\//, ""));
  fs.mkdirSync(path.dirname(disk), { recursive: true });
  if (fs.existsSync(disk) && fs.statSync(disk).size > 0) return localRel;
  try {
    const res = await fetch(absUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      console.warn("FAIL", res.status, absUrl);
      return absUrl;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(disk, buf);
    console.log("OK", localRel, buf.length);
    return localRel;
  } catch (e) {
    console.warn("ERR", absUrl, e.message);
    return absUrl;
  }
}

function localFromUrl(absUrl) {
  const u = new URL(absUrl);
  const clean = u.pathname.replace(/^\/+/, "").replace(/%20/g, "_").replace(/[^\w./-]+/g, "_");
  return `/images/live/${clean}`;
}

const html = await fetch(ORIGIN + "/web/my/hd", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

// Download channel UI assets
const uiAssets = [
  "/images/channel/ihd_header_laptop_beach.jpg",
  "/images/channel/ihd_logo_small.png",
  "/images/channel/ihd_carousel_thumbnails_play.png",
  "/images/channel/ihd_carousel_next.png",
  "/images/channel/ihd_carousel_prev.png",
  "/images/channel/ihd_carousel_next_dark.png",
  "/images/channel/ihd_carousel_prev_dark.png",
  "/images/channel/ihd_destination_label_fold.png",
  "/images/channel/ihd_carousel_header_dash.gif",
  "/images/channel/ihd_carousel_shadow.jpg",
  "/images/iw/intervalhd_banner_200x120.jpg",
];

fs.mkdirSync(assetDir, { recursive: true });
const assetMap = {};
for (const rel of uiAssets) {
  const local = `/images/channel/${path.basename(rel)}`;
  assetMap[rel] = await download(absolutize(rel), local);
}

// Parse thumbnails from ihd_home_wrap / carousel items
const thumbRe =
  /<div class="ihd_thumbnail_wrap[^"]*"[\s\S]*?<a href="([^"]*)"[^>]*aria-label="([^"]*)"[\s\S]*?<img src="([^"]+)"[^>]*alt="([^"]*)"[\s\S]*?<span class="vid_info"[^>]*>\s*<em>([^<]*)<\/em>\s*([\s\S]*?)<\/span>\s*<small>([\s\S]*?)<\/small>/gi;

const videos = [];
let m;
while ((m = thumbRe.exec(html))) {
  const href = decode(m[1]);
  const aria = decode(m[2]);
  const img = absolutize(m[3]);
  const alt = decode(m[4]);
  const duration = decode(m[5]);
  const title = decode(m[6]).replace(/<[^>]+>/g, "").trim() || alt;
  const location = decode(m[7]).replace(/<[^>]+>/g, "").trim();
  const justAdded = /ihd_destination_label/i.test(html.slice(m.index, m.index + 400));
  // Check just added near this thumb
  const chunk = html.slice(Math.max(0, m.index - 50), m.index + 800);
  const isJustAdded = /ihd_destination_label/.test(chunk);
  videos.push({
    href,
    title,
    location,
    duration,
    image: img,
    justAdded: isJustAdded,
  });
}

console.log("parsed videos", videos.length);

// Group by region using h2 headers and following carousel blocks
const regions = [];
const regionRe =
  /<div class="ihd_carousel_header"[^>]*>[\s\S]*?<h2[^>]*>([^<]+)<\/h2>[\s\S]*?<ul[^>]*class="[^"]*mycarousel[^"]*"[^>]*>([\s\S]*?)<\/ul>/gi;
let rm;
while ((rm = regionRe.exec(html))) {
  const name = decode(rm[1]);
  const block = rm[2];
  const items = [];
  let tm;
  const itemRe =
    /<div class="ihd_thumbnail_wrap[^"]*"[\s\S]*?<a href="([^"]*)"[^>]*(?:aria-label="([^"]*)")?[\s\S]*?<img src="([^"]+)"[^>]*(?:alt="([^"]*)")?[\s\S]*?<em>([^<]*)<\/em>\s*([\s\S]*?)<\/span>\s*<small>([\s\S]*?)<\/small>/gi;
  while ((tm = itemRe.exec(block))) {
    const chunk = block.slice(Math.max(0, tm.index - 80), tm.index + 500);
    items.push({
      href: decode(tm[1]),
      title: decode(tm[6]).replace(/<[^>]+>/g, "").trim() || decode(tm[4] || tm[2] || ""),
      location: decode(tm[7]).replace(/<[^>]+>/g, "").trim(),
      duration: decode(tm[5]),
      image: absolutize(tm[3]),
      justAdded: /ihd_destination_label/.test(chunk),
    });
  }
  if (items.length) regions.push({ name, videos: items });
  console.log("region", name, items.length);
}

// Fallback: if region parsing failed, use flat list in one region
if (!regions.length && videos.length) {
  regions.push({ name: "Destinations", videos });
}

// Download a sample of images (first 3 per region to keep size reasonable, plus all justAdded)
const downloadSet = new Set();
for (const region of regions) {
  region.videos.forEach((v, i) => {
    if (i < 12 || v.justAdded) downloadSet.add(v.image);
  });
}
const imageMap = {};
for (const abs of downloadSet) {
  imageMap[abs] = await download(abs, localFromUrl(abs));
}
for (const region of regions) {
  for (const v of region.videos) {
    v.image = imageMap[v.image] || v.image;
  }
}

// Tagline / learn more from live
const taglineMatch =
  html.match(/Quality destinations\.[^<]+/i) ||
  html.match(/Explore Destinations\.[^<]+/i) ||
  html.match(/Great destinations\.[^<]+/i);
const tagline = taglineMatch
  ? decode(taglineMatch[0])
  : "Quality destinations. Real people. True stories.";

const regionLinks = [
  { label: "UNITED STATES", href: "#united-states" },
  { label: "CANADA", href: "#canada" },
  { label: "CARIBBEAN", href: "#caribbean" },
  { label: "EUROPE", href: "#europe" },
  { label: "MEXICO & CENTRAL AMERICA", href: "#mexico-central-america" },
];

const ts = `/* Auto-generated by scripts/extract-interval-hd.mjs — do not edit by hand */
export type HdVideo = {
  href: string;
  title: string;
  location: string;
  duration: string;
  image: string;
  justAdded?: boolean;
};

export type HdRegion = {
  name: string;
  slug: string;
  videos: HdVideo[];
};

export const intervalHd = {
  title: "Interval HD",
  tagline: ${JSON.stringify(tagline)},
  learnMoreHref: "/web/my/info/ownership",
  heroImage: ${JSON.stringify(assetMap["/images/channel/ihd_header_laptop_beach.jpg"] || "/images/channel/ihd_header_laptop_beach.jpg")},
  logoSmall: ${JSON.stringify(assetMap["/images/channel/ihd_logo_small.png"] || "/images/channel/ihd_logo_small.png")},
  playOverlay: ${JSON.stringify(assetMap["/images/channel/ihd_carousel_thumbnails_play.png"] || "/images/channel/ihd_carousel_thumbnails_play.png")},
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
  )},
} as const;
`;

fs.writeFileSync(outData, ts);
console.log("Wrote", outData, "regions", regions.length);

// Also update live-pages entry to a marker so catch-all uses dedicated component
const livePath = path.join(root, "data", "live-pages.json");
const live = JSON.parse(fs.readFileSync(livePath, "utf8"));
const idx = live.pages.findIndex((p) => p.path === "/web/my/channel");
const entry = {
  path: "/web/my/channel",
  source: "/web/my/hd",
  status: 200,
  layout: "interval-hd",
  title: "Interval HD",
  documentTitle: "Interval International | Interval HD",
  bodyHtml: "",
};
if (idx >= 0) live.pages[idx] = entry;
else live.pages.push(entry);
fs.writeFileSync(livePath, JSON.stringify(live, null, 2));
console.log("Updated live-pages channel entry");
