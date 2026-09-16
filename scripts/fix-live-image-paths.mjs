/**
 * Fix doubled /images/live/images/live/ paths and download missing Explore & Plan assets.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://www.intervalworld.com";
const jsonPath = path.join(root, "data", "live-pages.json");
const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

function fixPath(src) {
  let s = src;
  // Collapse /images/live/images/live/... -> /images/live/...
  while (s.includes("/images/live/images/live/")) {
    s = s.replace("/images/live/images/live/", "/images/live/");
  }
  // /images/live/images/iw/... is OK (maps to public/images/live/images/iw)
  // /images/live/images/rel_pin.png OK
  return s;
}

function toAbs(local) {
  // /images/live/iimedia/... -> https://www.intervalworld.com/iimedia/...
  // /images/live/images/iw/... -> https://www.intervalworld.com/images/iw/...
  // /images/live/files/... -> https://www.intervalworld.com/files/...
  const rest = local.replace(/^\/images\/live\//, "");
  return ORIGIN + "/" + rest;
}

async function download(localRel) {
  const disk = path.join(root, "public", localRel.replace(/^\//, ""));
  if (fs.existsSync(disk) && fs.statSync(disk).size > 0) return true;
  const abs = toAbs(localRel);
  try {
    const res = await fetch(abs, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      console.log("FAIL", res.status, abs);
      return false;
    }
    fs.mkdirSync(path.dirname(disk), { recursive: true });
    fs.writeFileSync(disk, Buffer.from(await res.arrayBuffer()));
    console.log("OK", localRel, fs.statSync(disk).size);
    return true;
  } catch (e) {
    console.log("ERR", abs, e.message);
    return false;
  }
}

let fixedCount = 0;
const needed = new Set();

for (const page of data.pages) {
  const before = page.bodyHtml;
  page.bodyHtml = before.replace(
    /(?:src|href)=["']([^"']+)["']|url\((['"]?)([^)'"]+)\2\)/gi,
    (full, src1, _q, src2) => {
      const raw = src1 || src2;
      if (!raw) return full;
      const fixed = fixPath(raw);
      if (fixed !== raw) fixedCount += 1;
      if (fixed.startsWith("/images/live/")) needed.add(fixed);
      return full.replace(raw, fixed);
    },
  );
  // Also fix plain path occurrences in HTML that might remain
  page.bodyHtml = page.bodyHtml.replace(/\/images\/live\/images\/live\//g, "/images/live/");
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log("fixed path refs:", fixedCount);

const explore = [
  "/web/cs/mobile-app",
  "/web/my/info/planning/community",
  "/web/my/info/planning/magazine",
  "/web/my/info/planning",
  "/web/my/info/planning/travel",
];

for (const p of explore) {
  const page = data.pages.find((x) => x.path === p);
  if (!page) continue;
  const imgs = [...page.bodyHtml.matchAll(/src="([^"]+)"/gi)].map((m) => m[1]);
  const bgs = [...page.bodyHtml.matchAll(/url\((['"]?)([^)'"]+)\1\)/gi)].map((m) => m[2]);
  for (const src of [...imgs, ...bgs]) {
    if (src.startsWith("/images/live/")) needed.add(fixPath(src));
  }
}

console.log("downloading", needed.size, "assets");
let ok = 0;
let fail = 0;
for (const local of [...needed]) {
  const success = await download(local);
  if (success) ok += 1;
  else fail += 1;
}
console.log("done ok=", ok, "fail=", fail);
