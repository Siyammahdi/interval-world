import fs from "node:fs";

const html = await fetch("https://www.intervalworld.com/web/my/channel", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

fs.writeFileSync(new URL("./channel-raw.html", import.meta.url), html);
const ids = [...html.matchAll(/id=["']([^"']+)["']/g)].map((m) => m[1]);
const uniq = [...new Set(ids)].filter((id) =>
  /content|video|channel|main|body|wrapper|page|hd/i.test(id),
);
console.log("interesting ids:", uniq.slice(0, 80).join("\n"));
console.log("len", html.length);

// try to find Interval HD heading
const idx = html.search(/Interval HD|Interval Video|related_videos/i);
console.log("hit at", idx, html.slice(Math.max(0, idx - 100), idx + 400).replace(/\s+/g, " "));

const offices = await fetch("https://www.intervalworld.com/web/cs?a=60&p=offices").then((r) =>
  r.text(),
);
const c2 = offices.match(/id=["']column2content["'][^>]*>([\s\S]{0,500})/);
console.log("\noffices column2 start:", c2?.[1]?.replace(/\s+/g, " ").slice(0, 400));
const about = await fetch("https://www.intervalworld.com/web/cs?a=60&p=about").then((r) => r.text());
const a2 = about.match(/id=["']column2content["'][^>]*>([\s\S]{0,800})/);
console.log("\nabout column2:", a2?.[1]?.replace(/\s+/g, " ").slice(0, 500));
