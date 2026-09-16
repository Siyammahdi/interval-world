const css = await fetch("https://www.intervalworld.com/css/channel.css", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());
const js = await fetch("https://www.intervalworld.com/scripts/channel.js", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text());

import fs from "node:fs";
fs.writeFileSync(new URL("./channel.css", import.meta.url), css);
fs.writeFileSync(new URL("./channel.js", import.meta.url), js);

const keys = [
  "ihd_play_intro",
  "ihd_intro_play",
  "ihd_thumbnail_wrap",
  "ihd_destination_label",
  "vid_info",
  "ihd_nav",
  "ihd_carousel",
  "jcarousel",
  "mycarousel",
  "visible",
  "scroll",
  "ihd_home",
];
for (const key of keys) {
  let idx = 0;
  let n = 0;
  console.log("\n#### CSS", key);
  while ((idx = css.toLowerCase().indexOf(key.toLowerCase(), idx)) !== -1 && n < 4) {
    console.log(css.slice(Math.max(0, idx - 40), idx + 280).replace(/\n/g, " | "));
    idx += key.length;
    n++;
  }
  idx = 0;
  n = 0;
  console.log("\n#### JS", key);
  while ((idx = js.toLowerCase().indexOf(key.toLowerCase(), idx)) !== -1 && n < 4) {
    console.log(js.slice(Math.max(0, idx - 40), idx + 280).replace(/\n/g, " | "));
    idx += key.length;
    n++;
  }
}
console.log("css", css.length, "js", js.length);
