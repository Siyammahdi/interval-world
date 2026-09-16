/**
 * Extract Interval Exchange Tracker page content + assets from live site.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const ORIGIN = "https://www.intervalworld.com";
const URL = ORIGIN + "/web/my/info/planning/tracker";

async function download(absUrl, localRel) {
  const disk = path.join(root, "public", localRel.replace(/^\//, ""));
  fs.mkdirSync(path.dirname(disk), { recursive: true });
  if (fs.existsSync(disk) && fs.statSync(disk).size > 0) return localRel;
  try {
    const res = await fetch(absUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      console.log("fail", absUrl, res.status);
      return absUrl;
    }
    fs.writeFileSync(disk, Buffer.from(await res.arrayBuffer()));
    console.log("saved", localRel);
    return localRel;
  } catch (e) {
    console.log("err", absUrl, e.message);
    return absUrl;
  }
}

const html = await fetch(URL, { headers: { "User-Agent": "Mozilla/5.0" } }).then((r) =>
  r.text(),
);
fs.writeFileSync(path.join(__dirname, "tracker-live.html"), html);
console.log("html", html.length);

// Asset candidates
const assets = [
  "/images/rel_pin.png",
  "/images/dest_pin.png",
  "/images/home_pin.png",
  "/images/rel_pin_sm.png",
  "/images/dest_pin_sm.png",
  "/images/home_circle.png",
  "/images/tracker/rel_pin.png",
  "/images/tracker/dest_pin.png",
  "/css/tracker.css",
  "/scripts/tracker.js",
  "/scripts/my/tracker.js",
];

for (const a of [...html.matchAll(/(?:src|href)="([^"]*(?:pin|tracker|map)[^"]*)"/gi)].map(
  (m) => m[1],
)) {
  if (!assets.includes(a)) assets.push(a);
}

console.log("\nASSETS FOUND:");
for (const a of assets) console.log(a);

// Legend / Point the Way section
const legend = html.match(/Point the Way[\s\S]{0,2500}/i)?.[0];
console.log("\nLEGEND:\n", legend?.slice(0, 2000));

// Map init script
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((m) => m[1])
  .filter((s) => /map|google|marker|pin|lat|lng/i.test(s));
console.log("\nINLINE SCRIPTS:", scripts.length);
for (const s of scripts.slice(0, 3)) console.log("---\n", s.slice(0, 1500));

const ext = [...html.matchAll(/src="([^"]+\.js[^"]*)"/gi)].map((m) => m[1]);
console.log("\nJS:", [...new Set(ext)].filter((u) => /tracker|map|google|marker/i.test(u)).join("\n"));

// Download pin images from body
for (const m of html.matchAll(/src="((?:https?:)?\/\/[^"]*|(?:\/[^"]+))"/gi)) {
  const u = m[1];
  if (!/pin|tracker/i.test(u)) continue;
  const abs = u.startsWith("http") ? u : u.startsWith("//") ? "https:" + u : ORIGIN + u;
  const local = "/images/live" + new URL(abs).pathname.replace(/[^\w./-]+/g, "_");
  await download(abs, local);
}
