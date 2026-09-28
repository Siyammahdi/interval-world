/**
 * Snapshot the Django API content into data/content/*.json so the site runs without a backend.
 * Usage: start interval-server on :4000, then `node scripts/export-api-content.mjs`.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API = (process.env.API_URL || "http://127.0.0.1:4000").replace(/\/$/, "");
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "content");

const MARKETING_PATHS = [
  "/web/cs/mobile-app",
  "/web/my/info/benefits",
  "/web/my/info/benefits/exchange",
  "/web/my/info/benefits/getaways",
  "/web/my/info/benefits/gold",
  "/web/my/info/benefits/membership",
  "/web/my/info/benefits/offers",
  "/web/my/info/benefits/platinum",
  "/web/my/info/membership",
  "/web/my/info/ownership",
  "/web/my/info/ownership/about",
  "/web/my/info/ownership/overview",
  "/web/my/info/planning",
  "/web/my/info/planning/community",
  "/web/my/info/planning/magazine",
  "/web/my/info/planning/travel",
];

async function get(p) {
  const res = await fetch(`${API}${p}`);
  if (!res.ok) throw new Error(`${p} -> ${res.status}`);
  return res.json();
}

async function save(name, data) {
  await writeFile(path.join(OUT, name), JSON.stringify(data));
  console.log(`wrote ${name}`);
}

await mkdir(OUT, { recursive: true });

await save("homepage.json", await get("/api/cms/homepage/"));
await save("navigation.json", await get("/api/cms/navigation/"));
await save("interval-hd.json", await get("/api/cms/interval-hd/"));
await save("directory.json", await get("/api/cms/directory/"));
await save("tracker.json", await get("/api/cms/tracker/"));
await save("live-pages.json", (await get("/api/cms/live-pages/")).pages);
await save("unit-rates.json", (await get("/api/cms/unit-rates/")).results);
await save("help-topics.json", await get("/api/support/topics/"));

const marketing = [];
for (const p of MARKETING_PATHS) {
  marketing.push(await get(`/api/cms/marketing/?path=${encodeURIComponent(p)}`));
}
await save("marketing-pages.json", marketing);

const resorts = [];
for (let page = 1; ; page++) {
  const data = await get(`/api/resorts/?page=${page}&pageSize=100`);
  resorts.push(...data.results);
  if (!data.next) break;
}
await save("resorts.json", resorts);
console.log(`resorts: ${resorts.length}`);
