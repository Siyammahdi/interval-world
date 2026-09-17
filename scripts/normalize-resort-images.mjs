import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "data", "resort-data.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));

function normalizeImageUrl(raw) {
  if (raw == null) return "";
  let u = String(raw).trim();
  if (!u) return "";

  // Concatenated duplicate URLs: https://a.jpghttps://a.jpg
  const parts = u.split(/(?=https?:\/\/)/i).filter(Boolean);
  if (parts.length > 1) {
    u = parts.find((p) => /^https?:\/\//i.test(p) && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(p)) || parts[0];
  }

  if (u.startsWith("//")) u = `https:${u}`;

  // Missing protocol but looks like a host/path image
  if (!/^https?:\/\//i.test(u) && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(u)) {
    if (u.startsWith("www.") || u.startsWith("intervalworld.com") || u.startsWith("rci.com")) {
      u = `https://${u}`;
    } else if (u.startsWith("/")) {
      u = `https://www.intervalworld.com${u}`;
    }
  }

  // Location text accidentally stored as image
  if (!/^https?:\/\//i.test(u)) return "";

  try {
    const parsed = new URL(u);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

const keys = ["img", "img2", "img3", "img4", "img5"];
let fixed = 0;
let cleared = 0;

for (const resort of data) {
  for (const key of keys) {
    const before = resort[key];
    if (before == null || before === "") continue;
    const after = normalizeImageUrl(before);
    if (after !== before) {
      if (!after) {
        delete resort[key];
        cleared++;
      } else {
        resort[key] = after;
        fixed++;
      }
    }
  }
}

fs.writeFileSync(file, JSON.stringify(data));
console.log(`Normalized resort images. fixed=${fixed} cleared=${cleared}`);
