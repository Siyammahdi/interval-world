import fs from "node:fs";

const html = await fetch("https://www.intervalworld.com/web/my/hd", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

const idx = html.indexOf(">Canada</h2>");
console.log("Canada h2 at", idx);
console.log(html.slice(idx, idx + 2500).replace(/\s+/g, " ").slice(0, 2000));

const idx2 = html.indexOf(">United States</h2>");
console.log("\n\nUS after header classes:");
const usChunk = html.slice(idx2, idx2 + 1500);
const classes = [...usChunk.matchAll(/class="([^"]+)"/g)].map((m) => m[1]).slice(0, 30);
console.log(classes);

// Count jcarousel-item directly under first carousel after US
const usPart = html.split(/<div class="ihd_carousel_header"/i)[1] || "";
const uls = [...usPart.matchAll(/<ul[^>]*class="([^"]*)"[^>]*>/gi)].slice(0, 10);
console.log("\nUS ul classes", uls.map((m) => m[1]));

// How many ihd_thumbnail_wrap before next h2 Canada
const canIdx = usPart.search(/>Canada</);
const beforeCanada = usPart.slice(0, canIdx > 0 ? canIdx : 50000);
const thumbs = beforeCanada.match(/ihd_thumbnail_wrap/g) || [];
console.log("thumbs before Canada heading in US part", thumbs.length, "canIdx", canIdx);
