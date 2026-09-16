import fs from "node:fs";

const html = await fetch("https://www.intervalworld.com/web/my/channel", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

fs.writeFileSync(new URL("./channel-raw.html", import.meta.url), html);
console.log("html len", html.length);

function extractBetweenIds(source, openId) {
  const openRe = new RegExp(`<div[^>]*id=["']${openId}["'][^>]*>`, "i");
  const m = source.match(openRe);
  if (!m || m.index == null) return null;
  const start = m.index;
  let i = start + m[0].length;
  let depth = 1;
  while (i < source.length && depth > 0) {
    const nextOpen = source.indexOf("<div", i);
    const nextClose = source.indexOf("</div>", i);
    if (nextClose < 0) break;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 4;
    } else {
      depth -= 1;
      i = nextClose + 6;
      if (depth === 0) return source.slice(start, i);
    }
  }
  return null;
}

for (const id of [
  "ihd_player_wrap",
  "ihd_player_overlay",
  "channel-content",
  "ihd_home_wrap",
  "ihd_video_area",
  "tabs",
]) {
  const block = extractBetweenIds(html, id);
  console.log(id, block ? block.length : 0);
  if (block && block.length < 50000) {
    fs.writeFileSync(new URL(`./channel-${id}.html`, import.meta.url), block);
  } else if (block) {
    fs.writeFileSync(new URL(`./channel-${id}.html`, import.meta.url), block.slice(0, 80000));
    console.log("  truncated write");
  }
}

// Find CSS files for IHD
const cssHrefs = [...html.matchAll(/href=["']([^"']+\.css)["']/gi)].map((m) => m[1]);
console.log("css", cssHrefs.filter((h) => /hd|channel|video|grid/i.test(h)));

// Find hero banner image
const heroImgs = [...html.matchAll(/src=["']([^"']*(?:hd|hero|banner|laptop|beach)[^"']*\.(?:jpg|png|gif))["']/gi)].map(
  (m) => m[1],
);
console.log("hero-ish", [...new Set(heroImgs)].slice(0, 20));

// Sample first video card
const cardIdx = html.search(/JUST ADDED|just.?added|video_thumb|ihd_thumb|class=["'][^"']*video/i);
console.log("card hit", cardIdx, html.slice(Math.max(0, cardIdx - 100), cardIdx + 600).replace(/\s+/g, " "));
