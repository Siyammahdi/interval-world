const html = await fetch("https://www.intervalworld.com/web/my/hd", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

const links = [...html.matchAll(/<(?:link|script)[^>]+(?:href|src)="([^"]+)"[^>]*>/gi)].map((m) => m[1]);
console.log("ALL ASSETS:");
for (const u of [...new Set(links)]) {
  if (/css|channel|ihd|hd|carousel|jcarousel/i.test(u)) console.log(u);
}

// Find inline style blocks mentioning ihd
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
console.log("\nstyle blocks", styles.length);
for (const s of styles) {
  if (/ihd|mycarousel|thumbnail/i.test(s)) {
    console.log("--- style ---\n", s.slice(0, 2000));
  }
}

// Search for background image on intro banner in full page / linked css
const candidates = [
  "/css/my/channel.css",
  "/css/my/hd.css",
  "/css/channel.css",
  "/css/my/channel/index.css",
  "/iimedia/css/channel.css",
  "/css/iw/channel.css",
  "/css/my/my_channel.css",
  "/css/jquery.jcarousel.css",
  "/css/jcarousel.css",
];
for (const c of candidates) {
  const res = await fetch("https://www.intervalworld.com" + c, { headers: { "User-Agent": "Mozilla/5.0" } });
  console.log(c, res.status, res.headers.get("content-type"));
}
