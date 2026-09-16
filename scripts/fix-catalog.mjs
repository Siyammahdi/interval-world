import { readFileSync, writeFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const OUT =
  "D:/Projects/TWP Clients/interval-world/scripts/live-page-catalog.json";
const catalog = JSON.parse(readFileSync(OUT, "utf8"));

function isContentImg(p) {
  return typeof p === "string" && (/^\/iimedia\//.test(p) || /^\/images\//.test(p));
}

for (const p of catalog) {
  p.allContentImages = (p.allContentImages || []).filter(isContentImg).slice(0, 20);
}

const ex = catalog.find((x) => x.path === "/web/my/info/benefits/exchange");
if (ex) {
  const html = await (
    await fetch("https://www.intervalworld.com/web/my/info/benefits/exchange", {
      headers: { "User-Agent": "Mozilla/5.0" },
    })
  ).text();
  const doc = new JSDOM(html).window.document;
  const left = doc.querySelector("#p101_2col_left");
  const landing = doc.querySelector("#landing, #body");
  ex.hasPlayButton = !!(
    (left &&
      left.querySelector(
        ".play_video, .video_thumbnail_play_hover, a.play_video"
      )) ||
    (landing &&
      landing.querySelector("a.play_video, .video_thumbnail_play_hover"))
  );
  console.log("exchange hasPlayButton:", ex.hasPlayButton);
}

writeFileSync(OUT, JSON.stringify(catalog, null, 2));
console.log(
  "magazine images:",
  catalog.find((x) => x.path.includes("magazine")).allContentImages
);
console.log("done");
