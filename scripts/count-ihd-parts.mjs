const html = await fetch("https://www.intervalworld.com/web/my/hd").then((r) => r.text());
const parts = html.split(/<div class="ihd_carousel_header"/i);
console.log("parts", parts.length);
for (let i = 1; i < parts.length; i++) {
  const name = (parts[i].match(/<h2[^>]*>([^<]+)<\/h2>/i) || [])[1];
  const thumbs = (parts[i].match(/ihd_thumbnail_wrap/g) || []).length;
  // also count only top-level group / first playlist
  const firstPlaylist = parts[i].match(
    /class="[^"]*(?:mycarousel|playlist|group)[^"]*"[\s\S]*?(?=<div class="ihd_carousel_header|<h2|$)/i,
  );
  console.log(i, name?.trim(), "thumbs", thumbs, "len", parts[i].length);
}

// Look for nested region structure under US — state headings?
const us = parts[1] || "";
const h3s = [...us.matchAll(/<h3[^>]*>([^<]+)<\/h3>/gi)].map((m) => m[1]).slice(0, 20);
const h2s = [...us.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)].map((m) => m[1]);
console.log("US h2s", h2s);
console.log("US h3s", h3s);

// How many items in FIRST ul only (balanced)
const ulStart = us.search(/<ul[^>]*mycarousel[^>]*>/i);
if (ulStart >= 0) {
  let i = us.indexOf(">", ulStart) + 1;
  let depth = 1;
  const start = i;
  while (i < us.length && depth > 0) {
    const o = us.indexOf("<ul", i);
    const c = us.indexOf("</ul>", i);
    if (c < 0) break;
    if (o >= 0 && o < c) {
      depth++;
      i = o + 3;
    } else {
      depth--;
      i = c + 5;
    }
  }
  const firstUl = us.slice(start, i - 5);
  console.log("first mycarousel thumbs", (firstUl.match(/ihd_thumbnail_wrap/g) || []).length);
}
