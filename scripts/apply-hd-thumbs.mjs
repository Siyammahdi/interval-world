/**
 * Point every Interval HD video at a local thumb when
 * public/images/hd/thumbs/{id}.jpg exists.
 */
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "data", "interval-hd.ts");
const THUMBS = join(ROOT, "public", "images", "hd", "thumbs");

let raw = readFileSync(DATA, "utf8");
const ids = [...raw.matchAll(/"id": "(\d+)"/g)].map((m) => m[1]);
let updated = 0;

for (const id of new Set(ids)) {
  const file = join(THUMBS, `${id}.jpg`);
  if (!existsSync(file) || statSync(file).size < 800) continue;
  const local = `/images/hd/thumbs/${id}.jpg`;
  const next = raw.replace(
    new RegExp(`("id": "${id}"[\\s\\S]*?"image": ")([^"]+)(")`),
    `$1${local}$3`,
  );
  if (next !== raw) {
    raw = next;
    updated += 1;
  }
}

writeFileSync(DATA, raw);
console.log(`Updated ${updated} thumb paths from local files`);
