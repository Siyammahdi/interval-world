/**
 * Pull mobile-app CSS rules from live site CSS files.
 */
const urls = [
  "https://www.intervalworld.com/css/iw/web.css",
  "https://www.intervalworld.com/css/iw/global.css",
  "https://www.intervalworld.com/css/my/my_iw_global.css",
  "https://www.intervalworld.com/iimedia/interwoven.css",
  "https://www.intervalworld.com/css/iw/mobile-app.css",
  "https://www.intervalworld.com/css/mobile-app.css",
];

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.dirname(fileURLToPath(import.meta.url));

for (const url of urls) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  console.log(url, res.status, res.headers.get("content-type"));
  if (!res.ok) continue;
  const text = await res.text();
  const keys = ["mobile-hero", "mobile-app", "icon-circle", "other-features", "aos-", "cert-thumbnail"];
  let hits = 0;
  for (const k of keys) {
    if (text.toLowerCase().includes(k.toLowerCase())) hits += 1;
  }
  console.log("  hits", hits, "len", text.length);
  if (hits > 0) {
    const name = url.split("/").pop();
    fs.writeFileSync(path.join(outDir, `mobile-css-${name}`), text);
    // Extract relevant blocks
    for (const k of ["mobile-hero", ".mobile-", "column2content"]) {
      let idx = 0;
      let n = 0;
      while ((idx = text.indexOf(k, idx)) !== -1 && n < 2) {
        console.log("\n--", k, "@", idx, "--\n", text.slice(idx, idx + 500).replace(/\n/g, " | "));
        idx += k.length;
        n += 1;
      }
    }
  }
}

// Also scan live HTML for linked stylesheets on mobile-app page
const html = await fetch("https://www.intervalworld.com/web/cs?a=60&p=mobile-app", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());
const css = [...html.matchAll(/href="([^"]+\.css[^"]*)"/gi)].map((m) => m[1]);
console.log("\npage css:\n", [...new Set(css)].join("\n"));
fs.writeFileSync(path.join(outDir, "mobile-app-live.html"), html);
