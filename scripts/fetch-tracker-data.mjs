import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const ORIGIN = "https://www.intervalworld.com";

async function download(absUrl, localRel) {
  const disk = path.join(root, "public", localRel.replace(/^\//, ""));
  fs.mkdirSync(path.dirname(disk), { recursive: true });
  if (fs.existsSync(disk) && fs.statSync(disk).size > 0) {
    console.log("exists", localRel, fs.statSync(disk).size);
    return localRel;
  }
  const res = await fetch(absUrl, { headers: { "User-Agent": "Mozilla/5.0", Referer: ORIGIN + "/" } });
  if (!res.ok) {
    console.log("fail", absUrl, res.status);
    return null;
  }
  fs.writeFileSync(disk, Buffer.from(await res.arrayBuffer()));
  console.log("saved", localRel, fs.statSync(disk).size);
  return localRel;
}

const dataRes = await fetch(ORIGIN + "/web/my/info/mapData", {
  headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json", Referer: ORIGIN + "/web/my/info/planning/tracker" },
});
console.log("mapData status", dataRes.status, dataRes.headers.get("content-type"));
const text = await dataRes.text();
fs.writeFileSync(path.join(__dirname, "tracker-mapData-raw.txt"), text.slice(0, 5000));
console.log("len", text.length, "start", text.slice(0, 300));

let data;
try {
  data = JSON.parse(text);
} catch {
  console.log("not json");
  process.exit(1);
}

console.log("items", Array.isArray(data) ? data.length : typeof data);
if (Array.isArray(data) && data[0]) console.log("sample", JSON.stringify(data[0], null, 2));

// Keep a reasonable sample for the demo (first 80)
const sample = Array.isArray(data) ? data.slice(0, 80) : data;
const outPath = path.join(root, "data", "tracker-map-data.json");
fs.writeFileSync(outPath, JSON.stringify(sample, null, 2));
console.log("wrote", outPath);

const pins = [
  "/images/blue_pin.png",
  "/images/orange_pin.png",
  "/images/blue_circle.png",
  "/images/orange_circle.png",
  "/images/rel_pin.png",
  "/images/dest_pin.png",
];
for (const p of pins) {
  await download(ORIGIN + p, "/images/live" + p);
}

await download(
  "https://www.intervalworld.com/iimedia/images/prelogin/blue_pin_exchange_tracker.jpg",
  "/images/live/iimedia/images/prelogin/blue_pin_exchange_tracker.jpg",
);
await download(
  "https://www.intervalworld.com/iimedia/images/prelogin/orange_pin_exchange_tracker.jpg",
  "/images/live/iimedia/images/prelogin/orange_pin_exchange_tracker.jpg",
);
await download(
  "https://www.intervalworld.com/iimedia/images/prelogin/blue_circle.png",
  "/images/live/iimedia/images/prelogin/blue_circle.png",
);
