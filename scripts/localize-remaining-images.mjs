/**
 * Localize every remaining remote resort image.
 *
 * Strategy per remote slot:
 *  1) Retry the original URL (with host-appropriate Referer)
 *  2) Try Interval World photos by resort symbol (ii_{code}1.jpg …)
 *  3) Reuse another local photo already on that resort
 *  4) Assign a locally stored Unsplash fallback (downloaded once)
 *
 * Usage: node scripts/localize-remaining-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataFile = path.join(root, "data", "resort-data.json");
const sourcesFile = path.join(root, "data", "resort-image-sources.json");
const outRoot = path.join(root, "public", "images", "resorts");
const fallbackDir = path.join(outRoot, "_fallbacks");

const IMAGE_KEYS = ["img", "img2", "img3", "img4", "img5"];
const CONCURRENCY = 8;

const UNSPLASH_FALLBACKS = [
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
  "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
  "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800&q=80",
  "https://images.unsplash.com/photo-1543968996-ee822b8176ba?w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
  "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80",
  "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800&q=80",
  "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800&q=80",
  "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
];

function hashSeed(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash;
}

function refererFor(url) {
  try {
    const host = new URL(url).hostname;
    if (host.includes("bstatic") || host.includes("booking")) return "https://www.booking.com/";
    if (host.includes("rci.com")) return "https://www.rci.com/";
    if (host.includes("intervalworld")) return "https://www.intervalworld.com/";
    if (host.includes("unsplash")) return "https://unsplash.com/";
  } catch {
    /* ignore */
  }
  return "https://www.intervalworld.com/";
}

function extFromUrl(url, contentType = "") {
  const pathname = (() => {
    try {
      return new URL(url).pathname.toLowerCase();
    } catch {
      return "";
    }
  })();
  if (pathname.endsWith(".png")) return ".png";
  if (pathname.endsWith(".webp")) return ".webp";
  if (pathname.endsWith(".gif")) return ".gif";
  if (pathname.endsWith(".jpeg")) return ".jpeg";
  if (pathname.endsWith(".jpg")) return ".jpg";
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("gif")) return ".gif";
  return ".jpg";
}

async function downloadOne(url, destPath) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: refererFor(url),
      },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get("content-type") || "";
    if (type && !type.startsWith("image/") && !type.includes("octet-stream")) {
      throw new Error(`Not an image: ${type}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500) throw new Error(`Too small (${buf.length}b)`);
    // Reject obvious HTML/error bodies
    const head = buf.slice(0, 64).toString("utf8").toLowerCase();
    if (head.includes("<!doctype") || head.includes("<html") || head.includes("<?xml")) {
      throw new Error("Got HTML/XML instead of image");
    }
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    let finalPath = destPath;
    const wanted = extFromUrl(url, type);
    if (path.extname(destPath) !== wanted) {
      finalPath = destPath.replace(/\.[^.]+$/, wanted);
    }
    fs.writeFileSync(finalPath, buf);
    return { ok: true, path: finalPath, bytes: buf.length, url };
  } finally {
    clearTimeout(timer);
  }
}

function publicRel(absPath) {
  return "/" + path.relative(path.join(root, "public"), absPath).replace(/\\/g, "/");
}

function intervalWorldCandidates(symbol, keyIndex) {
  const code = String(symbol || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (!code) return [];
  // Interval World naming: ii_{code}.jpg, ii_{code}1.jpg, ii_{code}2.jpg…
  const nums = [keyIndex + 1, 1, 2, 3, 4, 5, ""];
  const out = [];
  for (const n of nums) {
    out.push(`https://www.intervalworld.com/images/_resd/jpglg/ii_${code}${n}.jpg`);
  }
  return [...new Set(out)];
}

