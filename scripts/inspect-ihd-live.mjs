/**
 * Inspect live Interval HD markup for carousel + badge patterns.
 */
const ORIGIN = "https://www.intervalworld.com";
const html = await fetch(ORIGIN + "/web/my/hd", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

const snippets = [];

// Hero CTA
const learn = html.match(/ihd_home[\s\S]{0,2500}/i)?.[0]?.slice(0, 1500);
snippets.push("--- hero ---\n" + (learn || "none"));

// Tabs
const tabs = html.match(/ihd_tabs[\s\S]{0,800}/i)?.[0];
snippets.push("--- tabs ---\n" + (tabs || "none"));

// First thumbnail with label
const label = html.match(/ihd_destination_label[\s\S]{0,400}/i)?.[0];
snippets.push("--- label ---\n" + (label || "none"));

// Thumbnail wrap sample
const thumb = html.match(/ihd_thumbnail_wrap[\s\S]{0,900}/i)?.[0];
snippets.push("--- thumb ---\n" + (thumb || "none"));

// HD badge / logo in thumbs
const hd = [...html.matchAll(/hd[_-]?(?:logo|badge|icon)|ihd_hd|class="[^"]*hd[^"]*"/gi)]
  .slice(0, 15)
  .map((m) => m[0]);
snippets.push("--- hd refs ---\n" + hd.join("\n"));

// Carousel JS / visible items
const car = [...html.matchAll(/visible[:\s]*(\d+)|items[:\s]*(\d+)|scroll[:\s]*(\d+)|mycarousel[\s\S]{0,200}/gi)]
  .slice(0, 20)
  .map((m) => m[0].slice(0, 180));
snippets.push("--- carousel ---\n" + car.join("\n---\n"));

// CSS for thumbnail height / rows
const cssLinks = [...html.matchAll(/href="([^"]+\.css[^"]*)"/gi)].map((m) => m[1]).slice(0, 10);
snippets.push("--- css ---\n" + cssLinks.join("\n"));

console.log(snippets.join("\n\n"));
console.log("\nhtml length", html.length);
