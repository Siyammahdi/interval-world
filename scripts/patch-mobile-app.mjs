import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://www.intervalworld.com";

async function dl(abs, local) {
  const disk = path.join(root, "public", local.replace(/^\//, ""));
  if (fs.existsSync(disk) && fs.statSync(disk).size > 0) {
    console.log("exists", local);
    return;
  }
  const res = await fetch(abs, { headers: { "User-Agent": "Mozilla/5.0" } });
  console.log(abs, res.status);
  if (!res.ok) return;
  fs.mkdirSync(path.dirname(disk), { recursive: true });
  fs.writeFileSync(disk, Buffer.from(await res.arrayBuffer()));
  console.log("saved", local);
}

await dl(ORIGIN + "/images/iw/apple-store-black.png", "/images/live/images/iw/apple-store-black.png");
await dl(ORIGIN + "/images/iw/android-store-black.png", "/images/live/images/iw/android-store-black.png");
await dl(ORIGIN + "/images/iw/mobile-app-ipad-white.png", "/images/live/images/iw/mobile-app-ipad-white.png");
await dl(ORIGIN + "/images/iw/mobile-app-iphone-white.png", "/images/live/images/iw/mobile-app-iphone-white.png");

const screens = [
  "home.png",
  "vacation.png",
  "Accom-certs-extend-phone.png",
  "certs.png",
  "units2.png",
  "units1.png",
];
for (const s of screens) {
  await dl(ORIGIN + "/iimedia/images/mobile/" + s, "/images/live/iimedia/images/mobile/" + s);
}

const jp = path.join(root, "data/live-pages.json");
const data = JSON.parse(fs.readFileSync(jp, "utf8"));
const page = data.pages.find((p) => p.path === "/web/cs/mobile-app");
if (page) {
  page.bodyHtml = page.bodyHtml
    .replace(/src="\/iimedia\//g, 'src="/images/live/iimedia/')
    .replace(/src="\/images\/iw\//g, 'src="/images/live/images/iw/')
    .replace(/url\(\/images\/iw\//g, "url(/images/live/images/iw/");
  page.layout = "mobile-app";
  fs.writeFileSync(jp, JSON.stringify(data, null, 2));
  console.log("mobile-app patched");
}
