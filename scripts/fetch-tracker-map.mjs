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
    console.log("exists", localRel);
    return localRel;
  }
  const res = await fetch(absUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) {
    console.log("fail", absUrl, res.status);
    return null;
  }
  fs.writeFileSync(disk, Buffer.from(await res.arrayBuffer()));
  console.log("saved", localRel, fs.statSync(disk).size);
  return localRel;
}

const mapJs = await fetch(ORIGIN + "/scripts/my/info/map.js", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());
fs.writeFileSync(path.join(__dirname, "tracker-map.js"), mapJs);
console.log("map.js", mapJs.length);

// Find data URLs / marker endpoints
const urls = [...mapJs.matchAll(/["'](\/[^"']+|https?:\/\/[^"']+)["']/g)].map((m) => m[1]);
console.log("urls sample:", [...new Set(urls)].slice(0, 40).join("\n"));

const pinAssets = [
  "http://www.intervalworld.com/iimedia/images/prelogin/blue_pin_exchange_tracker.jpg",
  "http://www.intervalworld.com/iimedia/images/prelogin/orange_pin_exchange_tracker.jpg",
  "http://www.intervalworld.com/iimedia/images/prelogin/blue_circle.png",
  ORIGIN + "/images/rel_pin.png",
  ORIGIN + "/images/dest_pin.png",
];

for (const abs of pinAssets) {
  const pathname = abs.replace(/^https?:\/\/[^/]+/, "");
  const local = "/images/live" + pathname.replace(/%20/g, "_").replace(/[^\w./-]+/g, "_");
  await download(abs.replace("http://", "https://"), local);
}

// Search for ajax/json endpoints in map.js
const ajax = [...mapJs.matchAll(/(?:url|ajax|fetch|getJSON)\s*[:(=]\s*['"]([^'"]+)['"]/gi)];
console.log("ajax", ajax.map((m) => m[1]));
const markers = mapJs.match(/markers?|lat|lng|latitude|exchange|getaway/gi);
console.log("keyword hits", markers?.length);

console.log("\n--- map.js head ---\n", mapJs.slice(0, 2000));
console.log("\n--- map.js mid ---\n", mapJs.slice(2000, 4500));
