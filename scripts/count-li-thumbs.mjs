import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(__dirname, "channel-ihd_video_area.html"), "utf8");

// Count thumbs per li in first mycarousel
const ulMatch = html.match(/<ul class="[^"]*mycarousel[^"]*"[\s\S]*?<\/ul>/i);
if (!ulMatch) {
  console.log("no mycarousel");
  process.exit(1);
}
const ul = ulMatch[0];
const lis = ul.split(/<li[\s>]/i).slice(1);
console.log("li count", lis.length);
for (let i = 0; i < Math.min(5, lis.length); i++) {
  const thumbs = (lis[i].match(/ihd_thumbnail_wrap/g) || []).length;
  const labels = [...lis[i].matchAll(/ihd_destination_label">([^<]*)</g)].map((m) => m[1]);
  console.log(`li[${i}] thumbs=${thumbs} labels=${labels.join("|")}`);
}

// Canada - group?
const canadaIdx = html.indexOf(">Canada<");
console.log("\nCanada section snippet classes nearby:");
console.log(html.slice(canadaIdx - 200, canadaIdx + 400).replace(/\s+/g, " "));
