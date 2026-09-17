/**
 * Download resort photos to public/images/resorts and rewrite data/resort-data.json
 * to local paths. Original remote URLs are kept in data/resort-image-sources.json.
 *
 * Usage:
 *   node scripts/download-resort-images.mjs
 *   node scripts/download-resort-images.mjs --limit=50   # smoke test
 *   node scripts/download-resort-images.mjs --force      # re-download existing
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataFile = path.join(root, "data", "resort-data.json");
const sourcesFile = path.join(root, "data", "resort-image-sources.json");
const outRoot = path.join(root, "public", "images", "resorts");

const IMAGE_KEYS = ["img", "img2", "img3", "img4", "img5"];
const CONCURRENCY = 12;
const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const limitArg = [...args].find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : 0;

function normalizeImageUrl(raw) {
  if (raw == null) return "";
  let u = String(raw).trim();
  if (!u) return "";

  // Already local
  if (u.startsWith("/images/")) return u;

  const parts = u.split(/(?=https?:\/\/)/i).filter(Boolean);
  if (parts.length > 1) {
    u =
      parts.find((p) => /^https?:\/\//i.test(p) && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(p)) ||
      parts[0];
  }

  if (u.startsWith("//")) u = `https:${u}`;

  if (!/^https?:\/\//i.test(u) && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(u)) {
    if (
      u.startsWith("www.") ||
      u.startsWith("intervalworld.com") ||
      u.startsWith("rci.com")
    ) {
      u = `https://${u}`;
    }
  }

  if (!/^https?:\/\//i.test(u)) return "";

  try {
    const parsed = new URL(u);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return parsed.href;
  } catch {
    return "";
  }
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
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: "https://www.intervalworld.com/",
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
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    // Adjust extension from content-type if needed
    let finalPath = destPath;
    const wanted = extFromUrl(url, type);
    if (path.extname(destPath) !== wanted) {
      finalPath = destPath.replace(/\.[^.]+$/, wanted);
    }
    fs.writeFileSync(finalPath, buf);
    return { ok: true, path: finalPath, bytes: buf.length };
  } finally {
    clearTimeout(timer);
  }
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

/** @type {{ resortId: string, key: string, url: string, relPath: string, absPath: string }[]} */
const jobs = [];

for (const resort of data) {
  const id = resort._id;
  if (!id) continue;
  for (const key of IMAGE_KEYS) {
    const raw = resort[key];
    if (!raw) continue;
    // Skip if already local and file exists (unless force + had remote in sources)
    if (String(raw).startsWith("/images/resorts/") && !force) {
      const abs = path.join(root, "public", String(raw).replace(/^\//, ""));
      if (fs.existsSync(abs)) continue;
      // Local path missing — try original from sources
      const original = sources[String(raw)];
      if (!original) continue;
      const ext = extFromUrl(original);
      const relPath = `/images/resorts/${id}/${key}${ext}`;
      jobs.push({
        resortId: id,
        key,
        url: original,
        relPath,
        absPath: path.join(outRoot, id, `${key}${ext}`),
      });
      continue;
    }

    const url = normalizeImageUrl(raw);
    if (!url || !url.startsWith("http")) continue;

    const ext = extFromUrl(url);
    const relPath = `/images/resorts/${id}/${key}${ext}`;
    jobs.push({
      resortId: id,
      key,
      url,
      relPath,
      absPath: path.join(outRoot, id, `${key}${ext}`),
    });
  }
  if (limit && jobs.length >= limit) break;
}

const work = limit ? jobs.slice(0, limit) : jobs;
console.log(`Downloading ${work.length} images (concurrency=${CONCURRENCY})…`);

let ok = 0;
let skipped = 0;
let failed = 0;
const failSamples = [];

await mapPool(work, CONCURRENCY, async (job) => {
  if (!force && fs.existsSync(job.absPath) && fs.statSync(job.absPath).size > 500) {
    skipped++;
    const resort = data.find((r) => r._id === job.resortId);
    if (resort) resort[job.key] = job.relPath;
    sources[job.relPath] = job.url;
    return;
  }

  try {
    const result = await downloadOne(job.url, job.absPath);
    const publicRel = `/` + path.relative(path.join(root, "public"), result.path).replace(/\\/g, "/");
    const resort = data.find((r) => r._id === job.resortId);
    if (resort) resort[job.key] = publicRel;
    sources[publicRel] = job.url;
    ok++;
    if ((ok + skipped + failed) % 100 === 0) {
      console.log(`  progress: ok=${ok} skip=${skipped} fail=${failed}`);
    }
  } catch (err) {
    failed++;
    if (failSamples.length < 15) {
      failSamples.push({ url: job.url, err: String(err.message || err) });
    }
    // Keep remote URL so the app still works via fallback/hotlink
  }
});

fs.mkdirSync(path.dirname(sourcesFile), { recursive: true });
fs.writeFileSync(sourcesFile, JSON.stringify(sources, null, 2));
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

console.log(`\nDone. ok=${ok} skipped=${skipped} failed=${failed}`);
console.log(`Wrote ${path.relative(root, dataFile)}`);
console.log(`Wrote ${path.relative(root, sourcesFile)}`);
if (failSamples.length) {
  console.log("Sample failures:");
  for (const s of failSamples) console.log(`  - ${s.err} :: ${s.url.slice(0, 100)}`);
}