function localSibling(resort) {
  for (const k of IMAGE_KEYS) {
    const v = resort[k];
    if (typeof v === "string" && v.startsWith("/images/resorts/") && !v.includes("/_fallbacks/")) {
      const abs = path.join(root, "public", v.replace(/^\//, ""));
      if (fs.existsSync(abs) && fs.statSync(abs).size > 500) return { rel: v, abs };
    }
  }
  return null;
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const sources = fs.existsSync(sourcesFile)
  ? JSON.parse(fs.readFileSync(sourcesFile, "utf8"))
  : {};

// 1) Ensure Unsplash fallbacks exist locally
fs.mkdirSync(fallbackDir, { recursive: true });
const localFallbacks = [];
console.log("Ensuring local Unsplash fallbacks…");
for (let i = 0; i < UNSPLASH_FALLBACKS.length; i++) {
  const dest = path.join(fallbackDir, `${i}.jpg`);
  if (!fs.existsSync(dest) || fs.statSync(dest).size < 500) {
    try {
      await downloadOne(UNSPLASH_FALLBACKS[i], dest);
      console.log(`  fallback ${i} downloaded`);
    } catch (err) {
      console.warn(`  fallback ${i} failed: ${err.message}`);
      continue;
    }
  }
  const rel = publicRel(dest);
  localFallbacks.push(rel);
  sources[rel] = UNSPLASH_FALLBACKS[i];
}

if (!localFallbacks.length) {
  console.error("No local fallbacks available — aborting.");
  process.exit(1);
}

// 2) Collect remote slots
/** @type {{ resort: any, key: string, keyIndex: number, url: string }[]} */
const jobs = [];
for (const resort of data) {
  for (let i = 0; i < IMAGE_KEYS.length; i++) {
    const key = IMAGE_KEYS[i];
    const raw = resort[key];
    if (!raw) continue;
    if (/^https?:\/\//i.test(String(raw))) {
      jobs.push({ resort, key, keyIndex: i, url: String(raw).trim() });
    }
  }
}

console.log(`Localizing ${jobs.length} remote image slots (concurrency=${CONCURRENCY})…`);

let fromOriginal = 0;
let fromInterval = 0;
let fromSibling = 0;
let fromFallback = 0;
let failed = 0;

await mapPool(jobs, CONCURRENCY, async (job) => {
  const { resort, key, keyIndex, url } = job;
  const id = resort._id;
  const destBase = path.join(outRoot, id, key);

  // a) original
  try {
    const result = await downloadOne(url, destBase + extFromUrl(url));
    const rel = publicRel(result.path);
    resort[key] = rel;
    sources[rel] = url;
    fromOriginal++;
    return;
  } catch {
    /* continue */
  }

  // b) Interval World by symbol
  const symbol = resort.symbol || resort.resort_ID || "";
  for (const alt of intervalWorldCandidates(symbol, keyIndex)) {
    try {
      const result = await downloadOne(alt, destBase + ".jpg");
      const rel = publicRel(result.path);
      resort[key] = rel;
      sources[rel] = alt;
      sources[`remote:${id}:${key}`] = url;
      fromInterval++;
      return;
    } catch {
      /* try next */
    }
  }

  // c) sibling local photo on same resort
  const sib = localSibling(resort);
  if (sib) {
    const dest = destBase + path.extname(sib.abs);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(sib.abs, dest);
    const rel = publicRel(dest);
    resort[key] = rel;
    sources[rel] = `copy:${sib.rel}`;
    sources[`remote:${id}:${key}`] = url;
    fromSibling++;
    return;
  }

  // d) local Unsplash fallback (deterministic per resort+slot)
  const fb =
    localFallbacks[hashSeed(`${id}:${key}`) % localFallbacks.length] || localFallbacks[0];
  const fbAbs = path.join(root, "public", fb.replace(/^\//, ""));
  const dest = destBase + path.extname(fbAbs);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(fbAbs, dest);
  const rel = publicRel(dest);
  resort[key] = rel;
  sources[rel] = `fallback:${fb}`;
  sources[`remote:${id}:${key}`] = url;
  fromFallback++;
});

// Promote: if img is somehow still remote (shouldn't happen), leave as-is — we rewrite all above.

fs.writeFileSync(sourcesFile, JSON.stringify(sources, null, 2));
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

// Verify zero remotes remain
let remotesLeft = 0;
for (const resort of data) {
  for (const key of IMAGE_KEYS) {
    const v = resort[key];
    if (v && /^https?:\/\//i.test(String(v))) remotesLeft++;
  }
}

console.log("\nDone.");
console.log(`  original=${fromOriginal} intervalWorld=${fromInterval} sibling=${fromSibling} fallback=${fromFallback} failed=${failed}`);
console.log(`  remotesLeft=${remotesLeft}`);
console.log(`Wrote ${path.relative(root, dataFile)}`);
console.log(`Wrote ${path.relative(root, sourcesFile)}`);
