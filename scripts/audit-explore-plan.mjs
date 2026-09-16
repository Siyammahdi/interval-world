import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pages = JSON.parse(fs.readFileSync(path.join(root, "data/live-pages.json"), "utf8")).pages;

const paths = [
  "/web/my/info/planning",
  "/web/cs/directory",
  "/web/cs/mobile-app",
  "/web/my/info/planning/magazine",
  "/web/my/info/planning/community",
  "/web/my/info/planning/travel",
  "/web/my/info/planning/tracker",
];

for (const p of paths) {
  const page = pages.find((x) => x.path === p);
  if (!page) {
    console.log(p, "MISSING");
    continue;
  }
  const imgs = [...page.bodyHtml.matchAll(/src="([^"]+)"/gi)].map((m) => m[1]);
  const bg = [...page.bodyHtml.matchAll(/url\((['"]?)([^)'"]+)\1\)/gi)].map((m) => m[2]);
  const all = [...new Set([...imgs, ...bg])];
  const missing = [];
  for (const src of all) {
    if (!src.startsWith("/images/")) continue;
    const disk = path.join(root, "public", src.replace(/^\//, ""));
    if (!fs.existsSync(disk) || fs.statSync(disk).size === 0) missing.push(src);
  }
  console.log("\n" + p);
  console.log(" layout=", page.layout, " html=", page.bodyHtml.length, " assets=", all.length, " missing=", missing.length);
  if (missing.length) console.log(" missing:", missing.slice(0, 20).join("\n  "));
  console.log(" sample:", all.slice(0, 10).join(" | "));
}
